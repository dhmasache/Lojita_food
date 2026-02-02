import api from '../services/api.js';
import { router } from '../router.js'; // Importar el router

function LoginPage() {
    const page = document.createElement('div');
    page.className = 'login-container';
    
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
        errorMessage.style.display = 'none';

        const email = form.elements.email.value;
        const password = form.elements.password.value;

        try {
            const data = await api.login({ email, password });
            
            if (data.token && data.usuario) {
                // 1. Guardar token y datos de usuario
                localStorage.setItem('jwt_token', data.token);
                localStorage.setItem('lojita_user', JSON.stringify(data.usuario));

                // 2. Disparar un evento global INMEDIATAMENTE para que el header se actualice
                document.dispatchEvent(new CustomEvent('authChange'));

                // 3. Determinar la ruta de redirección según el rol
                let redirectPath = '/'; // Ruta por defecto para 'cliente'
                const userRole = data.usuario.rol;

                if (userRole === 'admin') {
                    redirectPath = '/admin';
                } else if (userRole === 'propietario') {
                    redirectPath = '/mi-restaurante';
                }

                // 4. Navegar a la ruta correspondiente y actualizar la vista
                window.history.pushState({}, '', redirectPath);
                router(); // Renderiza el contenido de la nueva ruta
                
            } else {
                throw new Error('Respuesta inválida del servidor.');
            }

        } catch (error) {
            errorMessage.textContent = error.message || 'Error al iniciar sesión. Verifica tus credenciales.';
            errorMessage.style.display = 'block';
        }
    });

    return page;
}

export { LoginPage };

