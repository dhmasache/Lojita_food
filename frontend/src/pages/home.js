// src/pages/home.js
import { router } from '../router.js'; // Import the router function
import api from '../services/api.js'; // Import the API service

export const HomePage = () => {
    const pageElement = document.createElement('div');
    pageElement.className = 'main-container';

    // Hero Section
    const heroSection = document.createElement('section');
    heroSection.className = 'hero-section';
    heroSection.innerHTML = `
        <div class="hero-content">
            <h1>El Sabor de Loja, a tu Puerta</h1>
            <p>Descubre los mejores platos de los restaurantes locales y recíbelos en minutos.</p>
            <form id="search-form" class="search-bar">
                <input type="text" id="search-input" placeholder="Busca tu plato o restaurante favorito...">
                <button type="submit" id="search-button" class="primary">Buscar</button>
            </form>
        </div>
    `;

    // Category Section
    const categorySection = document.createElement('section');
    categorySection.className = 'category-section';
    categorySection.innerHTML = `
        <h2>Explora Categorías</h2>
        <div class="category-cards">
            <div class="category-card">
                <img src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Almuerzos">
                <h3>Almuerzos</h3>
            </div>
            <div class="category-card">
                <img src="https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Postres">
                <h3>Postres</h3>
            </div>
            <div class="category-card">
                <img src="https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Comida Italiana">
                <h3>Italiana</h3>
            </div>
            <div class="category-card">
                <img src="https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Bebidas">
                <h3>Bebidas</h3>
            </div>
        </div>
    `;

    // Featured Restaurants Section
    const featuredSection = document.createElement('section');
    featuredSection.className = 'featured-section';
    featuredSection.innerHTML = `
        <h2>Restaurantes Destacados</h2>
        <div class="restaurant-cards">
            <!-- Restaurant Card Example 1 -->
            <div class="restaurant-card">
                <img src="https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Restaurant Name">
                <div class="card-content">
                    <h3>El Fogón Lojano</h3>
                    <p>Comida tradicional ecuatoriana con un toque moderno.</p>
                    <div class="card-footer">
                        <span>⭐ 4.8</span>
                        <span>15-25 min</span>
                    </div>
                </div>
            </div>
            <!-- Restaurant Card Example 2 -->
            <div class="restaurant-card">
                <img src="https://images.pexels.com/photos/67468/pexels-photo-67468.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Restaurant Name">
                <div class="card-content">
                    <h3>Mama Mía Pizzería</h3>
                    <p>Las mejores pizzas artesanales de la ciudad.</p>
                    <div class="card-footer">
                        <span>⭐ 4.9</span>
                        <span>20-30 min</span>
                    </div>
                </div>
            </div>
            <!-- Restaurant Card Example 3 -->
             <div class="restaurant-card">
                <img src="https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Restaurant Name">
                <div class="card-content">
                    <h3>Sabor Oriental</h3>
                    <p>Auténtica comida asiática para disfrutar en casa.</p>
                    <div class="card-footer">
                        <span>⭐ 4.7</span>
                        <span>25-35 min</span>
                    </div>
                </div>
            </div>
        </div>
    `;

    pageElement.appendChild(heroSection);
    pageElement.appendChild(categorySection);
    pageElement.appendChild(featuredSection);

    // Add event listener for the search form
    const searchForm = heroSection.querySelector('#search-form');
    const searchInput = heroSection.querySelector('#search-input');

    searchForm.addEventListener('submit', async (e) => { // Make function async
        e.preventDefault(); // Prevent default form submission

        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            try {
                const results = await api.getRestaurantes(searchTerm); // Call API with search term

                if (results.length === 1) {
                    // If exactly one result, redirect to its detail page
                    // This assumes a restaurant detail page exists at /restaurante/:id
                    window.history.pushState({}, '', `/restaurante/${results[0].id}`);
                    router();
                } else {
                    // If zero or multiple results, redirect to the filtered list
                    window.history.pushState({}, '', `/restaurantes?search=${encodeURIComponent(searchTerm)}`);
                    router();
                }
            } catch (error) {
                console.error('Error during search:', error);
                // Fallback: redirect to filtered list even if API call fails
                window.history.pushState({}, '', `/restaurantes?search=${encodeURIComponent(searchTerm)}`);
                router();
            }
        }
    });

    return pageElement;
};