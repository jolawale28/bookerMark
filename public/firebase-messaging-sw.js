// public/firebase-messaging-sw.js

importScripts(
  'https://www.gstatic.com/firebasejs/10.9.0/firebase-app-compat.js'
)
importScripts(
  'https://www.gstatic.com/firebasejs/10.9.0/firebase-messaging-compat.js'
)

const firebaseConfig = {
  apiKey: 'YOUR_PUBLIC_API_KEY',
  authDomain: 'YOUR_PROJECT.firebaseapp.com',
  projectId: 'YOUR_PROJECT_ID',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID'
}

firebase.initializeApp(firebaseConfig)

const messaging = firebase.messaging()

messaging.onBackgroundMessage(payload => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  )

  const notificationTitle = payload.notification.title
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/favicon.png' // optional: path to your app icon
  }

  self.registration.showNotification(notificationTitle, notificationOptions)
})
