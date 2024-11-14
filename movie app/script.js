const apiKey = '149071b29d4c4a2fea08cad252d36787';
const searchUrl = 'https://api.themoviedb.org/3/search/movie?query=';
const popularUrl = 'https://api.themoviedb.org/3/movie/popular';
const movieName = document.querySelector(".main__wrapper-search input");
const searchBtn = document.querySelector(".main__wrapper-search button");
const cardsContainer = document.querySelector(".main__wrapper-cards");

const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxNDkwNzFiMjlkNGM0YTJmZWEwOGNhZDI1MmQzNjc4NyIsIm5iZiI6MTczMTU4MDg1NC42MzY5MTMzLCJzdWIiOiI2NzMwNjdkNDZiZTMyZTMwNTVkM2FmNjQiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.F_MbNCJV1plZc98w7wFvtWmYzt6p4CD2L42Gv3lYyko'
    }
};

async function getPopularMovies() {
    const response = await fetch(popularUrl + '?api_key=' + apiKey, options);
    const data = await response.json();
    displayMovies(data.results);
}

async function searchMovie(movie) {
    const response = await fetch(searchUrl + movie, options);
    const data = await response.json();
    displayMovies(data.results);
}
function displayMovies(movies) {
    cardsContainer.innerHTML = "";

    if (movies.length === 0) {
        cardsContainer.innerHTML = "<p>No results found.</p>";
        return;
    }

    movies.forEach(movie => {
        const card = document.createElement("div");
        card.classList.add("card");

        const cardImg = document.createElement("div");
        cardImg.classList.add("card__img");

        const img = document.createElement("img");
        img.src = movie.poster_path 
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : "img/default-poster.jpg";
        img.alt = movie.title;

        img.addEventListener("click", () => openModal(movie));

        cardImg.appendChild(img);
        card.appendChild(cardImg);
        cardsContainer.appendChild(card);
    });
}

function openModal(movie) {
    const modal = document.createElement("div");
    modal.classList.add("modal");
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-btn">&times;</span>
            <h2>${movie.title}</h2>
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path || "img/default-poster.jpg"}" alt="${movie.title}">
            <p>${movie.overview || "No description available."}</p>
            <p><strong>Release Date:</strong> ${movie.release_date || "N/A"}</p>
            <p><strong>Rating:</strong> ${movie.vote_average || "N/A"}</p>
        </div>
    `;
    
    document.body.appendChild(modal);

    modal.querySelector(".close-btn").addEventListener("click", () => {
        modal.remove();
    });
    
    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}
searchBtn.addEventListener("click", () => {
    if (movieName.value.trim() !== "") {
        searchMovie(movieName.value);
    }
});

window.addEventListener('load', getPopularMovies);
