import api from '../services/api.js';
import { router } from '../router.js';

export function ForgotPasswordPage() {
    const container = document.createElement('div');
    container.className = 'auth-container'; // Usar la clase de contenedor común
    container.innerHTML = `
        <div class="auth-card"> <!-- Usar la clase de tarjeta común -->
            <h2>¿Olvidaste tu Contraseña?</h2>
            <p>Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.</p>
            <form id="forgotPasswordForm">
                <div class="form-group">
                    <label for="email">Correo Electrónico:</label>
                    <input type="email" id="email" name="email" required>
                </div>
                <button type="submit" class="btn btn-primary">Enviar Enlace de Restablecimiento</button>
            </form>
            <p id="message" class="message"></p>
            <p class="sub-text">
                ¿Recordaste tu contraseña? <a href="/login" data-link>Inicia Sesión</a>.
            </p>
        </div>
    `;

    const forgotPasswordForm = container.querySelector('#forgotPasswordForm');
    const messageElement = container.querySelector('#message');

    forgotPasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = container.querySelector('#email').value;

        try {
            messageElement.textContent = 'Enviando enlace...';
            messageElement.style.color = 'blue';
            const response = await api.forgotPassword({ email });
            messageElement.textContent = response.message;
            messageElement.style.color = 'green';
            // Opcional: redirigir después de un tiempo o dejar el mensaje
            // setTimeout(() => {
            //     router('/login');
            // }, 5000);
        } catch (error) {
            messageElement.textContent = error.message || 'Error al solicitar el restablecimiento de contraseña.';
            messageElement.style.color = 'red';
        }
    });

    return container;
}
