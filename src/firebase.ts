import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyCvCTO3BqsaBDk_aCA1DKFwSGNxNnT83jE',
  authDomain: 'framedock-2fe2d.firebaseapp.com',
  projectId: 'framedock-2fe2d',
  storageBucket: 'framedock-2fe2d.firebasestorage.app',
  messagingSenderId: '581646784121',
  appId: '1:581646784121:web:64496bea6ebf326bbb26a8',
  measurementId: 'G-QDYKQFEQB7',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;
