import { 
    collection, 
    addDoc, 
    getDocs, 
    getDoc, 
    updateDoc, 
    deleteDoc, 
    doc, 
    query, 
    orderBy, 
    onSnapshot,
    where,
    serverTimestamp,
    increment
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { getAuth } from 'firebase/auth';

const auth = getAuth();

export const postService = {
    // Create a new post
    async createPost(content, image = "") {
        try {
            const user = auth.currentUser;
            if (!user) {
                throw new Error('Unauthenticated user');
            }

            const postData = {
                authorId: user.uid,
                authorRef: doc(db, 'users', user.uid),
                content: content,
                createdAt: serverTimestamp(),
                image: image,
                state: {
                    comments: 0,
                    likes: 0
                },
                updatedAt: serverTimestamp()
            };

            const docRef = await addDoc(collection(db, 'posts'), postData);
            return { success: true, id: docRef.id };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Get all posts
    async getPosts(limit = null) {
        try {
            const postsRef = collection(db, 'posts');
            let q = query(postsRef, orderBy('createdAt', 'desc'));
            
            const querySnapshot = await getDocs(q);
            const posts = [];
            
            for (const docSnap of querySnapshot.docs) {
                const postData = docSnap.data();
                // Get author information
                const authorData = await this.getPostAuthor(postData.authorId);
                posts.push({
                    id: docSnap.id,
                    ...postData,
                    ...authorData
                });
            }
            
            return { success: true, data: posts };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Get posts in real-time
    getPostsRealtime(callback) {
        const postsRef = collection(db, 'posts');
        const q = query(postsRef, orderBy('createdAt', 'desc'));
        
        return onSnapshot(q, async (querySnapshot) => {
            const posts = [];
            
            for (const docSnap of querySnapshot.docs) {
                const postData = docSnap.data();
                // Get author information
                const authorData = await this.getPostAuthor(postData.authorId);
                posts.push({
                    id: docSnap.id,
                    ...postData,
                    ...authorData,
                    time: this.formatTime(postData.createdAt?.toDate())
                });
            }
            
            callback(posts);
        });
    },

    // Get post author information
    async getPostAuthor(authorId) {
        try {
            const userDoc = await getDoc(doc(db, 'users', authorId));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                return {
                    authorName: userData.name,
                    authorUsername: userData.username,
                    authorAvatar: userData.avatar || require('../../assets/img/logoTWBlack.jpg'),
                };
            }
            return {
                authorName: 'User',
                authorUsername: 'username',
                authorAvatar: "",
            };
        } catch (error) {
            console.error("Error getting author:", error);
            return {
                authorName: 'User',
                authorUsername: 'username',
                authorAvatar: "",
            };
        }
    },

    // Like a post
    async likePost(postId) {
        try {
            const postRef = doc(db, 'posts', postId);
            await updateDoc(postRef, {
                'state.likes': increment(1),
                updatedAt: serverTimestamp()
            });
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Unlike a post
    async unlikePost(postId) {
        try {
            const postRef = doc(db, 'posts', postId);
            await updateDoc(postRef, {
                'state.likes': increment(-1),
                updatedAt: serverTimestamp()
            });
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Add comment to a post
    async addComment(postId, content) {
        try {
            const user = auth.currentUser;
            if (!user) {
                throw new Error('Unauthenticated user');
            }

            const commentData = {
                authorId: user.uid,
                content: content,
                createdAt: serverTimestamp(),
                postId: postId
            };

            // Add comment document
            await addDoc(collection(db, 'comments'), commentData);

            // Increment comment count in post
            const postRef = doc(db, 'posts', postId);
            await updateDoc(postRef, {
                'state.comments': increment(1),
                updatedAt: serverTimestamp()
            });

            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Get comments for a post
    async getComments(postId) {
        try {
            const commentsRef = collection(db, 'comments');
            const q = query(commentsRef, where('postId', '==', postId), orderBy('createdAt', 'desc'));
            
            const querySnapshot = await getDocs(q);
            const comments = [];
            
            for (const docSnap of querySnapshot.docs) {
                const commentData = docSnap.data();
                const authorData = await this.getPostAuthor(commentData.authorId);
                comments.push({
                    id: docSnap.id,
                    ...commentData,
                    ...authorData,
                    time: this.formatTime(commentData.createdAt?.toDate())
                });
            }
            
            return { success: true, data: comments };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Delete post
    async deletePost(postId) {
        try {
            await deleteDoc(doc(db, 'posts', postId));
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Format time
    formatTime(date) {
        if (!date) return '';
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 60) {
            return `${minutes}m`;
        } else if (hours < 24) {
            return `${hours}h`;
        } else {
            return `${days}d`;
        }
    }
};