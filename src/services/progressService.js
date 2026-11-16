import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  query,
  where,
  serverTimestamp
} from "firebase/firestore";
import { db } from "./firebase";

// Every progress log lives in one Firestore collection called "progressLogs".
// Each log is one work session: { patternId, date, rowsDone, stitches, note }
const logsRef = collection(db, "progressLogs");

// Newest date first
function sortLogs(logs) {
  return logs.sort((a, b) => b.date.localeCompare(a.date));
}

export async function addProgressLog(data) {
  const docRef = await addDoc(logsRef, {
    ...data,
    createdAt: serverTimestamp()
  });
  return docRef.id;
}

// All logs for one pattern
export async function listProgressLogs(patternId) {
  const snapshot = await getDocs(query(logsRef, where("patternId", "==", patternId)));
  return sortLogs(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
}

// Every log for every pattern (used by the Progress Tracker)
export async function listAllProgressLogs() {
  const snapshot = await getDocs(logsRef);
  return sortLogs(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
}

export async function deleteProgressLog(id) {
  await deleteDoc(doc(db, "progressLogs", id));
}

// Adds up a list of logs: total rows, total stitches, and the most recent log
export function summarizeLogs(logs) {
  let rowsDone = 0;
  let stitches = 0;
  let latest = null;
  logs.forEach((log) => {
    rowsDone += Number(log.rowsDone) || 0;
    stitches += Number(log.stitches) || 0;
    if (!latest || log.date > latest.date) latest = log;
  });
  return { rowsDone, stitches, latest };
}