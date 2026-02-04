import api from '../services/api.js';
import { router } from '../router.js';

export function VerifyAccountPage() {
    const email = localStorage.getItem('registeredEmailForVerification'); // Obtener el email del localStorage

    const container = document.createElement('div');
    container.className = 'auth-container'; // Usar la clase de contenedor común
    container.innerHTML = `
        <div class="auth-card"> <!-- Usar la clase de tarjeta común -->
            <h2>Verifica tu Cuenta</h2>
            <p>Se ha enviado un código de verificación a tu correo electrónico: <strong>${email || 'no disponible'}</strong>.</p>
            <p>Por favor, ingresa el código a continuación para activar tu cuenta.</p>
            <form id="verifyAccountForm">
                <div class="form-group">
                    <label for="verificationCode">Código de Verificación:</label>
                    <input type="text" id="verificationCode" name="verificationCode" required maxlength="6" pattern="[0-9]{6}">
                </div>
                <button type="submit" class="btn btn-primary">Verificar Cuenta</button>
            </form>
            <p id="message" class="message"></p>
        </div>
    `;

    const verifyAccountForm = container.querySelector('#verifyAccountForm');
    const messageElement = container.querySelector('#message');

    verifyAccountForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const verificationCode = container.querySelector('#verificationCode').value;

        if (!email) {
            messageElement.textContent = 'Error: No se encontró el correo electrónico para verificar.';
            messageElement.style.color = 'red';
            return;
        }

        try {
            const response = await api.verifyAccount({ email, verificationCode });
            messageElement.textContent = response.message;
            messageElement.style.color = 'green';
            localStorage.removeItem('registeredEmailForVerification'); // Limpiar después de la verificación
            setTimeout(() => {
                router('/login'); // Redirigir al login después de un éxito
            }, 3000);
        } catch (error) {
            messageElement.textContent = error.message || 'Error al verificar la cuenta.';
            messageElement.style.color = 'red';
        }
    });

    return container;
}
