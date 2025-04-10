// notifications.js
import { messaging } from "./firebase";
import { getToken } from "firebase/messaging";

export const requestNotificationPermission = async () => {
  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    if (!messaging) {
      console.warn("Messaging is not initialized.");
      return null;
    }

    const token = await getToken(messaging, {
      vapidKey: "YOUR_PUBLIC_VAPID_KEY",
    });

    console.log("FCM token:", token);

    // Save this token to your backend DB
    // Associate it with the user's account (for later targeting)
    return token;
  } else {
    console.warn("Notification permission not granted.");
    return null;
  }
};
