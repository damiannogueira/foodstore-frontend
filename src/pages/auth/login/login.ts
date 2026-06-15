import { login } from "../../../utils/api";

// Elementos del formulario
const form = document.getElementById("loginForm") as HTMLFormElement;
const emailInput = document.getElementById("email") as HTMLInputElement;
const passwordInput = document.getElementById("password") as HTMLInputElement;
const message = document.getElementById("loginMessage") as HTMLParagraphElement;

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  try {
    const usuario = await login({
      email: emailInput.value.trim(),
      password: passwordInput.value
    });

    // Guardo la sesión en localStorage
    localStorage.setItem("usuario", JSON.stringify(usuario));

    const rol = usuario.rol?.toUpperCase();

    if (rol === "ADMIN") {
      window.location.href = "../../admin/adminHome/adminHome.html";
    } else if (rol === "USUARIO") {
      window.location.href = "../../store/home/home.html";
    } else {
      localStorage.removeItem("usuario");
      message.textContent = "Rol de usuario no válido.";
    }
  } catch (error) {
    message.textContent = "Email o contraseña incorrectos.";
  }
});