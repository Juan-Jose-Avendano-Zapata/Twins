import {
    collection,
    getDocs,
    query,
    orderBy,
    where,
    doc,
    getDoc,
    updateDoc,
    deleteDoc,
    Timestamp,
    addDoc,
    increment,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { authService } from "./authService";

const userService = {

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

    // Get current user profile
    async getCurrentUserProfile() {
        try {
            const userProfile = await this.getUserProfile(authService.getCurrentUser().uid);
            if (!userProfile.success) {
                return {
                    success: false,
                    error: userProfile.error || 'Not Authenticated'
                };
            }
            return { sussess: true, profileData: userProfile };
        } catch (error) {
            console.error('Error getting user profile:', error);
        }
    },

    // Search user by text
    async searchUsers(queryText) {
        try {
            const currentUser = authService.getCurrentUser();
            if (!queryText.trim()) {
                return { success: true, data: [] };
            }

            const usersRef = collection(db, "users");
            const searchTerm = queryText.toLowerCase().trim();

            // Search by username
            const usernameQuery = query(
                usersRef,
                where("username", ">=", searchTerm),
                where("username", "<=", searchTerm + '\uf8ff')
            );

            const usernameSnap = await getDocs(usernameQuery);
            const usernameUsers = usernameSnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Search by name
            const nameQuery = query(
                usersRef,
                where("profile.name", ">=", searchTerm),
                where("profile.name", "<=", searchTerm + '\uf8ff')
            );

            const nameSnap = await getDocs(nameQuery);
            const nameUsers = nameSnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            const allUsers = [...usernameUsers, ...nameUsers];
            const uniqueUsers = allUsers.filter((user, index, self) =>
                index === self.findIndex(u => u.id === user.id)
            );

            const filteredUsers = uniqueUsers.filter(user =>
                user.id !== currentUser?.uid
            );

            return { success: true, data: filteredUsers };

        } catch (e) {
            console.error("UserService searchUsers error:", e);
            return { success: false, error: e.message };
        }
    },

    // Follow user
    async followUser(targetUserId) {
        try {
            const current = authService.getCurrentUser();
            if (!current) return { success: false, error: "Not authenticated" };

            if (current.uid === targetUserId)
                return { success: false, error: "You can't follow yourself" };

            const currentRef = doc(db, "users", current.uid);
            const targetRef = doc(db, "users", targetUserId);

            const currentSnap = await getDoc(currentRef);
            const targetSnap = await getDoc(targetRef);

            if (!currentSnap.exists() || !targetSnap.exists()) {
                return { success: false, error: "User not found" };
            }

            const currentData = currentSnap.data();
            const targetData = targetSnap.data();

            const updatedFollowing = [...(currentData.following || []), targetUserId];
            const updatedFollowers = [...(targetData.followers || []), current.uid];

            await updateDoc(currentRef, { following: updatedFollowing });
            await updateDoc(targetRef, { followers: updatedFollowers });
            await updateDoc(currentRef, { "stats.followingCount": increment(1) });
            await updateDoc(targetRef, { "stats.followersCount": increment(1) });

            return { success: true };

        } catch (e) {
            console.error("UserService followUser error:", e);
            return { success: false, error: e.message };
        }
    },

    // Unfollow User
    async unfollowUser(targetUserId) {
        try {
            const current = await authService.getCurrentUser();
            if (!current) return { success: false, error: "Not authenticated" };

            const currentRef = doc(db, "users", current.uid);
            const targetRef = doc(db, "users", targetUserId);

            const currentSnap = await getDoc(currentRef);
            const targetSnap = await getDoc(targetRef);

            if (!currentSnap.exists() || !targetSnap.exists()) {
                return { success: false, error: "User not found" };
            }

            const currentData = currentSnap.data();
            const targetData = targetSnap.data();

            const updatedFollowing = (currentData.following || []).filter(id => id !== targetUserId);
            const updatedFollowers = (targetData.followers || []).filter(id => id !== current.uid);

            await updateDoc(currentRef, { following: updatedFollowing });
            await updateDoc(targetRef, { followers: updatedFollowers });
            await updateDoc(currentRef, { "stats.followingCount": increment(-1) });
            await updateDoc(targetRef, { "stats.followersCount": increment(-1) });

            return { success: true };

        } catch (e) {
            console.error("UserService unfollowUser error:", e);
            return { success: false, error: e.message };
        }
    },

    // Update profile
    async updateMyProfile(data) {
        try {
            const current = await authService.getCurrentUser();
            if (!current) return { success: false, error: "Not authenticated" };

            const ref = doc(db, "users", current.uid);

            await updateDoc(ref, data);

            return { success: true };

        } catch (e) {
            console.error("UserService updateMyProfile error:", e);
            return { success: false, error: e.message };
        }
    },

    // Get user by ID
    async getUserById(uid) {
        try {
            const ref = doc(db, "users", uid);
            const snap = await getDoc(ref);

            if (!snap.exists()) {
                return { success: false, error: "User not found" };
            }

            return { success: true, data: { id: snap.id, ...snap.data() } };

        } catch (e) {
            console.error("UserService getUserById error:", e);
            return { success: false, error: e.message };
        }
    },

    async getFollowersList(userId) {
        try {
            const currentUser = await this.getCurrentUserProfile();
            const userRef = doc(db, "users", userId);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                return { success: false, error: "User not found" };
            }

            const userData = userSnap.data();
            const followers = userData.followers || [];

            const followersWithDetails = await Promise.all(
                followers.map(async (followerId) => {
                    try {
                        const follower = await this.getUserById(followerId.trim()); // Clear spaces
                        if (follower.success) {
                            return {
                                id: followerId,
                                name: follower.data.profile?.name || "Usuario",
                                username: follower.data.username || "usuario",
                                avatar: follower.data.profile?.avatar || "",
                                isFollowing: (currentUser.profileData.data?.following || []).includes(followerId)
                            };
                        }
                        return null;
                    } catch (error) {
                        console.error("Error loading follower:", followerId, error);
                        return null;
                    }
                })
            );

            return {
                success: true,
                data: followersWithDetails.filter(user => user !== null)
            };

        } catch (e) {
            console.error("UserService getFollowersList error:", e);
            return { success: false, error: e.message };
        }
    },

    // Get following list with user details
    async getFollowingList(userId) {
        try {
            const currentUser = await this.getCurrentUserProfile();
            const userRef = doc(db, "users", userId);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                return { success: false, error: "User not found" };
            }

            const userData = userSnap.data();
            const following = userData.following || [];

            const followingWithDetails = await Promise.all(
                following.map(async (followingId) => {
                    try {
                        const user = await this.getUserById(followingId.trim()); // Clean spaces
                        if (user.success) {
                            return {
                                id: followingId,
                                name: user.data.profile?.name || "Usuario",
                                username: user.data.username || "usuario",
                                avatar: user.data.profile?.avatar || "",
                                isFollowing: (currentUser.profileData.data?.following || []).includes(followingId)
                            };
                        }
                        return null;
                    } catch (error) {
                        console.error("Error loading following user:", followingId, error);
                        return null;
                    }
                })
            );

            return {
                success: true,
                data: followingWithDetails.filter(user => user !== null)
            };

        } catch (e) {
            console.error("UserService getFollowingList error:", e);
            return { success: false, error: e.message };
        }
    },

    // Auxiliary method for cleaning IDs
    async cleanUserFollowData(userId) {
        try {
            const userRef = doc(db, "users", userId);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                return { success: false, error: "User not found" };
            }

            const userData = userSnap.data();

            // Clean up gaps in followers and following
            const cleanFollowers = (userData.followers || []).map(id => id.trim()).filter(id => id !== "");
            const cleanFollowing = (userData.following || []).map(id => id.trim()).filter(id => id !== "");

            await updateDoc(userRef, {
                followers: cleanFollowers,
                following: cleanFollowing,
                'stats.followersCount': cleanFollowers.length,
                'stats.followingCount': cleanFollowing.length
            });

            return { success: true };

        } catch (e) {
            console.error("UserService cleanUserFollowData error:", e);
            return { success: false, error: e.message };
        }
    }

}; // End userService

export { userService };