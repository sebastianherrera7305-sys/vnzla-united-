import { initializeApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyDA68MFVeqI6_If7UDQRRPszGC-EO-Wt94',
  authDomain: 'venezuela-united.firebaseapp.com',
  projectId: 'venezuela-united',
  storageBucket: 'venezuela-united.appspot.com',
  messagingSenderId: '1234567890',
  appId: '1:1234567890:web:abcdef'
}

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)
export const db = getFirestore(app)
