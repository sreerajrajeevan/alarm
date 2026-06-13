'use client';

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore, onSnapshot, Query, DocumentReference } from 'firebase/firestore';
import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "mock-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "mock-auth",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "mock-project",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "mock-storage",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "mock-sender",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "mock-app"
};

const FirebaseContext = createContext<{
  firebaseApp: FirebaseApp | undefined;
  firestore: Firestore | undefined;
}>({
  firebaseApp: undefined,
  firestore: undefined,
});

export const useFirebase = () => useContext(FirebaseContext);
export const useFirestore = () => useContext(FirebaseContext).firestore;

// Mock user for local storage/guest use without Auth
export const useUser = () => {
  return { user: { uid: 'guest-user' }, loading: false };
};

export function useCollection<T>(query: Query | null | undefined) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!query) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = onSnapshot(
      query,
      (snapshot) => {
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as any[];
        setData(items);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [query]);

  return { data, loading, error };
}

export function useDoc<T>(docRef: DocumentReference | null | undefined) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!docRef) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = onSnapshot(
      docRef,
      (doc) => {
        if (doc.exists()) {
          setData({ id: doc.id, ...doc.data() } as any);
        } else {
          setData(null);
        }
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [docRef]);

  return { data, loading, error };
}

export const FirebaseClientProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { firebaseApp, firestore } = useMemo(() => {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    const db = getFirestore(app);
    return { firebaseApp: app, firestore: db };
  }, []);

  return (
    <FirebaseContext.Provider value={{ firebaseApp, firestore }}>
      {children}
    </FirebaseContext.Provider>
  );
};
