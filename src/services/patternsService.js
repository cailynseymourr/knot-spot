import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "./firebase";

// All patterns live in one Firestore collection called "patterns".
const patternsRef = collection(db, "patterns");

// Save a new pattern. Returns the new document's id.
export async function savePattern(data) {
  const docRef = await addDoc(patternsRef, {
    ...data,
    createdAt: serverTimestamp()
  });
  return docRef.id;
}

// Get every pattern, newest first. Each item includes its Firestore id.
export async function listPatterns() {
  const snapshot = await getDocs(query(patternsRef, orderBy("createdAt", "desc")));
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// Get one pattern by id (or null if it doesn't exist).
export async function getPattern(id) {
  const snapshot = await getDoc(doc(db, "patterns", id));
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
}

// Update some fields of a pattern. Fields you don't pass are left alone.
export async function updatePattern(id, data) {
  await updateDoc(doc(db, "patterns", id), data);
}

// Delete one pattern by id.
export async function deletePattern(id) {
  await deleteDoc(doc(db, "patterns", id));
}

// Upload a pattern file (PDF/image) to Firebase Storage. Returns its download URL.
export async function uploadPatternFile(file) {
  const fileRef = ref(storage, `pattern-files/${Date.now()}-${file.name}`);
  await uploadBytes(fileRef, file);
  return getDownloadURL(fileRef);
}