import { createPedido } from "../../../utils/api";
import type { Producto } from "../../../types/api";

// Representa un item dentro del carrito
interface CartItem {
  producto: Producto;
  cantidad: number;
}

const cartItemsDiv = document.getElementById("cartItems") as HTMLDivElement;
const totalSpan = document.getElementById("total") as HTMLSpanElement;
const form = document.getElementById("checkoutForm") as HTMLFormElement;
const mensaje = document.getElementById("mensaje") as HTMLParagraphElement;

// Inputs
const telefono = document.getElementById("telefono") as HTMLInputElement;
const direccion = document.getElementById("direccion") as HTMLInputElement;
const formaPago = document.getElementById("formaPago") as HTMLSelectElement;
const notas = document.getElementById("notas") as HTMLTextAreaElement;

// Obtiene carrito desde localStorage
function getCart(): CartItem[] {
  return JSON.parse(localStorage.getItem("carrito") || "[]");
}

// Guarda carrito
function saveCart(cart: CartItem[]) {
  localStorage.setItem("carrito", JSON.stringify(cart));
}

// Renderiza los productos del carrito
function renderCart() {
  const cart = getCart();
  cartItemsDiv.innerHTML = "";

  let total = 0;

  cart.forEach((item, index) => {
    const subtotal = item.producto.precio * item.cantidad;
    total += subtotal;

    const div = document.createElement("div");
    div.className = "cart-item";

    div.innerHTML = `
      <div>
      <h4>${item.producto.nombre}</h4>
      <p>Cantidad: ${item.cantidad}</p>
      <p>Subtotal: $${subtotal}</p>
    </div>

    <button class="btn btn-danger btn-small" data-index="${index}">
      Eliminar
    </button>
  `;

    cartItemsDiv.appendChild(div);
  });

  totalSpan.textContent = String(total);

  // Botón eliminar
  document.querySelectorAll("button[data-index]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const index = Number((e.target as HTMLElement).getAttribute("data-index"));
      const cart = getCart();
      cart.splice(index, 1);
      saveCart(cart);
      renderCart();
    });
  });
}

// Crear pedido
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const cart = getCart();

  if (cart.length === 0) {
    mensaje.textContent = "El carrito está vacío";
    return;
  }

  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

  try {
    await createPedido({
      idUsuario: usuario.id,
      telefono: telefono.value,
      direccionEntrega: direccion.value,
      formaPago: formaPago.value as any,
      notas: notas.value,
      detalles: cart.map((item) => ({
        productoId: item.producto.id,
        cantidad: item.cantidad
      }))
    });

    mensaje.textContent = "Pedido realizado correctamente";

    localStorage.removeItem("carrito");

    setTimeout(() => {
      window.location.href = "../home/home.html";
    }, 1500);

  } catch (error) {
    mensaje.textContent = "Error al crear el pedido";
  }
});

renderCart();