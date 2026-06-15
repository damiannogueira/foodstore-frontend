import {
  getCategorias,
  getProductos,
  getPedidos
} from "../../../utils/api";

// Verifica si hay usuario logueado
const usuarioGuardado = localStorage.getItem("usuario");

if (!usuarioGuardado) {
  window.location.href = "../../auth/login/login.html";
}

const usuario = JSON.parse(usuarioGuardado || "{}");

if (usuario.rol?.toUpperCase() !== "ADMIN") {
  window.location.href = "../../auth/login/login.html";
}

const totalCategorias = document.getElementById("totalCategorias") as HTMLElement;
const totalProductos = document.getElementById("totalProductos") as HTMLElement;
const totalPedidos = document.getElementById("totalPedidos") as HTMLElement;
const productosDisponibles = document.getElementById("productosDisponibles") as HTMLElement;

const logoutBtn = document.getElementById("logoutBtn") as HTMLButtonElement;

async function cargarDashboard(): Promise<void> {
  try {
    const categorias = await getCategorias();
    const productos = await getProductos();
    const pedidos = await getPedidos();

    totalCategorias.textContent = String(categorias.length);
    totalProductos.textContent = String(productos.length);
    totalPedidos.textContent = String(pedidos.length);
    productosDisponibles.textContent = String(
      productos.filter((p) => p.disponible).length
    );
  } catch (error) {
    console.error("Error al cargar dashboard", error);
  }
}

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("usuario");
  localStorage.removeItem("carrito");
  window.location.href = "../../auth/login/login.html";
});

cargarDashboard();