// Funciones para comunicarse con el backend usando fetch
// Todas las peticiones se hacen con async/await

import type {
  Categoria,
  CategoriaRequest,
  Producto,
  ProductoRequest,
  LoginRequest,
  LoginResponse,
  UsuarioCreateRequest,
  Pedido,
  PedidoCreateRequest,
  EstadoPedido
} from "../types/api";

// URL base del backend
const BASE_URL = "http://localhost:8080/api";

// --- AUTH ---

// Login de usuario
export async function login(data: LoginRequest): Promise<LoginResponse> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    throw new Error("Error en login");
  }

  return res.json();
}

// Registro de usuario
export async function register(data: UsuarioCreateRequest) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    throw new Error("Error al registrar usuario");
  }

  return res.json();
}

// --- CATEGORIAS ---

// Obtener todas las categorías
export async function getCategorias(): Promise<Categoria[]> {
  const res = await fetch(`${BASE_URL}/categories`);

  if (!res.ok) {
    throw new Error("Error al obtener categorías");
  }

  return res.json();
}

// Crear categoría
export async function createCategoria(data: CategoriaRequest) {
  const res = await fetch(`${BASE_URL}/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    throw new Error("Error al crear categoría");
  }

  return res.json();
}

// Actualizar categoría
export async function updateCategoria(id: number, data: CategoriaRequest): Promise<Categoria> {
  const res = await fetch(`${BASE_URL}/categories/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    throw new Error("Error al actualizar categoría");
  }

  return res.json();
}

// Eliminar categoría
export async function deleteCategoria(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/categories/${id}`, {
    method: "DELETE"
  });

  if (!res.ok) {
    throw new Error("Error al eliminar categoría");
  }
}

// --- PRODUCTOS ---

// Obtener todos los productos
export async function getProductos(): Promise<Producto[]> {
  const res = await fetch(`${BASE_URL}/products`);

  if (!res.ok) {
    throw new Error("Error al obtener productos");
  }

  return res.json();
}

// Obtener producto por ID
export async function getProductoById(id: number): Promise<Producto> {
  const res = await fetch(`${BASE_URL}/products/${id}`);

  if (!res.ok) {
    throw new Error("Producto no encontrado");
  }

  return res.json();
}

// Crear producto
export async function createProducto(data: ProductoRequest) {
  const res = await fetch(`${BASE_URL}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    throw new Error("Error al crear producto");
  }

  return res.json();
}

// Actualizar producto
export async function updateProducto(id: number, data: ProductoRequest) {
  const res = await fetch(`${BASE_URL}/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  if (!res.ok) throw new Error("Error al actualizar producto");

  return res.json();
}

// Eliminar producto
export async function deleteProducto(id: number) {
  const res = await fetch(`${BASE_URL}/products/${id}`, {
    method: "DELETE"
  });

  if (!res.ok) throw new Error("Error al eliminar producto");
}

// --- PEDIDOS ---

// Crear pedido
export async function createPedido(data: PedidoCreateRequest): Promise<Pedido> {
  const res = await fetch(`${BASE_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    throw new Error("Error al crear pedido");
  }

  return res.json();
}

// Obtener pedidos de un usuario
export async function getPedidosByUsuario(usuarioId: number): Promise<Pedido[]> {
  const res = await fetch(`${BASE_URL}/orders/usuario/${usuarioId}`);

  if (!res.ok) {
    throw new Error("Error al obtener pedidos");
  }

  return res.json();
}

// Obtener todos los pedidos (admin)
export async function getPedidos(): Promise<Pedido[]> {
  const res = await fetch(`${BASE_URL}/orders`);

  if (!res.ok) {
    throw new Error("Error al obtener pedidos");
  }

  return res.json();
}

// Actualizar estado del pedido
export async function updateEstadoPedido(id: number, estado: EstadoPedido) {
  const res = await fetch(`${BASE_URL}/orders/${id}/status?estado=${estado}`, {
    method: "PATCH"
  });

  if (!res.ok) {
    throw new Error("Error al actualizar estado");
  }

  return res.json();
}