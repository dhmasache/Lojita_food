// frontend/src/pages/about.js
export function AboutPage() {
    const element = document.createElement('div');
    element.innerHTML = `
        <h1>Acerca de nosotros</h1>
        <p>LojitaFood es un marketplace de comida que conecta restaurantes con clientes.</p>
        <nav>
            <a href="/" data-link>Inicio</a> |
            <a href="/about" data-link>Acerca de</a>
        </nav>
    `;
    return element;
}
