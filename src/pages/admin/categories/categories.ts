import {
  getCategorias,
  createCategoria,
  updateCategoria,
  deleteCategoria
} from "../../../utils/api";

import type { Categoria } from "../../../types/api";

const categoriesList = document.getElementById("categoriesList") as HTMLElement;
const formContainer = document.getElementById("formContainer") as HTMLElement;
const form = document.getElementById("categoryForm") as HTMLFormElement;
const formTitle = document.getElementById("formTitle") as HTMLHeadingElement;
const message = document.getElementById("message") as HTMLParagraphElement;
const newCategoryBtn = document.getElementById("newCategoryBtn") as HTMLButtonElement;
const cancelBtn = document.getElementById("cancelBtn") as HTMLButtonElement;
const logoutBtn = document.getElementById("logoutBtn") as HTMLButtonElement;
const categoryId = document.getElementById("categoryId") as HTMLInputElement;
const nombre = document.getElementById("nombre") as HTMLInputElement;
const descripcion = document.getElementById("descripcion") as HTMLTextAreaElement;
const imagen = document.getElementById("imagen") as HTMLInputElement;

// Valida que el usuario sea administrador
const usuarioGuardado = localStorage.getItem("usuario");

if (!usuarioGuardado) {
  window.location.href = "../../auth/login/login.html";
}

const usuario = JSON.parse(usuarioGuardado || "{}");

if (usuario.rol !== "ADMIN") {
  window.location.href = "../../store/home/home.html";
}

// Muestra u oculta el formulario
function showForm(categoria?: Categoria): void {
  formContainer.classList.remove("hidden");

  if (categoria) {
    formTitle.textContent = "Editar categoría";
    categoryId.value = String(categoria.id);
    nombre.value = categoria.nombre;
    descripcion.value = categoria.descripcion || "";
    imagen.value = categoria.imagen;
  } else {
    formTitle.textContent = "Nueva categoría";
    form.reset();
    categoryId.value = "";
  }

  formContainer.scrollIntoView({ behavior: "smooth" });
}

// Renderiza la tabla/lista de categorías
function renderCategorias(categorias: Categoria[]): void {
  categoriesList.innerHTML = "";

  categorias.forEach((categoria) => {
    const card = document.createElement("article");
    card.className = "admin-card";

    card.innerHTML = `
      <img src="${categoria.imagen}" alt="${categoria.nombre}" />

      <div class="admin-category-info">
        <h3>${categoria.nombre}</h3>
        <p>${categoria.descripcion || "Sin descripción"}</p>
      </div>

      <div class="admin-category-actions">
        <button class="btn btn-small edit-btn" data-id="${categoria.id}">Editar</button>
        <button class="btn btn-danger btn-small delete-btn" data-id="${categoria.id}">Eliminar</button>
      </div>
    `;

    categoriesList.appendChild(card);
  });

  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number((btn as HTMLButtonElement).dataset.id);
      const categoria = categorias.find((c) => c.id === id);

      if (categoria) {
        showForm(categoria);
      }
    });
  });

  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = Number((btn as HTMLButtonElement).dataset.id);

      const confirmed = confirm("¿Seguro que querés eliminar esta categoría?");
      if (!confirmed) return;

      try {
        await deleteCategoria(id);
        message.textContent = "Categoría eliminada correctamente.";
        await loadCategorias();
      } catch (error) {
        message.textContent = "Error al eliminar la categoría.";
      }
    });
  });
}

// Carga categorías desde la API
async function loadCategorias(): Promise<void> {
  try {
    const categorias = await getCategorias();
    renderCategorias(categorias);
  } catch (error) {
    message.textContent = "Error al cargar categorías.";
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const data = {
    nombre: nombre.value.trim(),
    descripcion: descripcion.value.trim(),
    imagen: imagen.value.trim()
  };

  try {
    if (categoryId.value) {
      await updateCategoria(Number(categoryId.value), data);
      message.textContent = "Categoría actualizada correctamente.";
    } else {
      await createCategoria(data);
      message.textContent = "Categoría creada correctamente.";
    }

    formContainer.classList.add("hidden");
    form.reset();
    await loadCategorias();
  } catch (error) {
    message.textContent = "Error al guardar la categoría.";
  }
});

newCategoryBtn.addEventListener("click", () => showForm());

cancelBtn.addEventListener("click", () => {
  formContainer.classList.add("hidden");
  form.reset();
});

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("usuario");
  window.location.href = "../../auth/login/login.html";
});

loadCategorias();