import './styles/main.css';
import { router } from './router.js';
import { initHeader } from './components/Header.js';

// Cuando el DOM esté cargado, inicializa el header y el router
document.addEventListener('DOMContentLoaded', () => {
    initHeader(); // Carga el header dinámico
    router();     // Carga el contenido de la página actual
});
