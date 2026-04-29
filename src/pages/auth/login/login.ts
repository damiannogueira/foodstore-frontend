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

    if (usuario.rol === "ADMIN") {
      window.location.href = "../../admin/adminHome/adminHome.html";
    } else {
      window.location.href = "../../store/home/home.html";
    }
  } catch (error) {
    message.textContent = "Email o contraseña incorrectos.";
  }
});