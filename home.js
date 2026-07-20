import { auth, signOut, onAuthStateChanged, db, doc, getDoc } from "./firebase-init.js";

const feedContainer = document.getElementById("feedContainer");
const logoutBtn = document.getElementById("logoutBtn");

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const userDocRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userDocRef);

    if (!userSnap.exists()) {
      window.location.href = "setup.html";
    } else {
      renderFeed(userSnap.data());
    }
  } else {
    window.location.href = "index.html";
  }
});

function renderFeed(userData) {
  feedContainer.innerHTML = `
    <div class="post-card">
      <div class="post-header">
        <div class="post-avatar" style="background-image: url('${userData.photoURL}');"></div>
        <span class="post-username">${userData.username}</span>
      </div>
      <img class="post-image" src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe" alt="Post">
      <div class="post-footer">
        <p><strong>${userData.username}</strong> Welcome to your custom RHK application feed! 🚀</p>
      </div>
    </div>
  `;
}

logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html";
});
