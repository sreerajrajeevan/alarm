'use client';

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore, onSnapshot, Query, DocumentReference } from 'firebase/firestore';
import { getAuth, Auth, User, onAuthStateChanged } from 'firebase/auth';
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
  auth: Auth | undefined;
  user: User | null | undefined;
}>({
  firebaseApp: undefined,
  firestore: undefined,
  auth: undefined,
  user: undefined,
});

export const useFirebase = () => useContext(FirebaseContext);
export const useFirestore = () => useContext(FirebaseContext).firestore;
export const useAuth = () => useContext(FirebaseContext).auth;
export const useUser = () => {
  const { user } = useContext(FirebaseContext);
  return { user, loading: user === undefined };
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
  const [user, setUser] = useState<User | null | undefined>(undefined);

  const { firebaseApp, firestore, auth } = useMemo(() => {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    const db = getFirestore(app);
    const authInstance = getAuth(app);
    return { firebaseApp: app, firestore: db, auth: authInstance };
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, [auth]);

  return (
    <FirebaseContext.Provider value={{ firebaseApp, firestore, auth, user }}>
      {children}
    </FirebaseContext.Provider>
  );
};
