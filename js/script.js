const searchInput = document.getElementById("searchInput"),
     searchBtn = document.getElementById("searchBtn"),
     prevBtn = document.getElementById("prevBtn"),
     nextBtn = document.getElementById("nextBtn"),
     resetBtn = document.getElementById("resetBtn"),
     app = document.getElementById("app");


let page = 0; // primera página

// función con el fetch para obtener info de la API pokemon 
const getPokemon = async () => {
    try{
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/?offset=${page}&limit=10`);
      const data = await response.json();

      app.innerHTML= "";
      for (const pokemon of data.results) {
        const pokemonData = await fetch (pokemon.url).then(data=>data.json());
        const isFavorite = checkFavorite(pokemonData.name);
        const template = `
        <div class="card">
        <img src="${pokemonData.sprites.front_default}" alt="${pokemonData.name}"/>
        <p>${pokemonData.name}</p>
        <span class = "favorite-btn" data-name="${pokemonData.name}">${isFavorite ? '★' : '☆'}</span>
        </div>` 
        app.innerHTML += template
        }
        addFavoriteListeners() 

      } catch (error){
        console.error('Error en el fetch:', error); 
      }
      
    }

getPokemon(); // importante: si no la llamamos no hace la carga inicial de datos al cargar la página.


// función para comprobar si el pokemon está en favoritos en LocalStorage y pintar la estrellita
const checkFavorite = (name) => {
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  return favorites.includes(name);
};

// función para añadir y quitar pokemons favoritos del LocalStorage
const getFavorite = (name) => {
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  if (favorites.includes(name)){
    favorites = favorites.filter(fav=>fav !==name);
  } else {
    favorites.push(name);
  }
  localStorage.setItem('favorites', JSON.stringify(favorites));
}

// función para enlazar el darle al span con la función getFavorite
const addFavoriteListeners = () => {
  const favoriteButtons = document.querySelectorAll('.favorite-btn');
  favoriteButtons.forEach(button=>{
    button.addEventListener('click', () => {
      const name = button.getAttribute('data-name'); // manera fácil de sacarle el nombre getAttribute
      getFavorite(name);
      button.textContent = checkFavorite(name) ? '★' : '☆';
    });
  });
};

// paginación (el +-10 es porque en la documentación vemos que en cada página el offset en la url (variable page) suma 10)
  nextBtn.addEventListener("click", ()=> {
    app.innerHTML = ""
    page += 10
    getPokemon()
  })

  prevBtn.addEventListener("click", ()=> {
    app.innerHTML = ""
    if (page < 10){
        page = 10
    }
    page -= 10
    getPokemon()

  })

// evento para el input search, con otro fetch a los datos (pendiente: englobar en una función el fetch para no tener que repetirlo)
  searchBtn.addEventListener("click", async () => {
    const nombre = searchInput.value.toLowerCase();
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombre}`);
        if (!response.ok) {
            app.innerHTML = `<p class="error-message">Pokemon no encontrado</p>`;
            return;
        }
        const data = await response.json();
        app.innerHTML = "";
        const isFavorite = checkFavorite(data.name);
        const template = `
            <div class="card">
                <img src="${data.sprites.front_default}" alt="${data.name}"/>
                <p>${data.name}</p>
                <span class="favorite-btn" data-name="${data.name}">${isFavorite ? '★' : '☆'}</span>
            </div>`;
        app.innerHTML += template;
        addFavoriteListeners();
    } catch (error) {
        console.error('Error fetching Pokémon data:', error);
    }
});


// botón reset (limpia el input, el contenedor y resetea la variable page a 0 para mostrar la página 1 )
resetBtn.addEventListener('click', ()=> {
  searchInput.value="";
  app.innerHTML = "";
  page=0;
  getPokemon();

})