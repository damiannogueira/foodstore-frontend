import { getPedidosByUsuario } from "../../../utils/api";
import type { Pedido } from "../../../types/api";

const ordersList = document.getElementById("ordersList") as HTMLDivElement;
const message = document.getElementById("message") as HTMLParagraphElement;

// Verifica si hay usuario logueado
const usuarioGuardado = localStorage.getItem("usuario");

if (!usuarioGuardado) {
  window.location.href = "../../auth/login/login.html";
}

const usuario = JSON.parse(usuarioGuardado || "{}") as { id: number };

// Muestra los pedidos del usuario en pantalla
function renderOrders(pedidos: Pedido[]): void {
  ordersList.innerHTML = "";

  if (pedidos.length === 0) {
    message.textContent = "Todavía no realizaste pedidos.";
    return;
  }

  pedidos.forEach((pedido) => {
    const card = document.createElement("article");
    card.className = "order-card";

    card.innerHTML = `
      <h3>Pedido #${pedido.id}</h3>
      <p><strong>Fecha:</strong> ${pedido.fecha}</p>
      <p><strong>Estado:</strong> ${pedido.estado}</p>
      <p><strong>Forma de pago:</strong> ${pedido.formaPago}</p>
      <p><strong>Total:</strong> $${pedido.total}</p>
      <p><strong>Dirección:</strong> ${pedido.direccionEntrega}</p>

      <h4>Detalle</h4>
      <ul>
        ${pedido.detalles.map((detalle) => `
          <li>
            ${detalle.productoNombre || detalle.nombreProducto || "Producto"} -
            Cantidad: ${detalle.cantidad} -
            Subtotal: $${detalle.subtotal ?? 0}
          </li>
        `).join("")}
      </ul>
    `;

    ordersList.appendChild(card);
  });
}

// Carga los pedidos desde la API
async function loadOrders(): Promise<void> {
  try {
    const pedidos = await getPedidosByUsuario(usuario.id);
    renderOrders(pedidos);
  } catch (error) {
    message.textContent = "Error al cargar los pedidos.";
  }
}

loadOrders();