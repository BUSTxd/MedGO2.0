// src/script/register.js  (o /public/register.js si lo moviste)
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  sendEmailVerification,
  signOut,
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
// import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-analytics.js"; // opcional

const firebaseConfig = {
  apiKey: "AIzaSyANLa7TRx91oot43wlbtbsVVc0ch7OY0Sg",
  authDomain: "medgoxd.firebaseapp.com",
  projectId: "medgoxd",
  storageBucket: "medgoxd.firebasestorage.app",
  messagingSenderId: "708738884850",
  appId: "1:708738884850:web:3664cf28c7761804341c6b",
  measurementId: "G-GSPNG60FNQ",
};

const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app); // opcional
const auth = getAuth(app);
auth.languageCode = "es"; // correos de verificación en español
setPersistence(auth, browserLocalPersistence);

// Helper
const q = (sel, root = document) => root.querySelector(sel);

/* ========== LOGIN ========== */
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = q('input[type="email"]', loginForm).value.trim();
    const password = document.getElementById("loginPassword").value;

    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);

      // Si no está verificado, bloquea el acceso
      if (!user.emailVerified) {
        await signOut(auth);
        alert("Aún no verificas tu correo. Revisa tu bandeja (SPAM) y haz clic en el enlace de verificación.");
        return;
      }

      // Éxito → a la página principal
      window.location.replace("/");
    } catch (err) {
      console.error(err);
      alert("Error de inicio de sesión: " + (err.code || err.message));
    }
  });
}

/* ========== REGISTER ========== */
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = q('input[type="email"]', registerForm).value.trim();
    const password = document.getElementById("registerPassword").value;

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);

      // Enviar verificación con URL de retorno (ajusta si quieres)
      await sendEmailVerification(cred.user, {
        url: `${location.origin}/register`,
      });

      // (Opcional pero recomendado) cerrar sesión hasta que verifique
      await signOut(auth);

      // UX: limpiar, prellenar email del login y voltear a login
      registerForm.reset();
      const loginEmail = document.querySelector('#loginForm input[type="email"]');
      if (loginEmail) loginEmail.value = email;

      const flipCard = document.getElementById("flipCard");
      if (flipCard?.style) flipCard.style.transform = "rotateY(0deg)";

      // Enfocar contraseña de login
      setTimeout(() => document.getElementById("loginPassword")?.focus(), 250);

      alert("✅ Te enviamos un correo de verificación (revisar SPAM). Confirma tu cuenta antes de iniciar sesión.");

    } catch (err) {
      console.error(err);
      alert("Error al registrarse: " + (err.code || err.message));
    }
  });
}
