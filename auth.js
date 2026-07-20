import { auth, googleProvider, signInWithPopup, db, doc, getDoc } from "./firebase-init.js";

const googleLoginBtn = document.getElementById("googleLoginBtn");

if (googleLoginBtn) {
  googleLoginBtn.addEventListener("click", async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userDocRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userDocRef);

      if (userSnap.exists()) {
        window.location.href = "home.html";
      } else {
        window.location.href = "setup.html";
      }
    } catch (error) {
      console.error("Auth Error:", error.message);
      alert("Authentication failed. Please try again.");
    }
  });
}
