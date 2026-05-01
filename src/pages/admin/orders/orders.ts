import { getPedidos, updateEstadoPedido } from "../../../utils/api";
import type { EstadoPedido, Pedido } from "../../../types/api";

const ordersList = document.getElementById("ordersList") as HTMLElement;
const message = document.getElementById("message") as HTMLParagraphElement;
const estadoFiltro = document.getElementById("estadoFiltro") as HTMLSelectElement;
const logoutBtn = document.getElementById("logoutBtn") as HTMLButtonElement;

let pedidos: Pedido[] = [];

// Verifica que el usuario sea administrador
const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

if (!usuario || usuario.rol !== "ADMIN") {
  window.location.href = "../../auth/login/login.html";
}

const estados: EstadoPedido[] = [
  "PENDIENTE",
  "CONFIRMADO",
  "EN_PREPARACION",
  "ENVIADO",
  "ENTREGADO",
  "TERMINADO",
  "CANCELADO"
];

// Muestra los pedidos y permite cambiar su estado
function renderPedidos(): void {
  const estadoSeleccionado = estadoFiltro.value;

  const pedidosFiltrados = estadoSeleccionado
    ? pedidos.filter((pedido) => pedido.estado === estadoSeleccionado)
    : pedidos;

  ordersList.innerHTML = "";

  if (pedidosFiltrados.length === 0) {
    ordersList.innerHTML = "<p>No hay pedidos para mostrar.</p>";
    return;
  }

  pedidosFiltrados.forEach((pedido) => {
    const card = document.createElement("article");
    card.className = "order-card";

    card.innerHTML = `
      <h3>Pedido #${pedido.id}</h3>
      <p><strong>Cliente:</strong> ${pedido.nombreCliente}</p>
      <p><strong>Fecha:</strong> ${pedido.fecha}</p>
      <p><strong>Estado actual:</strong> ${pedido.estado}</p>
      <p><strong>Forma de pago:</strong> ${pedido.formaPago}</p>
      <p><strong>Teléfono:</strong> ${pedido.telefono}</p>
      <p><strong>Dirección:</strong> ${pedido.direccionEntrega}</p>
      <p><strong>Notas:</strong> ${pedido.notas || "Sin notas"}</p>
      <p><strong>Total:</strong> $${pedido.total}</p>

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

      <label for="estado-${pedido.id}">Nuevo estado</label>
      <select class="input order-status-select" id="estado-${pedido.id}" data-id="${pedido.id}">        ${estados.map((estado) => `
          <option value="${estado}" ${estado === pedido.estado ? "selected" : ""}>
            ${estado}
          </option>
        `).join("")}
      </select>

      <button class="btn btn-small update-status-btn" data-id="${pedido.id}">
        Actualizar estado
      </button>
    `;

    ordersList.appendChild(card);
  });

  document.querySelectorAll(".update-status-btn").forEach((button) => {
    button.addEventListener("click", async () => {
      const pedidoId = Number((button as HTMLButtonElement).dataset.id);
      const select = document.getElementById(`estado-${pedidoId}`) as HTMLSelectElement;
      const nuevoEstado = select.value as EstadoPedido;

      try {
        await updateEstadoPedido(pedidoId, nuevoEstado);
        message.textContent = "Estado actualizado correctamente.";
        await loadPedidos();
      } catch (error) {
        message.textContent = "Error al actualizar el estado.";
      }
    });
  });
}

// Carga todos los pedidos para el panel administrador
async function loadPedidos(): Promise<void> {
  try {
    pedidos = await getPedidos();
    renderPedidos();
  } catch (error) {
    message.textContent = "Error al cargar los pedidos.";
  }
}

estadoFiltro.addEventListener("change", renderPedidos);

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("usuario");
  window.location.href = "../../auth/login/login.html";
});

loadPedidos();