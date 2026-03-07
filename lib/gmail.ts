import { google } from 'googleapis';
import { oauth2Client } from './googleAuth';
import { db } from '@/services/firebaseConfig';
import { doc, getDoc, updateDoc, collection, addDoc, query, where, getDocs, Timestamp } from 'firebase/firestore';

export async function getGmailInbox(uid: string) {
  // 1. Fetch tokens from Firestore
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    throw new Error('User not found');
  }

  const userData = userSnap.data();
  const accessToken = userData.gmail_access_token;
  const refreshToken = userData.gmail_refresh_token;
  const expiryDate = userData.gmail_token_expiry;
  const employeeEmail = userData.email;

  if (!accessToken) {
    throw new Error('Gmail not connected');
  }

  // 2. Set credentials
  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
    expiry_date: expiryDate,
  });

  // 3. Handle token refresh if needed
  oauth2Client.on('tokens', async (tokens) => {
    if (tokens.access_token) {
      await updateDoc(userRef, {
        gmail_access_token: tokens.access_token,
        gmail_token_expiry: tokens.expiry_date || null,
      });
    }
  });

  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

  // 4. Fetch inbox
  const response = await gmail.users.messages.list({
    userId: 'me',
    maxResults: 10,
    q: 'is:inbox',
  });

  const messages = response.data.messages || [];
  const detailedMessages = await Promise.all(
    messages.map(async (message) => {
      const msg = await gmail.users.messages.get({
        userId: 'me',
        id: message.id as string,
      });

      const headers = msg.data.payload?.headers || [];
      const sender = headers.find((h) => h.name === 'From')?.value || 'Unknown';
      const subject = headers.find((h) => h.name === 'Subject')?.value || 'No Subject';
      const date = headers.find((h) => h.name === 'Date')?.value || 'No Date';
      const snippet = msg.data.snippet || '';

      // Extract full body content
      const getBody = (payload: any): string => {
        let body = "";
        if (payload.parts) {
          payload.parts.forEach((part: any) => {
            if (part.mimeType === "text/plain" && part.body.data) {
              body += Buffer.from(part.body.data, 'base64').toString();
            } else if (part.parts) {
              body += getBody(part);
            }
          });
        } else if (payload.body.data) {
          body = Buffer.from(payload.body.data, 'base64').toString();
        }
        return body;
      };

      const body = getBody(msg.data.payload) || snippet;

      // Call FastAPI phishing detection backend
      let classification = 'Safe';
      let confidence = 0;
      let reason = 'No suspicious indicators found.';

      try {
        const response = await fetch('http://127.0.0.1:8000/api/classify-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ emailBody: snippet }),
        });

        if (response.ok) {
          const result = await response.json();
          // Normalize classification string (Safe, Suspicious, Dangerous)
          classification = result.safety.charAt(0).toUpperCase() + result.safety.slice(1);
          confidence = result.confidence;
          reason = result.reason;
        }
      } catch (error) {
        console.error('Error calling phishing detection backend:', error);
      }

      const emailData = {
        id: message.id,
        messageId: message.id,
        user_uid: uid,
        employee_email: employeeEmail,
        sender,
        subject,
        snippet,
        body,
        date,
        classification,
        confidence,
        reason,
        timestamp: new Date(),
      };

      // 5. Store in Firestore (Avoid duplicates based on messageId and user_uid)
      const emailQuery = query(
        collection(db, 'emails'),
        where('messageId', '==', message.id),
        where('user_uid', '==', uid)
      );
      const emailSnap = await getDocs(emailQuery);
      
      if (emailSnap.empty) {
        await addDoc(collection(db, 'emails'), emailData);
        
        // 6. Log for employees only (not admin)
        if (userData.role === 'employee') {
          await addDoc(collection(db, 'email_logs'), {
            employeeEmail: employeeEmail,
            subject: subject,
            sender: sender,
            safety: classification.toLowerCase(),
            confidence: confidence,
            reason: reason,
            analyzedAt: Timestamp.now()
          });
        }
      }

      return emailData;
    })
  );

  return detailedMessages;
}

export async function deleteGmailMessage(uid: string, messageId: string) {
  // 1. Fetch tokens from Firestore
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    throw new Error('User not found');
  }

  const userData = userSnap.data();
  const accessToken = userData.gmail_access_token;
  const refreshToken = userData.gmail_refresh_token;
  const expiryDate = userData.gmail_token_expiry;

  if (!accessToken) {
    throw new Error('Gmail not connected');
  }

  // 2. Set credentials
  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
    expiry_date: expiryDate,
  });

  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

  // 3. Delete message
  await gmail.users.messages.trash({
    userId: 'me',
    id: messageId,
  });

  return { success: true };
}
