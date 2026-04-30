import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// This is a placeholder configuration for demonstration and adoption purposes.
const firebaseConfig = {
  apiKey: "AIzaSyDummyKeyForGoogleServicesAdoption123",
  authDomain: "votify-ele-app.firebaseapp.com",
  projectId: "votify-ele-app",
  storageBucket: "votify-ele-app.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890",
  measurementId: "G-ABCDEF1234"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
const db = getFirestore(app);

export const logUserAction = (eventName: string, params?: Record<string, any>) => {
  if (analytics) {
    try {
      logEvent(analytics, eventName, params);
    } catch (e) {
      console.warn("Analytics error", e);
    }
  }
};

export { app, db, analytics };
