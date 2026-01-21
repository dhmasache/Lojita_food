// frontend/src/pages/home.js
export function HomePage() {
    const element = document.createElement('div');
    element.innerHTML = `
        <h1>Bienvenido a LojitaFood</h1>
        <p>Explora los mejores restaurantes y platos de la ciudad.</p>
        <nav>
            <a href="/" data-link>Inicio</a> |
            <a href="/about" data-link>Acerca de</a>
        </nav>
    `;
    return element;
}
