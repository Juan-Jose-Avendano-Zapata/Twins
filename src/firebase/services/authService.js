import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
} from 'firebase/auth';
import { doc, getDocs, setDoc, getDoc, Timestamp, collection, query, where, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export const authService = {
    // Register new user with optional profile picture
    async register(name, username, email, password, profilePictureUrl = "") {
        try {
            // Check if email already exist
            const emailQuery = query(
                collection(db, 'users'),
                where('email', '==', email.toLowerCase())
            );
            const emailSnapshot = await getDocs(emailQuery);

            if (!emailSnapshot.empty) {
                return { success: false, error: 'Email is already in use' };
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

            // Create user in Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Update profile with display name and photo URL
            await updateProfile(user, {
                displayName: name,
                photoURL: profilePictureUrl || ""
            });

            // Save additional user data in Firestore
            await setDoc(doc(db, 'users', user.uid), {
                email: email.toLowerCase(),
                followers: [],
                following: [],
                profile: {
                    avatar: profilePictureUrl || "",
                    createdAt: Timestamp.now(),
                    name: name,
                },
                stats: {
                    followersCount: 0,
                    followingCount: 0
                },
                username: username.toLowerCase()
            });

            return { success: true, user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Login
    async login(username, password) {
        try {
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where('username', '==', username.toLowerCase()));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                return { success: false, error: 'Username not found' };
            }

            const userDoc = querySnapshot.docs[0];
            const email = userDoc.data().email;

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

    // Get current authenticated user
    getCurrentUser() {
        return auth.currentUser;
    },

    async updateProfilePicture(uid, profilePictureUrl) {
        try {
            // Update in Firebase Auth
            await updateProfile(auth.currentUser, {
                photoURL: profilePictureUrl
            });

            // Update in Firestore
            await setDoc(doc(db, 'users', uid), {
                'profile.avatar': profilePictureUrl
            }, { merge: true });

            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    async updateProfile({ name, username, avatar }) {
        try {
            const user = auth.currentUser;
            if (!user) {
                return { success: false, error: 'User not authenticated' };
            }

            // Check if the username is already in use by another user
            const usernameQuery = query(
                collection(db, 'users'),
                where('username', '==', username.toLowerCase())
            );
            const usernameSnapshot = await getDocs(usernameQuery);

            if (!usernameSnapshot.empty) {
                const usernameTakenByOther = usernameSnapshot.docs.some(doc => doc.id !== user.uid);
                if (usernameTakenByOther) {
                    return { success: false, error: 'Username is already taken' };
                }
            }

            // Update profile Firebase Auth
            const updateDataAuth = {};
            if (name) updateDataAuth.displayName = name;
            if (avatar) updateDataAuth.photoURL = avatar;

            if (Object.keys(updateDataAuth).length > 0) {
                await updateProfile(user, updateDataAuth);
            }

            // Update in Firestore
            const updateDataFirestore = {
                username: username.toLowerCase(),
                'profile.name': name,
            };
            if (avatar) updateDataFirestore['profile.avatar'] = avatar;

            await updateDoc(doc(db, 'users', user.uid), updateDataFirestore);

            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
};