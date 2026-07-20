import { auth, db, doc, setDoc, onAuthStateChanged } from "./firebase-init.js";

const CLOUD_NAME = "nhy9Ifkt";
const UPLOAD_PRESET = "rhk_upload";

const avatarInput = document.getElementById("avatarInput");
const avatarPreview = document.getElementById("avatarPreview");
const setupForm = document.getElementById("setupForm");
const submitBtn = document.getElementById("submitBtn");

let currentUser = null;
let uploadedImageUrl = "https://icon-library.com/images/default-profile-icon/default-profile-icon-24.jpg";

onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    if(user.photoURL) {
      uploadedImageUrl = user.photoURL;
      avatarPreview.style.backgroundImage = `url('${uploadedImageUrl}')`;
    }
  } else {
    window.location.href = "index.html";
  }
});

// Handle image preview & Cloudinary Upload
avatarInput.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // Local preview instantly
  avatarPreview.style.backgroundImage = `url('${URL.createObjectURL(file)}')`;
  
  submitBtn.disabled = true;
  submitBtn.innerText = "Uploading photo...";

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: formData
    });
    const data = await response.json();
    if (data.secure_url) {
      uploadedImageUrl = data.secure_url;
      submitBtn.disabled = false;
      submitBtn.innerText = "Complete Sign Up";
    } else {
      throw new Error("Upload failed");
    }
  } catch (error) {
    console.error("Cloudinary error:", error);
    alert("Image upload failed. Try again.");
    submitBtn.disabled = false;
    submitBtn.innerText = "Complete Sign Up";
  }
});

// Save to Firestore
setupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!currentUser) return;

  const username = document.getElementById("usernameInput").value.trim();
  const fullName = document.getElementById("fullNameInput").value.trim();
  const bio = document.getElementById("bioInput").value.trim();

  try {
    await setDoc(doc(db, "users", currentUser.uid), {
      uid: currentUser.uid,
      username: username,
      fullName: fullName,
      bio: bio,
      photoURL: uploadedImageUrl,
      createdAt: new Date().toISOString()
    });

    window.location.href = "home.html";
  } catch (error) {
    console.error("Error saving user profile:", error);
    alert("Error creating profile data.");
  }
});

