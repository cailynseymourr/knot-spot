import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp
} from "firebase/firestore";
import { db } from "./firebase";

// All yarn lives in one Firestore collection called "yarns".
const yarnsRef = collection(db, "yarns");

// Save a new yarn. Returns the new document's id.
export async function saveYarn(data) {
  const docRef = await addDoc(yarnsRef, {
    ...data,
    createdAt: serverTimestamp()
  });
  return docRef.id;
}

// Get every yarn, newest first.
export async function listYarns() {
  const snapshot = await getDocs(query(yarnsRef, orderBy("createdAt", "desc")));
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// Delete one yarn by id.
export async function deleteYarn(id) {
  await deleteDoc(doc(db, "yarns", id));
}

// Shrinks an image in the browser and returns it as a small data URL.
// The result is saved directly in the yarn's Firestore record, so no
// Firebase Storage is needed.
export function imageToDataUrl(file, maxSize = 600, quality = 0.7) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read the image"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Could not load the image"));
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}