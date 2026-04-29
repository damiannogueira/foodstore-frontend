import { register } from "../../../utils/api";

const form = document.getElementById("registerForm") as HTMLFormElement;
const mensaje = document.getElementById("mensaje") as HTMLParagraphElement;

// Inputs
const nombre = document.getElementById("nombre") as HTMLInputElement;
const apellido = document.getElementById("apellido") as HTMLInputElement;
const email = document.getElementById("email") as HTMLInputElement;
const celular = document.getElementById("celular") as HTMLInputElement;
const password = document.getElementById("password") as HTMLInputElement;

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    await register({
      nombre: nombre.value,
      apellido: apellido.value,
      email: email.value,
      celular: celular.value,
      password: password.value
    });

    mensaje.textContent = "Usuario creado correctamente";

    // Redirige al login
    setTimeout(() => {
      window.location.href = "../login/login.html";
    }, 1500);

  } catch (error) {
    mensaje.textContent = "Error al registrar usuario";
  }
});