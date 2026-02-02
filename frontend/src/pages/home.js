export function HomePage() {
    const element = document.createElement('div');
    element.className = 'home-page-container'; // Contenedor para toda la página

    const user = JSON.parse(localStorage.getItem('lojita_user'));

    let heroContent = '';

    if (user) {
        // Contenido para un usuario que ha iniciado sesión
        heroContent = `
            <h1>¡Hola de nuevo, ${user.nombre}!</h1>
            <p>
                Es un gusto tenerte de vuelta en LojitaFood. <br>
                ¿Qué te apetece descubrir hoy?
            </p>
            <a href="#featured-restaurants-section" class="cta-button">
                Explorar Restaurantes
            </a>
        `;
    } else {
        // Contenido para un usuario que no ha iniciado sesión
        heroContent = `
            <h1>Bienvenido a LojitaFood</h1>
            <p>
                Tu portal para descubrir los sabores de Loja. <br>
                Encuentra los mejores restaurantes, explora menús y vive una experiencia culinaria única.
            </p>
            <a href="/login" data-link class="cta-button">
                Iniciar Sesión
            </a>
        `;
    }

    element.innerHTML = `
        <section class="home-hero">
            <main>
                ${heroContent}
            </main>
            <footer class="home-footer">
                <p>¿Quieres saber más? <a href="/about" data-link>Acerca de nosotros</a>.</p>
            </footer>
        </section>

        <section class="values-section">
            <div class="value-card">
                <h3>Calidad Garantizada</h3>
                <p>Solo los mejores ingredientes y los restaurantes más selectos.</p>
            </div>
            <div class="value-card">
                <h3>Experiencia Única</h3>
                <p>Descubre nuevos sabores y promociones exclusivas.</p>
            </div>
            <div class="value-card">
                <h3>Comodidad en Tu Hogar</h3>
                <p>Pide online y recibe tus platillos favoritos en la puerta.</p>
            </div>
        </section>

        <section id="featured-restaurants-section" class="featured-restaurants-section">
            <h2>Restaurantes Destacados</h2>
            <div class="restaurant-cards-grid">
                <!-- Placeholder para tarjetas de restaurantes -->
                <div class="restaurant-card">
                    <img src="https://via.placeholder.com/150/FF5733/FFFFFF?text=Rest+A" alt="Restaurante A">
                    <h3>Sabor Lojano</h3>
                    <p>Cocina tradicional con un toque moderno.</p>
                    <button class="view-restaurant-button">Ver Menú</button>
                </div>
                <div class="restaurant-card">
                    <img src="https://via.placeholder.com/150/33FF57/FFFFFF?text=Rest+B" alt="Restaurante B">
                    <h3>El Jardín del Chef</h3>
                    <p>Gastronomía fusión en un ambiente único.</p>
                    <button class="view-restaurant-button">Ver Menú</button>
                </div>
                <div class="restaurant-card">
                    <img src="https://via.placeholder.com/150/3357FF/FFFFFF?text=Rest+C" alt="Restaurante C">
                    <h3>Pizzería Roma</h3>
                    <p>Las mejores pizzas artesanales de la ciudad.</p>
                    <button class="view-restaurant-button">Ver Menú</button>
                </div>
            </div>
        </section>

        <section class="how-it-works-section">
            <h2>¿Cómo Funciona?</h2>
            <div class="steps-grid">
                <div class="step-card">
                    <span class="step-number">1</span>
                    <h3>Explora</h3>
                    <p>Descubre restaurantes y platillos cercanos a ti.</p>
                </div>
                <div class="step-card">
                    <span class="step-number">2</span>
                    <h3>Pide</h3>
                    <p>Selecciona tus favoritos y haz tu pedido fácilmente.</p>
                </div>
                <div class="step-card">
                    <span class="step-number">3</span>
                    <h3>Disfruta</h3>
                    <p>Recibe tu comida caliente y deliciosa en tu puerta.</p>
                </div>
            </div>
        </section>
    `;
    
    return element;
}


