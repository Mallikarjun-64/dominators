from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import re
from typing import List, Optional
import joblib
import os
from urllib.parse import urlparse
import difflib

app = FastAPI()

# =========================
# CORS
# =========================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# DATA MODELS
# =========================

class EmailInput(BaseModel):
    emailBody: str

class URLInput(BaseModel):
    url: str

class UPIInput(BaseModel):
    upi: str

class ClassificationResponse(BaseModel):
    safety: str
    confidence: float
    reason: Optional[str]
    indicators: List[str]

class URLDetails(BaseModel):
    https: bool
    domain_age: str
    ssl_status: str

class URLClassificationResponse(BaseModel):
    safety: str
    confidence: int
    indicators: List[str]
    details: URLDetails


# =========================
# LOAD ML MODEL
# =========================

model_path = os.path.join(os.path.dirname(__file__), "models", "email_classifier.joblib")

if os.path.exists(model_path):
    model = joblib.load(model_path)
else:
    model = None


# =========================
# LEGITIMATE MESSAGE DETECTOR
# =========================

def is_legitimate_notification(body: str) -> bool:

    body = body.lower()

    legit_patterns = [
        "transaction id",
        "txn id",
        "payment successful",
        "payment completed",
        "upi payment",
        "debited from your account",
        "credited to your account",
        "no action required",
        "thank you for using",
        "transaction alert",
        "payment notification"
    ]

    phishing_requests = [
        "share otp",
        "send otp",
        "enter password",
        "confirm your account",
        "login to verify",
        "update bank details"
    ]

    if any(p in body for p in phishing_requests):
        return False

    if any(p in body for p in legit_patterns):
        return True

    return False


# =========================
# PHISHING INDICATORS
# =========================

def analyze_phishing_indicators(body: str):

    indicators = []
    score = 0
    body = body.lower()

    # High-Risk Keywords (Directly Dangerous)
    critical_keywords = [
        "share otp", "send otp", "enter password", "provide otp", "enter your upi pin",
        "confirm your upi pin", "share your pin", "verify your password", "enter your bank details",
        "share card number", "enter cvv", "atm pin required", "account will be blocked",
        "account suspended", "permanent block", "scam", "phishing", "fraudulent"
    ]

    # Medium-Risk Keywords (Suspicious, need multiple or ML confirmation)
    suspicious_keywords = [
        "urgent", "immediately", "act now", "verify your account", "confirm your identity",
        "security alert", "suspicious activity detected", "unauthorized transaction",
        "final warning", "respond immediately", "update your account", "update your details",
        "login immediately", "verify now", "click here", "tap here", "open this link",
        "secure link", "confirm here", "verify using this link", "payment failed",
        "payment pending", "transaction declined", "account locked", "fraud detected",
        "security verification required", "complete verification", "re-authenticate your account",
        "you have won", "congratulations you won", "claim your prize", "lottery winner",
        "free gift", "cash reward", "cashback reward", "reward waiting", "exclusive reward",
        "bank security team", "upi support team", "customer support department",
        "government authority", "cyber crime department", "income tax department",
        "legal action", "legal notice", "penalty will be charged", "service suspended",
        "account terminated", "complaint registered", "limited time offer",
        "verify within 30 minutes", "respond within 24 hours",
        "failure to verify will result in suspension", "http://", "https://", "malicious", "fake",
        "dangerous", "suspicious", "verify-account", "update-now", "login-security",
        "account-alert", "secure-payment", "bit.ly", "tinyurl.com", "cutt.ly", "t.co", "ow.ly", "is.gd"
    ]

    for kw in critical_keywords:
        if kw in body:
            indicators.append(kw)
            score += 50 # Critical score

    for kw in suspicious_keywords:
        if kw in body:
            indicators.append(kw)
            score += 15 # Suspicious score

    return indicators, score


# =========================
# EMAIL CLASSIFIER
# =========================

@app.post("/api/classify-email", response_model=ClassificationResponse)
async def classify_email(email: EmailInput):

    body = email.emailBody
    indicators, score = analyze_phishing_indicators(body)
    is_legit = is_legitimate_notification(body)

    # Use ML model as supplementary check
    ml_dangerous = False
    ml_confidence = 0.0
    
    if model:
        try:
            ml_pred = model.predict([body])[0]
            probas = model.predict_proba([body])[0]
            classes = list(model.classes_)
            idx = classes.index(ml_pred)
            ml_confidence = float(probas[idx])
            if ml_pred == "dangerous" and ml_confidence > 0.7:
                ml_dangerous = True
                score += 30 # ML adds significant weight
                indicators.append("statistical_pattern")
        except:
            pass

    # Reduce score if it looks like a legitimate notification
    if is_legit:
        score -= 40
        if score < 0: score = 0

    # Decision Logic (Now categorizing suspicious as dangerous)
    if score >= 20:
        prediction = "dangerous"
        confidence = min(0.99, 0.7 + (score / 200))
        reason = f"Malicious or suspicious patterns detected: {', '.join(set(indicators))}"
    else:
        prediction = "safe"
        confidence = 0.95
        reason = "No significant phishing indicators found."

    return {
        "safety": prediction,
        "confidence": confidence,
        "reason": reason,
        "indicators": list(set(indicators))
    }


# =========================
# URL CLASSIFIER
# =========================

@app.post("/api/classify-url", response_model=URLClassificationResponse)
async def classify_url(url_input: URLInput):

    url = url_input.url

    score = 0
    indicators = []

    https = url.lower().startswith("https")

    if not https:
        score += 20
        indicators.append("HTTP connection")

    parsed = urlparse(url if "://" in url else "http://" + url)

    domain = parsed.netloc.lower()

    if domain.startswith("www."):
        domain = domain[4:]

    trusted_domains = [
        "google.com",
        "amazon.com",
        "apple.com",
        "microsoft.com",
        "paypal.com",
        "facebook.com",
        "instagram.com",
        "youtube.com",
        "linkedin.com",
        "github.com",
        "chatgpt.com",
        "openai.com"
    ]

    valid_tlds = [
        ".com",".org",".net",".edu",".gov",".info",".biz",".xyz",".online",
        ".site",".store",".tech",".dev",".app",".io",".ai",".in",".uk"
    ]

    if not any(domain.endswith(t) for t in valid_tlds):
        score += 60
        indicators.append("invalid_extension")

    if domain in trusted_domains:
        score = 0
        indicators = []

    else:

        for trusted in trusted_domains:

            base = trusted.split(".")[0]

            part = domain.split(".")[0]

            match = difflib.get_close_matches(part, [base], cutoff=0.8)

            if match and part != base:
                score += 50
                indicators.append("typosquatting")
                break

        if re.search(r'\d+\.\d+\.\d+\.\d+', url):
            score += 40
            indicators.append("ip_address_url")

        if len(url) > 120:
            score += 20
            indicators.append("very_long_url")

        shorteners = ["bit.ly","tinyurl","t.co"]

        if any(s in url for s in shorteners):
            score += 35
            indicators.append("shortened_url")

    if score < 20:
        safety = "safe"
    elif score < 50:
        safety = "suspicious"
    else:
        safety = "dangerous"

    confidence = min(99, 40 + score)

    ssl_status = "valid" if https else "invalid"

    domain_age = "Unknown"

    if score > 40:
        domain_age = "Likely new domain"

    return {
        "safety": safety,
        "confidence": confidence,
        "indicators": list(set(indicators)),
        "details": {
            "https": https,
            "domain_age": domain_age,
            "ssl_status": ssl_status
        }
    }


# =========================
# UPI CLASSIFIER
# =========================

import re
from urllib.parse import urlparse, parse_qs

@app.post("/api/classify-upi", response_model=ClassificationResponse)
async def classify_upi(upi_input: UPIInput):

    raw_input = upi_input.upi.lower().strip()

    trusted_upi_handles = [
        "oksbi", "okaxis", "okhdfcbank", "okicici",
        "ybl", "ibl", "paytm", "upi", "axl", "apl", "airtel"
    ]

    suspicious_keywords = [
        "scam", "fraud", "verify", "urgent", "payment",
        "paynow", "claim", "lottery", "reward",
        "refund", "support", "helpdesk", "offer", "bank"
    ]

    indicators = []
    safety = "suspicious"
    confidence = 85.0
    reason = "UPI requires verification."

    # -------- 1️⃣ Extract UPI ID if full UPI payment URL --------
    upi = raw_input
    if raw_input.startswith("upi://"):
        try:
            parsed = urlparse(raw_input)
            params = parse_qs(parsed.query)
            upi = params.get("pa", [""])[0]
        except:
            indicators.append("Invalid UPI payment URL")

    upi = upi.strip()

    # -------- 2️⃣ Validate format --------
    if "@" not in upi:
        indicators.append("Invalid UPI format")
        return {
            "safety": "dangerous",
            "confidence": 99.0,
            "reason": "Invalid UPI ID format",
            "indicators": indicators
        }

    username, handle = upi.split("@", 1)

    # -------- 3️⃣ Check suspicious keywords in FULL UPI --------
    for keyword in suspicious_keywords:
        if keyword in upi:
            indicators.append(f"Suspicious keyword detected: {keyword}")

    # -------- 4️⃣ Detect suspicious special characters --------
    if re.search(r"[^a-z0-9@._-]", upi):
        indicators.append("Suspicious special characters detected")

    # -------- 5️⃣ Check handle reputation --------
    if handle not in trusted_upi_handles:
        indicators.append("Unverified UPI handle")

    # -------- 6️⃣ Final decision --------
    if indicators:
        safety = "dangerous"
        confidence = 90.0
        reason = "Suspicious indicators found in UPI ID"
    else:
        safety = "safe"
        confidence = 98.0
        reason = f"Verified trusted UPI handle: {handle}"

    return {
        "safety": safety,
        "confidence": confidence,
        "reason": reason,
        "indicators": indicators
    }


# =========================
# RUN SERVER
# =========================

if __name__ == "__main__":

    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)