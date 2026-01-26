// frontend/src/pages/about.js
export function AboutPage() {
    const element = document.createElement('div');
    element.className = 'about-container';
    
    element.innerHTML = `
        <h1>Acerca de Nosotros</h1>
        <p>LojitaFood es una plataforma innovadora diseñada para ser el puente digital entre los mejores restaurantes de Loja y los comensales que buscan experiencias culinarias únicas. Nuestra misión es simple: hacer que la buena comida sea más accesible para todos.</p>
        <nav>
            <a href="/" data-link>Volver al Inicio</a>
        </nav>
    `;
    return element;
}
