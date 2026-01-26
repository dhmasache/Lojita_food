import api from '../services/api.js';

function LoginPage() {
    const page = document.createElement('div');
    page.className = 'login-container';
    
    // Usamos .innerHTML para construir la estructura interna
    page.innerHTML = `
        <form id="login-form" class="login-form">
            <h1>Iniciar Sesión</h1>
            <div id="error-message" class="error-message" style="display: none;"></div>
            <div class="form-group">
                <label for="email">Correo Electrónico</label>
                <input type="email" id="email" name="email" required>
            </div>
            <div class="form-group">
                <label for="password">Contraseña</label>
                <input type="password" id="password" name="password" required>
            </div>
            <button type="submit" class="submit-button">Ingresar</button>
            <p class="sub-text">
                ¿No tienes una cuenta? <a href="/register" data-link>Regístrate aquí</a>.
            </p>
        </form>
    `;

    const form = page.querySelector('#login-form');
    const errorMessage = page.querySelector('#error-message');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorMessage.style.display = 'none'; // Ocultar mensaje de error

        const email = form.elements.email.value;
        const password = form.elements.password.value;

        try {
            const data = await api.login({ email, password });
            
            if (data.token) {
                localStorage.setItem('jwt_token', data.token);
                window.history.pushState({}, '', '/');
                window.location.reload(); // Recargar para reflejar el estado de login
            } else {
                throw new Error('No se recibió un token del servidor.');
            }

        } catch (error) {
            errorMessage.textContent = error.message || 'Error al iniciar sesión. Verifica tus credenciales.';
            errorMessage.style.display = 'block';
        }
    });

    return page;
}

export { LoginPage };

