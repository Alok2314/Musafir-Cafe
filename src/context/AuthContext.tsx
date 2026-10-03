import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';
import { UserProfile } from '../types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  signInWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signupWithEmail: (email: string, pass: string, name: string, phone?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const ADMIN_EMAIL = 'prajapatialok926@gmail.com';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Sync user profile from Firestore and ensure admin role
  const syncProfile = async (firebaseUser: User) => {
    const userDocRef = doc(db, 'users', firebaseUser.uid);
    const isTargetAdmin = firebaseUser.email?.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase().trim();
    console.log('[AUTH ROLE] Authenticated User UID:', firebaseUser.uid, 'Email:', firebaseUser.email, 'isAdmin:', isTargetAdmin);

    try {
      const snap = await getDoc(userDocRef);
      if (snap.exists()) {
        const data = snap.data() as UserProfile;
        
        // If this is the admin account, ensure role is "admin" in Firestore
        if (isTargetAdmin && data.role !== 'admin') {
          const updated = { ...data, role: 'admin' as const };
          await setDoc(userDocRef, updated, { merge: true });
          console.log('[AUTH ROLE] Automatically promoted user document in users collection to role: admin');
          setProfile(updated);
        } else {
          console.log('[AUTH ROLE] Loaded existing user document with role:', data.role);
          setProfile(data);
        }
      } else {
        // Document does not exist yet -> automatically create it
        const initialProfile: UserProfile = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || (isTargetAdmin ? 'Musafir Admin' : 'Musafir Diner'),
          email: firebaseUser.email || '',
          phone: firebaseUser.phoneNumber || '',
          role: isTargetAdmin ? 'admin' : 'customer',
          createdAt: new Date().toISOString()
        };
        await setDoc(userDocRef, initialProfile);
        console.log('[AUTH ROLE] Created initial user document in users/' + firebaseUser.uid + ' with role:', initialProfile.role);
        setProfile(initialProfile);
      }
    } catch (err) {
      console.warn('Could not sync user profile with Firestore:', err);
      // Fallback local representation so app continues without breaking
      setProfile({
        uid: firebaseUser.uid,
        name: firebaseUser.displayName || (isTargetAdmin ? 'Musafir Admin' : 'Customer'),
        email: firebaseUser.email || '',
        phone: firebaseUser.phoneNumber || '',
        role: isTargetAdmin ? 'admin' : 'customer',
        createdAt: new Date().toISOString()
      });
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async currentUser => {
      setUser(currentUser);
      if (currentUser) {
        await syncProfile(currentUser);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const res = await signInWithPopup(auth, provider);
    if (res.user) {
      await syncProfile(res.user);
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    const res = await signInWithEmailAndPassword(auth, email, pass);
    if (res.user) {
      await syncProfile(res.user);
    }
  };

  const signupWithEmail = async (email: string, pass: string, name: string, phone?: string) => {
    const res = await createUserWithEmailAndPassword(auth, email, pass);
    if (res.user) {
      await updateProfile(res.user, { displayName: name });
      const isTargetAdmin = email.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase().trim();
      const newProfile: UserProfile = {
        uid: res.user.uid,
        name: name.trim(),
        email: email.trim(),
        phone: phone?.trim() || '',
        role: isTargetAdmin ? 'admin' : 'customer',
        createdAt: new Date().toISOString()
      };
      try {
        await setDoc(doc(db, 'users', res.user.uid), newProfile);
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `users/${res.user.uid}`);
      }
      setProfile(newProfile);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setProfile(null);
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    const userDocRef = doc(db, 'users', user.uid);
    try {
      await setDoc(userDocRef, data, { merge: true });
      setProfile(prev => (prev ? { ...prev, ...data } : null));
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`);
    }
  };

  // Admin evaluation: true if profile.role === 'admin' OR current email matches prajapatialok926@gmail.com
  const isAdmin = Boolean(
    profile?.role === 'admin' ||
    user?.email?.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase().trim()
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isAdmin,
        signInWithGoogle,
        loginWithEmail,
        signupWithEmail,
        logout,
        updateUserProfile,
        isAuthModalOpen,
        setIsAuthModalOpen
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
