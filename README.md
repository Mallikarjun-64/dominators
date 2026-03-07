# Human Firewall

**Human Firewall** is a comprehensive cybersecurity platform designed to protect organizations from phishing attacks and other social engineering threats. It provides tools for real-time email analysis, URL scanning, and employee security training.

## 🚀 Features

- **AI Email Analyzer**: Deep neural network analysis of email headers and content for hidden phishing markers.
- **URL Phishing Scanner**: Real-time scanning and classification of suspicious URLs and domain landing pages.
- **Browser Extension (URL Analyser)**: Real-time browser-level protection that monitors every URL you visit and intercepts malicious sites with a warning prompt.
- **Gmail Inbox Scanner**: Connect your workspace directly for continuous monitoring of all incoming communication.
- **Employee Risk Monitoring**: Identify high-risk behavior and track security posture across your organization.
- **Phishing Training Simulator**: Conduct safe phishing simulation tests to train and evaluate employee responses.
- **Real-time Threat Detection**: Immediate notification and blocking of verified phishing threats across the platform.
- **Reports & Analytics**: Detailed visualizations and exportable reports on security indicators and threat flows.
  - **Weekly Security Posture**: A comprehensive report of employee scans and risk levels (Exportable as CSV/Excel).
  - **Employee Training Summary**: Insights into employee training progress and compliance status.
  - **Threat Analysis Log**: Detailed timestamps, sender, and subject analysis of detected threats.

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Charts**: [Recharts](https://recharts.org/) & [D3.js](https://d3js.org/)
- **Icons**: [Lucide React](https://lucide.dev/)

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/)
- **Server**: [Uvicorn](https://www.uvicorn.org/)
- **Validation**: [Pydantic](https://docs.pydantic.dev/)

### Services & Integration
- **Authentication**: [Firebase Auth](https://firebase.google.com/docs/auth)
- **Database**: [Firebase Cloud Firestore](https://firebase.google.com/docs/firestore)
- **APIs**: [Google Gmail API](https://developers.google.com/gmail/api), [Google Auth](https://developers.google.com/identity/protocols/oauth2)

## 📦 Getting Started

### Prerequisites
- Node.js (v18+)
- Python (v3.9+)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/humanfirewall.git
   cd humanfirewall
   ```

2. **Frontend Setup**
   ```bash
   npm install
   ```

3. **Backend Setup**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

### Running the Application

#### Option 1: Automated (Recommended)
Double-click `run_all.bat` in the root directory. This will start both the Backend (Python) and Frontend (Next.js) servers in separate windows.

#### Option 2: Manual
1. **Start the Backend Server**
   ```bash
   cd backend
   python main.py
   ```
   The backend will run on `http://localhost:8000`.

2. **Start the Frontend Development Server**
   ```bash
   # In the root directory
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

## 🔌 Browser Extension Installation

1. Open your browser (Chrome/Edge/Brave) and navigate to `chrome://extensions/`.
2. Enable **Developer mode** (top-right toggle).
3. Click **Load unpacked**.
4. Select the `extension/` folder in the project root.
5. The **URL Analyser** will now monitor all your web traffic in real-time.

## 📁 Project Structure

- `app/`: Next.js application routes and pages.
- `backend/`: FastAPI backend implementation and classification models.
- `extension/`: Browser extension source code (Manifest V3).
- `components/`: Reusable React components.
- `context/`: React Context providers (Auth, etc.).
- `lib/`: Utility libraries and external API configurations.
- `services/`: Firebase and other service integrations.

## 📄 License
This project is licensed under the ISC License.
