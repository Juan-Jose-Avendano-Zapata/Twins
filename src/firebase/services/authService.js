import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile
} from 'firebase/auth';
import { doc, getDocs, setDoc, getDoc, Timestamp, collection, query, where } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export const authService = {
    // Register new user
    async register(name, username, email, password) {
        try {
            // Check if email already exist
            const emailQuery = query(
                collection(db, 'users'), 
                where('email', '==', email.toLowerCase())
            );
            const emailSnapshot = await getDocs(emailQuery);

            if (!emailSnapshot.empty) {
                return { success: false, error: 'Email  is already in use' };
            }

            // Check username already exist
            const usernameQuery = query(
                collection(db, 'users'), 
                where('username', '==', username.toLowerCase())
            );
            const usernameSnapshot = await getDocs(usernameQuery);
            
            if (!usernameSnapshot.empty) {
                return { success: false, error: 'Username is already taken' };
            }
            // Crete user in Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Update profile with display name
            await updateProfile(user, { displayName: name });

            // Save additional user data in Firestore
            await setDoc(doc(db, 'users', user.uid), {
                email: email,
                followers: [],
                following: [],
                profile: {
                    avatar: "",
                    createdAt: Timestamp.now(),
                    name: name,
                },
                stats:{
                    followersCount: 0,
                    followingCount: 0
                },
                username: username
            });

            return { success: true, user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Login
    async login(username, password) {
        try {
            const usersRef=collection(db,'users');
            const q=query(usersRef,where('username','==',username.toLowerCase()));
            const querySnapshot=await getDocs(q);

            if(querySnapshot.empty){
                return { success: false, error: 'Username not found' };
            }

            const userDoc=querySnapshot.docs[0];
            const email=userDoc.data().email;

            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return { success: true, user: userCredential.user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Logout
    async logout() {
        try {
            await signOut(auth);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Get user profile
    async getUserProfile(uid) {
        try {
            const docRef = doc(db, 'users', uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return { success: true, data: docSnap.data() };
            } else {
                return { success: false, error: 'No such user profile' };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Get current authenticated user
    getCurrentUser() {
        return auth.currentUser;
    }
};