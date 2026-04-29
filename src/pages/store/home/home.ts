import { getCategorias, getProductos } from "../../../utils/api";
import type { Categoria, Producto } from "../../../types/api";

const categoriesList = document.getElementById("categoriesList") as HTMLDivElement;
const productsGrid = document.getElementById("productsGrid") as HTMLDivElement;
const searchInput = document.getElementById("searchInput") as HTMLInputElement;
const sortSelect = document.getElementById("sortSelect") as HTMLSelectElement;
const productsCounter = document.getElementById("productsCounter") as HTMLParagraphElement;
const cartCount = document.getElementById("cartCount") as HTMLSpanElement;
const allCategoriesBtn = document.getElementById("allCategoriesBtn") as HTMLButtonElement;
const logoutBtn = document.getElementById("logoutBtn") as HTMLButtonElement;

let productos: Producto[] = [];
let categoriaSeleccionada: number | null = null;

// Verifica si hay un usuario logueado, si no redirige al login
const usuarioGuardado = localStorage.getItem("usuario");
if (!usuarioGuardado) {
  window.location.href = "../../auth/login/login.html";
}

// Calcula la cantidad total de productos en el carrito
function actualizarContadorCarrito(): void {
  const carrito = JSON.parse(localStorage.getItem("carrito") || "[]") as { cantidad: number }[];
  const total = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  cartCount.textContent = String(total);
}

// Muestra las categorías en el sidebar y permite filtrar por ellas
function renderCategorias(categorias: Categoria[]): void {
  categoriesList.innerHTML = "";

  categorias.forEach((categoria) => {
    const btn = document.createElement("button");
    btn.textContent = categoria.nombre;

    btn.addEventListener("click", () => {
      categoriaSeleccionada = categoria.id;
      renderProductos();
    });

    categoriesList.appendChild(btn);
  });
}
// Filtra productos por búsqueda y categoría seleccionada
function renderProductos(): void {
  const search = searchInput.value.toLowerCase();
  let filtrados = productos.filter((producto) => {
    const coincideBusqueda =
      producto.nombre.toLowerCase().includes(search) ||
      producto.descripcion.toLowerCase().includes(search);

    const coincideCategoria =
      categoriaSeleccionada === null || producto.categoria.id === categoriaSeleccionada;

    return coincideBusqueda && coincideCategoria;
  });

  if (sortSelect.value === "nameAsc") {
    filtrados = filtrados.sort((a, b) => a.nombre.localeCompare(b.nombre));
  }

  if (sortSelect.value === "nameDesc") {
    filtrados = filtrados.sort((a, b) => b.nombre.localeCompare(a.nombre));
  }

  if (sortSelect.value === "priceAsc") {
    filtrados = filtrados.sort((a, b) => a.precio - b.precio);
  }

  if (sortSelect.value === "priceDesc") {
    filtrados = filtrados.sort((a, b) => b.precio - a.precio);
  }

  productsCounter.textContent = `${filtrados.length} producto(s) encontrado(s)`;
  productsGrid.innerHTML = "";

  filtrados.forEach((producto) => {
    const card = document.createElement("article");
    card.className = "product-card";

    card.innerHTML = `
      <img src="${producto.imagen}" alt="${producto.nombre}" />
      <h3>${producto.nombre}</h3>
      <p>${producto.descripcion}</p>
      <strong>$${producto.precio}</strong>
      <span class="badge">${producto.disponible ? "Disponible" : "No disponible"}</span>
      <a href="../productDetail/productDetail.html?id=${producto.id}">Ver detalle</a>
    `;

    productsGrid.appendChild(card);
  });
}

// Carga categorías y productos desde la API
async function cargarDatos(): Promise<void> {
  try {
    const categorias = await getCategorias();
    productos = await getProductos();

    renderCategorias(categorias);
    renderProductos();
    actualizarContadorCarrito();
  } catch (error) {
    productsGrid.innerHTML = "<p>Error al cargar productos.</p>";
  }
}

allCategoriesBtn.addEventListener("click", () => {
  categoriaSeleccionada = null;
  renderProductos();
});

searchInput.addEventListener("input", renderProductos);
sortSelect.addEventListener("change", renderProductos);

// Cierra sesión eliminando datos del localStorage y redirigiendo al login
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("usuario");
  localStorage.removeItem("carrito");
  window.location.href = "../../auth/login/login.html";
});

cargarDatos();