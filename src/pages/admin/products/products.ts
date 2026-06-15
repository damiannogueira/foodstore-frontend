import {
  getProductos,
  createProducto,
  updateProducto,
  deleteProducto,
  getCategorias
} from "../../../utils/api";

import type { Producto, Categoria } from "../../../types/api";

const list = document.getElementById("productsList")!;
const formContainer = document.getElementById("formContainer")!;
const form = document.getElementById("productForm") as HTMLFormElement;
const formTitle = document.getElementById("formTitle") as HTMLHeadingElement;
const message = document.getElementById("message")!;
const newBtn = document.getElementById("newProductBtn")!;
const cancelBtn = document.getElementById("cancelBtn")!;
const productId = document.getElementById("productId") as HTMLInputElement;
const nombre = document.getElementById("nombre") as HTMLInputElement;
const descripcion = document.getElementById("descripcion") as HTMLTextAreaElement;
const precio = document.getElementById("precio") as HTMLInputElement;
const stock = document.getElementById("stock") as HTMLInputElement;
const categoriaId = document.getElementById("categoriaId") as HTMLSelectElement;
const imagen = document.getElementById("imagen") as HTMLInputElement;
const disponible = document.getElementById("disponible") as HTMLInputElement;

// Verifica admin
const usuarioGuardado = localStorage.getItem("usuario");

if (!usuarioGuardado) {
  window.location.href = "../../auth/login/login.html";
}

const usuario = JSON.parse(usuarioGuardado || "{}");

if (usuario.rol?.toUpperCase() !== "ADMIN") {
  window.location.href = "../../auth/login/login.html";
}

// Carga categorías en select
async function loadCategorias() {
  const categorias = await getCategorias();

  categoriaId.innerHTML = "";

  categorias.forEach((c: Categoria) => {
    const option = document.createElement("option");
    option.value = String(c.id);
    option.textContent = c.nombre;
    categoriaId.appendChild(option);
  });
}

// Render productos
async function loadProductos() {
  const productos = await getProductos();

  list.innerHTML = "";

  productos.forEach((p: Producto) => {
    const div = document.createElement("div");
    div.className = "admin-product-card";

    div.innerHTML = `
      <div>
        <h3>${p.nombre}</h3>
        <p><strong>Precio:</strong> $${p.precio}</p>
        <p><strong>Stock:</strong> ${p.stock}</p>
      </div>

      <div class="admin-product-actions">
        <button class="btn btn-small" data-edit="${p.id}">Editar</button>
        <button class="btn btn-danger btn-small" data-del="${p.id}">Eliminar</button>
      </div>
    `;

    list.appendChild(div);
  });

  // Editar
  document.querySelectorAll("[data-edit]").forEach(btn => {
  btn.addEventListener("click", () => {
    const id = Number((btn as HTMLElement).dataset.edit);
    const p = productos.find(x => x.id === id);
    if (!p) return;
    const formTitle = document.getElementById("formTitle") as HTMLHeadingElement;

    formContainer.classList.remove("hidden");
    formContainer.scrollIntoView({ behavior: "smooth" });
    formTitle.textContent = "Editar producto";

    productId.value = String(p.id);
    nombre.value = p.nombre;
    descripcion.value = p.descripcion;
    precio.value = String(p.precio);
    stock.value = String(p.stock);
    categoriaId.value = String(p.categoria.id);
    imagen.value = p.imagen;
    disponible.checked = p.disponible;
  });
});

  // Eliminar
  document.querySelectorAll("[data-del]").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = Number((btn as HTMLElement).dataset.del);

      if (!confirm("Eliminar producto?")) return;

      await deleteProducto(id);
      loadProductos();
    });
  });
}

// Guardar
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    nombre: nombre.value,
    descripcion: descripcion.value,
    precio: Number(precio.value),
    stock: Number(stock.value),
    categoriaId: Number(categoriaId.value),
    imagen: imagen.value,
    disponible: disponible.checked
  };

  if (productId.value) {
    await updateProducto(Number(productId.value), data);
    message.textContent = "Producto actualizado";
  } else {
    await createProducto(data);
    message.textContent = "Producto creado";
  }

  form.reset();
  formContainer.classList.add("hidden");
  formTitle.textContent = "Nuevo producto";
  loadProductos();
});

newBtn.addEventListener("click", () => {
  form.reset();
  productId.value = "";

  formTitle.textContent = "Nuevo producto";
  formContainer.classList.remove("hidden");
  formContainer.scrollIntoView({ behavior: "smooth" });
  
});

cancelBtn.addEventListener("click", () => {
  formContainer.classList.add("hidden");
});

loadCategorias();
loadProductos();