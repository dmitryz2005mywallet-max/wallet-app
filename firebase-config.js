/* Публичная конфигурация веб-приложения Firebase (Project settings → General → Your apps → Web app → firebaseConfig).
   Эти значения не секретные: доступ к данным защищают правила Firestore (firestore.rules) и вход через Google.
   Пока здесь стоят заглушки PASTE_…, облачная синхронизация и экран входа выключены, приложение работает локально. */
window.FIREBASE_CONFIG = {
  apiKey: "PASTE_API_KEY",
  authDomain: "PASTE_PROJECT_ID.firebaseapp.com",
  projectId: "PASTE_PROJECT_ID",
  appId: "PASTE_APP_ID"
};
