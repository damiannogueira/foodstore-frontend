// Tipos usados para conectar el frontend con la API del backend

export type RolUsuario = "ADMIN" | "USUARIO";

export type EstadoPedido =
  | "PENDIENTE"
  | "CONFIRMADO"
  | "EN_PREPARACION"
  | "ENVIADO"
  | "ENTREGADO"
  | "TERMINADO"
  | "CANCELADO";

export type FormaPago = "EFECTIVO" | "TARJETA" | "TRANSFERENCIA";

// Usuario
export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  celular: string;
  rol: RolUsuario;
}

export interface UsuarioCreateRequest {
  nombre: string;
  apellido: string;
  email: string;
  celular: string;
  password: string;
}

// Login
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  celular: string;
  rol: RolUsuario;
}

// Categoría
export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
  imagen: string;
}

export interface CategoriaRequest {
  nombre: string;
  descripcion?: string;
  imagen: string;
}

// Producto
export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagen: string;
  disponible: boolean;
  categoria: Categoria;
}

export interface ProductoRequest {
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagen: string;
  disponible: boolean;
  categoriaId: number;
}

// Pedido
export interface PedidoDetalleRequest {
  productoId: number;
  cantidad: number;
}

export interface PedidoCreateRequest {
  idUsuario: number;
  formaPago: FormaPago;
  telefono: string;
  direccionEntrega: string;
  notas?: string;
  detalles: PedidoDetalleRequest[];
}

export interface PedidoDetalleResponse {
  id?: number;
  productoId?: number;
  productoNombre?: string;
  nombreProducto?: string;
  cantidad: number;
  precioUnitario?: number;
  subtotal?: number;
}

export interface Pedido {
  id: number;
  usuarioId: number;
  nombreCliente: string;
  fecha: string;
  estado: EstadoPedido;
  formaPago: FormaPago;
  total: number;
  telefono: string;
  direccionEntrega: string;
  notas?: string;
  detalles: PedidoDetalleResponse[];
}

export interface PedidoUpdateRequest {
  estado?: EstadoPedido;
  formaPago?: FormaPago;
}