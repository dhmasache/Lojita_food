import api from '../services/api.js';

function RegisterPage() {
    const page = document.createElement('div');
    page.className = 'register-container';
    
    page.innerHTML = `
        <form id="register-form" class="register-form">
            <h1>Regístrate Aquí</h1>
            <div id="error-message" class="error-message" style="display: none;"></div>
            <div class="form-group">
                <label for="nombre">Nombre</label>
                <input type="text" id="nombre" name="nombre" required>
            </div>
            <div class="form-group">
                <label for="email">Correo Electrónico</label>
                <input type="email" id="email" name="email" required>
            </div>
            <div class="form-group">
                <label for="password">Contraseña</label>
                <input type="password" id="password" name="password" required>
            </div>
            <button type="submit" class="submit-button">Crear Cuenta</button>
            <p class="sub-text">
                ¿Ya tienes una cuenta? <a href="/login" data-link>Inicia Sesión</a>.
            </p>
        </form>
    `;

    const form = page.querySelector('#register-form');
    const errorMessage = page.querySelector('#error-message');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorMessage.style.display = 'none'; // Ocultar mensaje de error

        const nombre = form.elements.nombre.value;
        const email = form.elements.email.value;
        const password = form.elements.password.value;

        try {
            const userData = { nombre, email, password };
            // Por defecto, el rol será 'cliente' en el backend si no se envía
            await api.register(userData);
            
            // Redirigir al login después de un registro exitoso
            alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
            window.history.pushState({}, '', '/login');
            window.location.reload(); // Recargar para que el router renderice la página de login
            

        } catch (error) {
            errorMessage.textContent = error.message || 'Error al registrarse. Inténtalo de nuevo.';
            errorMessage.style.display = 'block';
        }
    });

    return page;
}

export { RegisterPage };
