import { getCategorias, getProductos, getPedidos } from "../../../utils/api";
import type { Producto } from "../../../types/api";

const totalCategorias = document.getElementById("totalCategorias") as HTMLParagraphElement;
const totalProductos = document.getElementById("totalProductos") as HTMLParagraphElement;
const totalPedidos = document.getElementById("totalPedidos") as HTMLParagraphElement;
const productosDisponibles = document.getElementById("productosDisponibles") as HTMLParagraphElement;
const logoutBtn = document.getElementById("logoutBtn") as HTMLButtonElement;

// Verifica usuario admin
const usuarioGuardado = localStorage.getItem("usuario");

if (!usuarioGuardado) {
  window.location.href = "../../auth/login/login.html";
}

const usuario = JSON.parse(usuarioGuardado || "{}");

// Si no es admin, lo sacamos
if (usuario.rol !== "ADMIN") {
  window.location.href = "../../store/home/home.html";
}

// Carga datos del dashboard
async function loadDashboard(): Promise<void> {
  try {
    const categorias = await getCategorias();
    const productos = await getProductos();
    const pedidos = await getPedidos();

    totalCategorias.textContent = String(categorias.length);
    totalProductos.textContent = String(productos.length);
    totalPedidos.textContent = String(pedidos.length);

    // Cuenta productos disponibles
    const disponibles = productos.filter((p: Producto) => p.disponible).length;
    productosDisponibles.textContent = String(disponibles);

  } catch (error) {
    console.error("Error cargando dashboard");
  }
}

// Logout
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("usuario");
  window.location.href = "../../auth/login/login.html";
});

loadDashboard();