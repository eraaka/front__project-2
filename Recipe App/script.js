const apiKey = "61de7ece823943c7a89d7f4f89fc22ce";
const searchInput = document.getElementById("searchInput");
const recipeGrid = document.getElementById("recipeGrid");
const recipeModal = document.getElementById("recipeModal");
const recipeDetails = document.getElementById("recipeDetails");
const closeButton = document.querySelector(".close-button");
const favoritesGrid = document.getElementById("favoritesGrid");
searchInput.addEventListener("input", async () => {
    const query = searchInput.value.trim();
    if (query.length > 2) {
        const recipes = await searchRecipes(query);
        displayRecipes(recipes);
    }
});

async function searchRecipes(query) {
    try {
        const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?query=${query}&number=12&apiKey=${apiKey}`);
        
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }

        const data = await response.json();
        
        console.log("Полный ответ от API:", data);

        if (!Array.isArray(data.results)) {
            console.error("Ошибка: data.results не является массивом. Полный объект data:", data);
            return []; 
        }

        return data.results;
    } catch (error) {
        console.error("Ошибка при выполнении запроса к API:", error);
        return []; 
    }
}

function displayRecipes(recipes) {
    recipeGrid.innerHTML = "";

    recipes.forEach(recipe => {
        const recipeCard = document.createElement("div");
        recipeCard.classList.add("recipe-card");

        recipeCard.innerHTML = `
            <img src="https://spoonacular.com/recipeImages/${recipe.id}-312x231.jpg" alt="${recipe.title}">
            <h3>${recipe.title}</h3>
            <button onclick="showRecipeDetails(${recipe.id}, this.parentNode)">View Recipe</button>
            <button onclick="addToFavorites(${recipe.id})">Add to Favorites</button>
            <div class="recipe-details" style="display: none;"></div>
        `;

        recipeGrid.appendChild(recipeCard);
    });
}

async function showRecipeDetails(recipeId) {
    try {
        const response = await fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`);
        const recipe = await response.json();

        const calories = recipe.nutrition && recipe.nutrition.nutrients && recipe.nutrition.nutrients[0]
            ? recipe.nutrition.nutrients[0].amount
            : "Недоступно";

        recipeDetails.innerHTML = `
            <h2>${recipe.title}</h2>
            <img src="${recipe.image}" alt="${recipe.title}">
            <p>${recipe.summary}</p>
            <ul>
                ${recipe.extendedIngredients.map(ingredient => `<li>${ingredient.original}</li>`).join("")}
            </ul>
            <p><strong>Instructions:</strong> ${recipe.instructions || "Инструкции недоступны"}</p>
            <p><strong>Calories:</strong> ${calories}</p>
        `;

        recipeModal.style.display = "block";
    } catch (error) {
        console.error("Ошибка при загрузке деталей рецепта:", error);
        recipeDetails.innerHTML = `<p>Не удалось загрузить детали рецепта. Пожалуйста, попробуйте еще раз.</p>`;
        recipeModal.style.display = "block";
    }
}



function addToFavorites(recipeId){
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    if(!favorites.includes(recipeId)){
        favorites.push(recipeId);
        localStorage.setItem("favorites", JSON.stringify(favorites));
        displayFavorites();
    }
}

async function displayFavorites(){
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    favoritesGrid.innerHTML = "";
    for(let recipeId of favorites){
        const response = await fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`);
        const recipe = await response.json();
        const recipeCard = document.createElement("div");
        recipeCard.classList.add("recipe-card");
        recipeCard.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.title}">
            <h3>${recipe.title}</h3>
            <button onclick="showRecipeDetails(${recipe.id})">View Recipe</button>
        `;
        favoritesGrid.appendChild(recipeCard);
    }

}

closeButton.addEventListener("click", () => {
    recipeModal.style.display = "none";
});

window.onload = () => {
    localStorage.removeItem("favorites");
    displayFavorites();
};
