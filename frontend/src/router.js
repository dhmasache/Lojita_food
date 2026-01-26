import { HomePage } from './pages/home.js';
import { AboutPage } from './pages/about.js';
import { LoginPage } from './pages/login.js';
import { RegisterPage } from './pages/register.js';

const routes = {
    '/': HomePage,
    '/about': AboutPage,
    '/login': LoginPage,
    '/register': RegisterPage,
    // Aquí puedes añadir más rutas
};

function router() {
    const path = window.location.pathname;
    const app = document.querySelector('#app'); // Asume que tienes un div con id="app" en index.html

    app.innerHTML = ''; // Limpia el contenido actual

    const PageComponent = routes[path];

    if (PageComponent) {
        app.appendChild(PageComponent());
    } else {
        app.innerHTML = `<h1>404 Not Found</h1><p>La página ${path} no existe.</p>`;
    }
}

// Escuchar los clics en los enlaces para la navegación SPA
document.addEventListener('click', e => {
    const { target } = e;
    if (target.matches('[data-link]')) {
        e.preventDefault(); // Previene la navegación por defecto
        window.history.pushState({}, '', target.href); // Usa la History API
        router(); // Llama al router para renderizar la nueva página
    }
});

// Escuchar los eventos de popstate (navegación hacia atrás/adelante del navegador)
window.addEventListener('popstate', router);

// Exportar la función router para que pueda ser llamada en main.js
export { router };
