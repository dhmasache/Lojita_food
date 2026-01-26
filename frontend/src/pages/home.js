// frontend/src/pages/home.js
export function HomePage() {
    const element = document.createElement('div');
    element.className = 'home-hero';

    element.innerHTML = `
        <main>
            <h1>Bienvenido a LojitaFood</h1>
            <p>
                Tu portal para descubrir los sabores de Loja. <br>
                Encuentra los mejores restaurantes, explora menús y vive una experiencia culinaria única.
            </p>
            <a href="/login" data-link class="cta-button">
                Iniciar Sesión
            </a>
        </main>
        <footer class="home-footer">
            <p>¿Quieres saber más? <a href="/about" data-link>Acerca de nosotros</a>.</p>
        </footer>
    `;
    
    return element;
}


