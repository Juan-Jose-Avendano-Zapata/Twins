<h1 align="center">📱 Twins — Twitter Clone in React Native CLI</h1>

<p align="center">
  <img src="https://img.shields.io/badge/React%20Native-v0.82.0-blue?style=flat-square&logo=react" />
  <img src="https://img.shields.io/badge/Firebase-Auth%20%7C%20Firestore-FF6A00?style=flat-square&logo=firebase" />
  <img src="https://img.shields.io/badge/Cloudinary-Media%20Handling-3448C5?style=flat-square&logo=cloudinary" />
  <img src="https://img.shields.io/badge/STATUS-FINISHED-2EA44F?style=flat-square" />
</p>

---

## 📄 Description

**Twins** is a mobile application developed using **React Native CLI**, inspired by Twitter (X), and designed to offer a simple, fast, and modern microblogging experience. Users can create posts (*twins*), upload images or videos, explore content, and securely authenticate.

The application utilizes:

* **Firebase Authentication**: Complete handling of registration and login.
* **Firebase Firestore**: NoSQL database for storing users, posts, and metadata.
* **Cloudinary**: Storage and optimization of multimedia files (images and videos).
* **React Native Paper**: A set of UI components for a professional and consistent interface.

---

## ✨ Core Features

### 1. **Firebase Authentication**
* Registration and login using email and password.
* Persistent session management using Async Storage.

### 2. **Posting (Twins)**
* Create, read, and delete posts.
* Attach images or videos using **Cloudinary**.
* Optimized view of multimedia content using `react-native-video` and `react-native-image-picker`.

### 3. **Modern and Accessible Interface**
* Stylized components built with **React Native Paper**.
* Iconography based on `react-native-vector-icons`.

### 4. **Fluid Navigation**
* Integrated with **React Navigation** using stacks.

### 5. **Mobile Permissions**
* Management of camera, gallery, and multimedia permissions using `react-native-permissions`.

---
## 🛠️ Technologies Used

### **Frontend**
* **React Native CLI** (v0.82.0)
* **React** (v19.1.1)
* **React Native Paper**
* **React Navigation**

### **Backend / Services**
* **Firebase Authentication**
* **Firebase Firestore**
* **Cloudinary** (media upload and manipulation)

### **Multimedia**
* `react-native-image-picker`
* `react-native-video`
* `react-native-video-controls`

## 📦 Project Dependencies

### **Core Frameworks**

* **React Native** (`0.82.0`): Main framework for native mobile development using JavaScript.
* **React** (`19.1.1`): Library for building user interfaces.

### **Backend Services**

* **Firebase** (`12.5.0`):
    * **Firebase Authentication**: Handles registration and login.
    * **Firebase Firestore**: Real-time NoSQL database.

### **Navigation**

* `@react-navigation/native` (`^7.1.18`): Handles routing and navigation.
* `@react-navigation/native-stack` (`^7.3.28`): Configuration for Stack Navigator.

### **UI and Components**

* **react-native-paper** (`^5.14.5`): Modern and accessible UI components.
* **react-native-vector-icons** (`^10.3.0`): Customizable icon set.
* `@react-native-vector-icons/material-design-icons` (`^12.3.0`): Material Design style icons.
  
### **Multimedia**

* **react-native-image-picker** (`^8.2.1`): Selects images and videos from the gallery or camera.
* **react-native-video** (`^6.17.0`): Video playback.
* **react-native-video-controls** (`^2.8.1`): UI controls for videos.

### **Permissions and Storage**

* **react-native-permissions** (`^5.4.4`): Handles system permissions.
* `@react-native-async-storage/async-storage` (`^1.24.0`): Persistent local storage.

### **Optimization and System**

* **react-native-screens** (`^4.17.1`): Optimization for navigation and performance.
* **react-native-safe-area-context** (`^5.6.1`): Handles safe area zones for iOS and Android.
* `@react-native/new-app-screen` (`0.82.0`): Initial screen for the React Native CLI template.

  
## 🚀 Installation and Execution
### **Setup Steps**

1.  **Clone the Repository**
    * `git clone https://github.com/Juan-Jose-Avendano-Zapata/twins.git`
    * `cd Twins`

2.  **Install Dependencies**
    * (Typically run `npm install` or `yarn install` here, depending on the package manager used in the project.)

3.  **Configure Firebase**
    * Update your Firebase configuration object with your project credentials:
        ```javascript
        export const firebaseConfig = {
          apiKey: "...",
          authDomain: "...",
          projectId: "...",
          storageBucket: "...",
          messagingSenderId: "...",
          appId: "..."
        };
        ```

4.  **Configure Cloudinary**
    * Set your Cloudinary environment variables (usually in a `.env` file):
        * `CLOUDINARY_CLOUD_NAME=your_cloud_name`
        * `CLOUDINARY_UPLOAD_PRESET=your_upload_preset`

5.  **Run the App**
    * For **Android**: `npx react-native run-android`
    * For **iOS**: `npx react-native run-ios`

## 🔒 Security

* **Authentication** is managed using **Firebase Auth**.
* **Session Tokens** are securely handled with **Async Storage**.
* **File Uploads** use **Cloudinary signatures** for security.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.

--- 
## 👨‍💻 © Copyright - Authors
* [Samuel Stevan Arias Tuquerres](https://github.com/sam-arias)
* [Juan Jose Avendaño Zapata](https://github.com/Juan-Jose-Avendano-Zapata)
