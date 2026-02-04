import api from '../services/api.js';
import { router } from '../router.js';

export function ResetPasswordPage() {
    const container = document.createElement('div');
    container.className = 'auth-container'; // Usar la clase de contenedor común
    container.innerHTML = `
        <div class="auth-card"> <!-- Usar la clase de tarjeta común -->
            <h2>Restablecer Contraseña</h2>
            <p>Ingresa tu nueva contraseña a continuación.</p>
            <form id="resetPasswordForm">
                <div class="form-group">
                    <label for="password">Nueva Contraseña:</label>
                    <input type="password" id="password" name="password" required>
                </div>
                <div class="form-group">
                    <label for="confirmPassword">Confirmar Contraseña:</label>
                    <input type="password" id="confirmPassword" name="confirmPassword" required>
                </div>
                <button type="submit" class="btn btn-primary">Restablecer Contraseña</button>
            </form>
            <p id="message" class="message"></p>
        </div>
    `;

    const resetPasswordForm = container.querySelector('#resetPasswordForm');
    const messageElement = container.querySelector('#message');
    const passwordInput = container.querySelector('#password');
    const confirmPasswordInput = container.querySelector('#confirmPassword');

    resetPasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newPassword = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        if (newPassword !== confirmPassword) {
            messageElement.textContent = 'Las contraseñas no coinciden.';
            messageElement.style.color = 'red';
            return;
        }

        // Extraer el token de la URL
        const pathParts = window.location.pathname.split('/');
        const token = pathParts[pathParts.length - 1];

        if (!token) {
            messageElement.textContent = 'Error: Token de restablecimiento no encontrado en la URL.';
            messageElement.style.color = 'red';
            return;
        }

        try {
            messageElement.textContent = 'Restableciendo contraseña...';
            messageElement.style.color = 'blue';
            const response = await api.resetPassword(token, { password: newPassword });
            messageElement.textContent = response.message;
            messageElement.style.color = 'green';
            setTimeout(() => {
                router('/login'); // Redirigir al login después de un éxito
            }, 3000);
        } catch (error) {
            messageElement.textContent = error.message || 'Error al restablecer la contraseña.';
            messageElement.style.color = 'red';
        }
    });

    return container;
}
