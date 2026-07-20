import { auth, googleProvider, signInWithPopup, onAuthStateChanged, db, doc, getDoc } from "./firebase-init.js";

const googleLoginBtn = document.getElementById("googleLoginBtn");

if (googleLoginBtn) {
  googleLoginBtn.addEventListener("click", async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if user profile already exists in Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userDocRef);

      if (userSnap.exists()) {
        window.location.href = "home.html";
      } else {
        window.location.href = "setup.html";
      }
    } catch (error) {
      console.error("Authentication Error:", error.message);
      alert("Login failed. Please try again.");
    }
  });
}

