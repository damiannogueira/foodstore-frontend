import { getProductoById } from "../../../utils/api";
import type { Producto } from "../../../types/api";

interface CartItem {
  producto: Producto;
  cantidad: number;
}

const productDetail = document.getElementById("productDetail") as HTMLElement;
const message = document.getElementById("message") as HTMLParagraphElement;
const cartCount = document.getElementById("cartCount") as HTMLSpanElement;

const params = new URLSearchParams(window.location.search);
const productId = Number(params.get("id"));

// Verifica si hay un usuario logueado
const usuarioGuardado = localStorage.getItem("usuario");
if (!usuarioGuardado) {
  window.location.href = "../../auth/login/login.html";
}

// Obtiene el carrito guardado en localStorage
function getCart(): CartItem[] {
  return JSON.parse(localStorage.getItem("carrito") || "[]") as CartItem[];
}

// Guarda el carrito actualizado
function saveCart(cart: CartItem[]): void {
  localStorage.setItem("carrito", JSON.stringify(cart));
}

// Actualiza el contador del carrito
function updateCartCount(): void {
  const cart = getCart();
  const total = cart.reduce((acc, item) => acc + item.cantidad, 0);
  cartCount.textContent = String(total);
}

// Agrega el producto al carrito validando stock y disponibilidad
function addToCart(producto: Producto, cantidad: number): void {
  if (!producto.disponible || producto.stock <= 0) {
    message.textContent = "Este producto no está disponible.";
    return;
  }

  if (cantidad < 1 || cantidad > producto.stock) {
    message.textContent = "La cantidad seleccionada no es válida.";
    return;
  }

  const cart = getCart();
  const existingItem = cart.find((item) => item.producto.id === producto.id);

  if (existingItem) {
    const newQuantity = existingItem.cantidad + cantidad;

    if (newQuantity > producto.stock) {
      message.textContent = "No hay stock suficiente para esa cantidad.";
      return;
    }

    existingItem.cantidad = newQuantity;
  } else {
    cart.push({ producto, cantidad });
  }

  saveCart(cart);
  updateCartCount();
  message.textContent = "Producto agregado al carrito correctamente.";
}

// Carga el producto desde la API y arma el detalle en pantalla
async function loadProduct(): Promise<void> {
  try {
    const producto = await getProductoById(productId);

    productDetail.innerHTML = `
      <img src="${producto.imagen}" alt="${producto.nombre}" />

      <div class="detail-info">
        <h2>${producto.nombre}</h2>
        <p>${producto.descripcion}</p>

        <p><strong>Precio:</strong> $${producto.precio}</p>
        <p><strong>Stock disponible:</strong> ${producto.stock}</p>
        <p><strong>Estado:</strong> ${producto.disponible ? "Disponible" : "No disponible"}</p>

        <div class="detail-actions">
          <label for="quantity">Cantidad</label>
          <input class="input quantity-input" id="quantity" type="number" min="1" max="${producto.stock}" value="1" />

          <button class="btn btn-small" id="addToCartBtn">Agregar al carrito</button>
          <a class="link" href="../home/home.html">Volver</a>
        </div>
      </div>
    `;

    const quantityInput = document.getElementById("quantity") as HTMLInputElement;
    const addToCartBtn = document.getElementById("addToCartBtn") as HTMLButtonElement;

    addToCartBtn.addEventListener("click", () => {
      addToCart(producto, Number(quantityInput.value));
    });
  } catch (error) {
    productDetail.innerHTML = "<p>No se pudo cargar el producto.</p>";
  }
}

updateCartCount();
loadProduct();