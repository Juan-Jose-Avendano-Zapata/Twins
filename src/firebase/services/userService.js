import { 
  doc, 
  getDoc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove, 
  collection,
  query,
  where,
  getDocs,
  onSnapshot
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export const userService = {
  // Obtener perfil de cualquier usuario por UID
  async getUserProfile(uid) {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        return { 
          success: true, 
          data: { 
            id: userDoc.id,
            ...userDoc.data()
          } 
        };
      } else {
        return { success: false, error: 'Usuario no encontrado' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Obtener perfil por username
  async getUserByUsername(username) {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('username', '==', username.toLowerCase()));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return { success: false, error: 'Usuario no encontrado' };
      }

      const userDoc = querySnapshot.docs[0];
      return { 
        success: true, 
        data: { 
          id: userDoc.id,
          ...userDoc.data()
        } 
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Seguir a un usuario
  async followUser(targetUserId) {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        return { success: false, error: 'Usuario no autenticado' };
      }

      const currentUserId = currentUser.uid;

      // Actualizar el usuario que sigue (current user)
      await updateDoc(doc(db, 'users', currentUserId), {
        following: arrayUnion(targetUserId),
        'stats.followingCount': await this.getFollowingCount(currentUserId) + 1
      });

      // Actualizar el usuario seguido (target user)
      await updateDoc(doc(db, 'users', targetUserId), {
        followers: arrayUnion(currentUserId),
        'stats.followersCount': await this.getFollowersCount(targetUserId) + 1
      });

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Dejar de seguir a un usuario
  async unfollowUser(targetUserId) {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        return { success: false, error: 'Usuario no autenticado' };
      }

      const currentUserId = currentUser.uid;

      // Actualizar el usuario que deja de seguir (current user)
      await updateDoc(doc(db, 'users', currentUserId), {
        following: arrayRemove(targetUserId),
        'stats.followingCount': await this.getFollowingCount(currentUserId) - 1
      });

      // Actualizar el usuario dejado de seguir (target user)
      await updateDoc(doc(db, 'users', targetUserId), {
        followers: arrayRemove(currentUserId),
        'stats.followersCount': await this.getFollowersCount(targetUserId) - 1
      });

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Verificar si el usuario actual sigue a otro usuario
  async isFollowing(targetUserId) {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return false;

      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return userData.following?.includes(targetUserId) || false;
      }
      return false;
    } catch (error) {
      console.error('Error checking follow status:', error);
      return false;
    }
  },

  // Obtener contador de seguidores
  async getFollowersCount(userId) {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        return userDoc.data().stats?.followersCount || 0;
      }
      return 0;
    } catch (error) {
      console.error('Error getting followers count:', error);
      return 0;
    }
  },

  // Obtener contador de seguidos
  async getFollowingCount(userId) {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        return userDoc.data().stats?.followingCount || 0;
      }
      return 0;
    } catch (error) {
      console.error('Error getting following count:', error);
      return 0;
    }
  },

  // Escuchar cambios en tiempo real del perfil
  subscribeToUserProfile(uid, callback) {
    return onSnapshot(doc(db, 'users', uid), (doc) => {
      if (doc.exists()) {
        callback({ 
          success: true, 
          data: { 
            id: doc.id,
            ...doc.data()
          } 
        });
      } else {
        callback({ success: false, error: 'Usuario no encontrado' });
      }
    });
  }
};