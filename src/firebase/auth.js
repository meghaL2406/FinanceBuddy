// auth.js
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "./firebaseConfig";

export const auth = getAuth(app);

// Optional: a helper function to monitor auth state
export const monitorAuthState = (callback) => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (!user) {
      console.log("User not logged in");
      return;
    }
    // User is logged in
    console.log("User logged in:", user);
    if (callback) callback(user);
  });

  return unsubscribe; // you can call this to stop listening later
};
