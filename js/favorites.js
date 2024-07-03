const app = document.getElementById("app");

// click en favorito -> toggleFavorite(name)
const addFavoriteListeners = () => {
    const favoriteButtons = document.querySelectorAll('.favorite-btn');
    favoriteButtons.forEach(button => {
        button.addEventListener('click', () => {
            const name = button.getAttribute('data-name');
            toggleFavorite(name);
        });
    });
};

// saco la info del LocalStorage y la muestro en el DOM
const getFavorites = async () => {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    app.innerHTML = '';
    for (const name of favorites) {
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
            const data = await response.json();
            const template = `
                <div class="card">
                    <img src="${data.sprites.front_default}" alt="${data.name}"/>
                    <p>${data.name}</p>
                    <span class="favorite-btn" data-name="${data.name}">★</span>
                </div>`;
            app.innerHTML += template;
        } catch (error) {
            console.error('Error fetching Pokémon data:', error);
        }
    }
    addFavoriteListeners(); 
};
getFavorites();


/* "toggle" es un término que se usa mucho en programación cuando hay que describir
operaciones que cambian el estado entre dos opciones o valores opuestos. Ejemplos:
- encendido/apagado
- logueado/deslogueado
- modo oscuro/modo claro
- favorito/no favorito
"toggle" en inglés significa "alternar" o "conmutar"
*/ 

// para añadir o quitar favoritos del LocalStorage 
const toggleFavorite = (name) => {             // similar al ejercicio de bromas de Chuck Norris                    
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (favorites.includes(name)) {
        favorites = favorites.filter(fav => fav !== name);
    } else {
        favorites.push(name);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    getFavorites();

};


// botón reset favoritos
document.getElementById('resetFavoritesBtn').addEventListener('click', () => {
    localStorage.removeItem('favorites');
    getFavorites();
});

// botón home
const homeBtn = document.getElementById("home");
homeBtn.addEventListener("click", () =>{
    window.location.href='./index.html';
})