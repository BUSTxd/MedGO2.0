import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut, setPersistence, browserLocalPersistence, getIdTokenResult } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

// === Firebase (solo Core + Auth acá) ===
const firebaseConfig = {
  apiKey: "AIzaSyANLa7TRx91oot43wlbtbsVVc0ch7OY0Sg",
  authDomain: "medgoxd.firebaseapp.com",
  projectId: "medgoxd",
  storageBucket: "medgoxd.firebasestorage.app",
  messagingSenderId: "708738884850",
  appId: "1:708738884850:web:3664cf28c7761804341c6b",
};

const app  = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence).catch(()=>{});

// ===== Helpers DOM =====
const $  = (s, r=document)=>r.querySelector(s);
const $$ = (s, r=document)=>Array.from(r.querySelectorAll(s));

const elCrear   = $(".flex_board");
const elLogin   = $(".flex_board2");
const ctaBtn    = $(".cta-card .btn-primary");
const planBtns  = $$(".pricing .btn"); // ambos "Elegir plan"

// ===== UI helpers =====
function toCheckout(){ location.href = "/checkout"; }
function toDashboard(){ location.href = "/dashboard"; }
function toRegister(next="/"){ location.href = `/register?next=${encodeURIComponent(next)}`; }

function setPlansForActive(active){
  // CTA principal
  if (ctaBtn){
    if (active){ ctaBtn.textContent = "Entrar al producto"; ctaBtn.onclick = toDashboard; }
    else       { ctaBtn.textContent = "Comprar";           ctaBtn.onclick = toCheckout; }
  }
  // Botones "Elegir plan"
  planBtns.forEach(b=>{
    if (active){
      b.textContent = "Entrar al producto";
      b.classList.add("btn-primary");
      b.onclick = toDashboard;
    } else {
      b.textContent = "Elegir plan";
      // el primero ya es primary; si quieres, no lo toques
      b.onclick = toCheckout;
    }
  });
}

// ===== Cache local por usuario =====
const ENT_KEY = "ent:v2";
function entRead(uid){
  try{
    const j = JSON.parse(localStorage.getItem(ENT_KEY) || "null");
    if (!j || j.uid !== uid) return null;
    if (Date.now() > j.exp) return null;
    return !!j.active;
  }catch{ return null; }
}
function entWrite(uid, active, ttlMs = 6*60*60*1000){
  try{
    localStorage.setItem(ENT_KEY, JSON.stringify({ uid, active: !!active, exp: Date.now()+ttlMs }));
  }catch{}
}

// ===== Firestore lazy (solo si hace falta) =====
let dbModPromise = null;
async function ensureDb(){
  if (!dbModPromise){
    dbModPromise = import("https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js").then(({ initializeFirestore, persistentLocalCache, persistentMultipleTabManager, doc, getDoc })=>{
      const db = initializeFirestore(app, {
        // Más rápido si WS funciona; si no, cae solo a long-polling:
        experimentalAutoDetectLongPolling: true,
        useFetchStreams: false,
        localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
      });
      return { db, doc, getDoc };
    });
  }
  return dbModPromise;
}

// getDoc: cache-first + carrera con timeout en red
async function getDocFast(path, timeoutMs=2500){
  const { db, doc, getDoc } = await ensureDb();
  const ref = doc(db, ...path);

  // 1) cache primero
  try{
    const snapCache = await getDoc(ref, { source: "cache" });
    if (snapCache.exists()) return snapCache;
  }catch{}

  // 2) red con timeout
  const ctl = new AbortController();
  const killer = setTimeout(()=>ctl.abort(), timeoutMs);
  try{
    const snapNet = await getDoc(ref, { signal: ctl.signal });
    clearTimeout(killer);
    return snapNet;
  }catch(e){
    clearTimeout(killer);
    throw e;
  }
}

// Lógica de verificación de acceso
async function hasActiveAccess(uid){
  // A) 1º intento: Custom Claims (instantáneo si las usas)
  try{
    const tok = await getIdTokenResult(auth.currentUser, /*forceRefresh=*/false);
    const cs  = tok?.claims || {};
    // soporta subStatus o "ent" booleano
    if (typeof cs.ent === "boolean") return cs.ent;
    if (typeof cs.subStatus === "string") return ["active","trialing"].includes(cs.subStatus);
  }catch{}

  // B) 2º intento: cache local
  const cached = entRead(uid);
  if (typeof cached === "boolean") return cached;

  // C) 3º intento: Firestore con timeout corto (no bloquea UI)
  try{
    const snap = await getDocFast(["users", uid], 2500);
    if (!snap.exists()) return false;
    const d = snap.data();
    return ["active","trialing"].includes(d?.subStatus);
  }catch{
    return false;
  }
}

// ===== Menú de usuario =====
function ensureUserMenu(name) {
  let menu = document.querySelector("#navUserInjected");
  if (!menu) {
    const header = document.querySelector("header.flex_header");
    if (!header) return;
    menu = document.createElement("div");
    menu.id = "navUserInjected";
    menu.style.position = "relative";
    menu.style.marginLeft = "auto";
    menu.style.paddingRight = "20px";
    menu.innerHTML = `
      <button id="navUserBtn" class="btn" style="padding:10px 14px;border-radius:18px;background:#fff;color:#23272a;margin-left:10px;">
        <span id="navUserName"></span> ▾
      </button>
      <div id="navUserDropdown" hidden style="position:absolute;right:10px;top:48px;background:#fff;color:#23272a;border-radius:12px;padding:8px 12px;box-shadow:0 10px 30px rgba(0,0,0,.15);min-width:180px;">
        <a href="/dashboard" style="display:block;padding:8px 0;text-decoration:none;color:#23272a; font-family: abcginto">Mi producto</a>
        <button id="navLogout" style="display:block;width:100%;text-align:left;background:none;border:none;padding:8px 0;color:#23272a;cursor:pointer; font-family: abcgintoheader">Cerrar sesión</button>
      </div>
    `;
    header.appendChild(menu);
    const btn = document.querySelector("#navUserBtn");
    const dd  = document.querySelector("#navUserDropdown");
    btn?.addEventListener("click", () => dd.hidden = !dd.hidden);
    document.addEventListener("click", (e) => { if (dd && !dd.hidden && !menu.contains(e.target)) dd.hidden = true; });
    document.querySelector("#navLogout")?.addEventListener("click", async () => { await signOut(auth); location.href = "/"; });
  }
  const nameEl = document.querySelector("#navUserName");
  if (nameEl) nameEl.textContent = name || "Usuario";
}

// ===== Estado de Auth =====
onAuthStateChanged(auth, async (user) => {
  document.documentElement.dataset.auth = user ? "in" : "out";

  if (!user) {
    elCrear?.removeAttribute("hidden");
    elLogin?.removeAttribute("hidden");
    $("#navUserInjected")?.remove();
    // Botones en modo "no logueado"
    if (ctaBtn){ ctaBtn.textContent = "Acceder"; ctaBtn.onclick = () => toRegister("/"); }
    planBtns.forEach(b => b.onclick = () => toRegister("/checkout"));
    return;
  }

  // Logueado
  elCrear?.setAttribute("hidden","true");
  elLogin?.setAttribute("hidden","true");
  const visibleName = (user.displayName?.trim()) || (user.email ? user.email.split("@")[0] : "Usuario");
  ensureUserMenu(visibleName);

  if (!user.emailVerified) {
    if (ctaBtn){ ctaBtn.textContent = "Verifica tu correo"; ctaBtn.onclick = () => alert("Revisa tu bandeja y confirma tu correo."); }
    planBtns.forEach(b => b.onclick = () => alert("Verifica tu correo antes de comprar."));
    return;
  }

  // 1) UI inmediata (optimista) con claims/cache/local (no espera red)
  const cached = entRead(user.uid);
  setPlansForActive(cached ?? false);

  // 2) Verificación real liviana en background (timeout corto)
  (window.requestIdleCallback || setTimeout)(async () => {
    const activo = await hasActiveAccess(user.uid);   // usa claims > cache > FS (2.5s)
    entWrite(user.uid, activo);
    setPlansForActive(activo);
    // (opcional) precalentar un doc liviano:
    // try{ await getDocFast(["meta","app"], 2000); }catch{}
  }, 1);
});