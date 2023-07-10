const express = require("express");
const app = express();
const port = 4000;
const recipes = require("./recipes");

app.use((req, res, next) => {
  res.on("finish", () => {
    // the 'finish' event will be emitted when the response is handed over to the OS
    console.log(`Request: ${req.method} ${req.originalUrl} ${res.statusCode}`);
  });
  next();
});
app.use(express.json());

function getNextIdFromCollection(collection) {
  if (collection.length === 0) return 1;
  const lastRecord = collection[collection.length - 1];
  return lastRecord.id + 1;
}

app.get("/", (req, res) => {
  res.send("Welcome to the Recipe Finder App!");
});

// Get all the recipes
app.get("/recipes", (req, res) => {
  res.send(recipes);
});

// Get a specific recipe
app.get("/recipes/:id", (req, res) => {
  const recipeId = parseInt(req.params.id, 10);
  const recipe = recipes.find((j) => j.id === recipeId);
  if (recipe) {
    res.send(recipe);
  } else {
    res.status(404).send({ message: "Recipe not found" });
  }
});

// Create a new recipe
app.post("/recipes", (req, res) => {
  const newRecipe = {
    ...req.body,
    id: getNextIdFromCollection(recipes),
  };
  recipes.push(newRecipe);
  console.log("newRecipe", newRecipe);
  res.status(201).send(newRecipe);
});

// Update a specific recipe
app.patch("/recipes/:id", (req, res) => {
  const recipeId = parseInt(req.params.id, 10);
  const recipeUpdates = req.body;
  const recipeIndex = recipes.findIndex((recipe) => recipe.id === recipeId);
  if (recipeIndex !== -1) {
    const originalRecipe = recipes[recipeIndex];
    const updatedRecipe = {
      ...originalRecipe,
      ...recipeUpdates,
    };
    recipes[recipeIndex] = updatedRecipe;
    res.send(updatedRecipe);
  } else {
    res.status(404).send({ message: "Recipe not found" });
  }
});

// Delete a specific recipe
app.delete("/recipes/:id", (req, res) => {
  const recipeId = parseInt(req.params.id, 10);
  const recipeIndex = recipes.findIndex((recipe) => recipe.id === recipeId);
  if (recipeIndex !== -1) {
    recipes.splice(recipeIndex, 1);
    res.send({ message: "Recipe deleted successfully" });
  } else {
    res.status(404).send({ message: "Recipe not found" });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
