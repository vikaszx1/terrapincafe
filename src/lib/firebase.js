import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey:            'AIzaSyAsDhuyTJaXqoeIo8ScUaBl730NkhclVpE',
  authDomain:        'terrapin-creek-cafe-21f90.firebaseapp.com',
  projectId:         'terrapin-creek-cafe-21f90',
  storageBucket:     'terrapin-creek-cafe-21f90.firebasestorage.app',
  messagingSenderId: '472503402683',
  appId:             '1:472503402683:web:4f7220c418aafe564ca99e',
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
