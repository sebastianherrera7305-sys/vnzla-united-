import { db, collection, addDoc, onSnapshot, query, orderBy, limit } from "./firebase-config.js";

const form = document.getElementById("necesidad-form");
const statusMsg = document.getElementById("status-msg");
const lista = document.getElementById("reportes-lista");
const submitBtn = form.querySelector("button[type='submit']");

function sanitize(str) {
  const d = document.createElement("div");
  d.textContent = String(str ?? "");
  return d.innerHTML;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const necesidades = Array.from(document.querySelectorAll('input[name="necesidad"]:checked')).map(cb => cb.value);
  if (necesidades.length === 0) { statusMsg.textContent = "⚠️ Selecciona al menos una necesidad."; return; }
  submitBtn.disabled = true;
  submitBtn.textContent = "Enviando…";
  statusMsg.textContent = "";
  try {
    await addDoc(collection(db, "necesidades"), {
      nombre: document.getElementById("nombre").value.trim(),
      contacto: document.getElementById("contacto").value.trim(),
      ubicacion: document.getElementById("ubicacion").value.trim(),
      personas: parseInt(document.getElementById("personas").value, 10) || 1,
      necesidades,
      urgencia: document.getElementById("urgencia").value,
      timestamp: new Date(),
    });
    statusMsg.textContent = "✅ Reporte enviado. Gracias.";
    form.reset();
  } catch (err) {
    statusMsg.textContent = "❌ No se pudo enviar. Intenta de nuevo.";
    console.error(err);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Enviar Reporte";
  }
});

const q = query(collection(db, "necesidades"), orderBy("timestamp", "desc"), limit(20));
onSnapshot(q, (snapshot) => {
  lista.innerHTML = "";
  snapshot.forEach((doc) => {
    const d = doc.data();
    const ts = d.timestamp?.toDate?.();
    const hora = ts ? ts.toLocaleString("es-VE", { dateStyle: "short", timeStyle: "short" }) : "";
    const card = document.createElement("div");
    card.className = "reporte-card " + sanitize(d.urgencia);
    const titulo = document.createElement("strong");
    titulo.textContent = d.ubicacion;
    const detalle = document.createElement("p");
    detalle.textContent = `Personas: ${d.personas} | Urgencia: ${d.urgencia}`;
    const nec = document.createElement("p");
    nec.textContent = "Necesita: " + (d.necesidades ?? []).join(", ");
    const time = document.createElement("small");
    time.textContent = hora;
    card.appendChild(titulo); card.appendChild(detalle); card.appendChild(nec); card.appendChild(time);
    lista.appendChild(card);
  });
});
