import api from '../services/api.js';
import { router } from '../router.js';

function RegisterPage() {
    const page = document.createElement('div');
    page.className = 'register-container';
    
    page.innerHTML = `
        <form id="register-form" class="register-form">
            <h1>Regístrate Aquí</h1>
            <div id="general-error-message" class="message error" style="display: none;"></div>
            <div id="success-message" class="message success" style="display: none;"></div>
            
            <div class="form-group">
                <label for="nombre">Nombre</label>
                <input type="text" id="nombre" name="nombre" required>
                <span class="error-text" id="nombre-error" style="display: none;"></span>
            </div>
            
            <div class="form-group">
                <label for="email">Correo Electrónico</label>
                <input type="email" id="email" name="email" required>
                <span class="error-text" id="email-error" style="display: none;"></span>
            </div>
            
            <div class="form-group">
                <label for="password">Contraseña</label>
                <div class="password-wrapper">
                    <input type="password" id="password" name="password" required autocomplete="new-password">
                    <button type="button" class="password-toggle-btn">👁️</button>
                </div>
                <span class="error-text" id="password-error" style="display: none;"></span>
            </div>
            
                <!-- <div class="form-group">
                    <label>Mis Alergias (Selecciona todas las que apliquen)</label>
                    <div id="alergias-checkboxes" class="checkbox-group">
                        <!-- Allergy checkboxes will be loaded here -->
                        <p></p>
                    </div>
                </div> 
            
            <button type="submit" class="btn btn-primary">Crear Cuenta</button>
            <p class="sub-text">
                ¿Ya tienes una cuenta? <a href="/login" data-link>Inicia Sesión</a>.
            </p>
        </form>
    `;

    const form = page.querySelector('#register-form');
    const generalErrorMessage = page.querySelector('#general-error-message');
    const successMessage = page.querySelector('#success-message');
    
    const nombreInput = page.querySelector('#nombre');
    const emailInput = page.querySelector('#email');
    const passwordInput = page.querySelector('#password');
    // const alergiasCheckboxesContainer = page.querySelector('#alergias-checkboxes'); // Comentado porque la sección está deshabilitada

    const nombreError = page.querySelector('#nombre-error');
    const emailError = page.querySelector('#email-error');
    const passwordError = page.querySelector('#password-error');

    const toggleButton = page.querySelector('.password-toggle-btn');

    // --- Sección de alergias deshabilitada ---
    /*
    // Function to fetch alergias and populate the checkboxes
    const populateAlergiasCheckboxes = async () => {
        alergiasCheckboxesContainer.innerHTML = '<p>Cargando alergias...</p>';
        try {
            const alergias = await api.getAlergias();
            console.log('Fetched allergies:', alergias); // <--- ADDED THIS LINE
            alergiasCheckboxesContainer.innerHTML = ''; // Clear loading message
            if (alergias.length === 0) {
                alergiasCheckboxesContainer.innerHTML = '<p>No hay alergias disponibles.</p>';
                return;
            }
            alergias.forEach(alergia => {
                const checkboxDiv = document.createElement('div');
                checkboxDiv.className = 'checkbox-item';
                checkboxDiv.innerHTML = `
                    <input type="checkbox" id="alergia-${alergia.id}" name="selectedAlergiaIds" value="${alergia.id}">
                    <label for="alergia-${alergia.id}">${alergia.nombre}</label>
                `;
                alergiasCheckboxesContainer.appendChild(checkboxDiv);
            });
        } catch (error) {
            console.error('Error fetching alergias:', error);
                // const alergiasCheckboxesContainer = page.querySelector('#alergias-checkboxes');
            generalErrorMessage.style.display = 'block';
        }
    };
    // Call to populate alergias on page load
    populateAlergiasCheckboxes();
    */

                        // alergiasCheckboxesContainer.innerHTML = ''; // Clear loading message
    const validateNombre = () => {
        if (nombreInput.value.trim() === '') {
            nombreError.textContent = 'El nombre es obligatorio.';
            nombreError.style.display = 'block';
            nombreInput.classList.add('error');
            return false;
        }
        nombreError.style.display = 'none';
        nombreInput.classList.remove('error');
        return true;
    };

    const validateEmail = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailInput.value.trim() === '') {
            emailError.textContent = 'El correo electrónico es obligatorio.';
            emailError.style.display = 'block';
            emailInput.classList.add('error');
            return false;
        } else if (!emailRegex.test(emailInput.value)) {
            emailError.textContent = 'Introduce un correo electrónico válido.';
            emailError.style.display = 'block';
            emailInput.classList.add('error');
            return false;
        }
        emailError.style.display = 'none';
        emailInput.classList.remove('error');
        return true;
    };

    const validatePassword = () => {
        if (passwordInput.value.trim() === '') {
            passwordError.textContent = 'La contraseña es obligatoria.';
            passwordError.style.display = 'block';
            passwordInput.classList.add('error');
            return false;
        } else if (passwordInput.value.length < 6) {
            passwordError.textContent = 'La contraseña debe tener al menos 6 caracteres.';
            passwordError.style.display = 'block';
            passwordInput.classList.add('error');
            return false;
        }
        passwordError.style.display = 'none';
        passwordInput.classList.remove('error');
        return true;
    };

    // --- Event Listeners for real-time validation ---
    nombreInput.addEventListener('input', validateNombre);
    nombreInput.addEventListener('blur', validateNombre);
    emailInput.addEventListener('input', validateEmail);
    emailInput.addEventListener('blur', validateEmail);
    passwordInput.addEventListener('input', validatePassword);
    passwordInput.addEventListener('blur', validatePassword);

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        generalErrorMessage.style.display = 'none';
        successMessage.style.display = 'none';

        // Validate all fields on submit
        const isNombreValid = validateNombre();
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();

        if (!isNombreValid || !isEmailValid || !isPasswordValid) {
            generalErrorMessage.textContent = 'Por favor, corrige los errores en el formulario.';
            generalErrorMessage.style.display = 'block';
            return; // Stop submission if validation fails
        }

        const nombre = nombreInput.value;
        const email = emailInput.value;
        const password = passwordInput.value;
        try {
            const userData = { nombre, email, password };
            await api.register(userData);
            // Guardar el email en localStorage para la página de verificación
            localStorage.setItem('registeredEmailForVerification', email);
            successMessage.textContent = '¡Registro exitoso! Se ha enviado un código de verificación a tu correo. Redirigiendo para verificar...';
            successMessage.style.display = 'block';
            setTimeout(() => {
                window.history.pushState({}, '', '/verify-account');
                router();
            }, 3000); // Dar más tiempo para leer el mensaje
        } catch (error) {
            generalErrorMessage.textContent = error.message || 'Error al registrarse. Inténtalo de nuevo.';
            generalErrorMessage.style.display = 'block';
        }
    });

    toggleButton.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        toggleButton.textContent = type === 'password' ? '👁️' : '🙈';
    });

    return page;
}

export { RegisterPage };
