const express = require("express");
const cors = require("cors");
require("dotenv").config();
const initDb = require("./config/initDb");

// 1. Importar as rotas
const authRoutes = require("./routes/auth.routes");
const mealRoutes = require("./routes/meal.routes");
const userRoutes = require("./routes/userRoutes");
const workoutRoutes = require("./routes/workout.routes");

const app = express();

// Configurações iniciais
app.use(cors());
app.use(express.json());

// Inicializar Banco de Dados
initDb();

// 2. DIAGNÓSTICO DE SEGURANÇA 
// (Se algum desses aparecer como 'undefined' no console, o erro está dentro do arquivo da rota)
console.log("-----------------------------------------");
console.log("🔍 Verificando carregamento das rotas:");
console.log("Auth Routes OK:", typeof authRoutes === 'function');
console.log("Meal Routes OK:", typeof mealRoutes === 'function');
console.log("User Routes OK:", typeof userRoutes === 'function');
console.log("Workout Routes OK:", typeof workoutRoutes === 'function');
console.log("-----------------------------------------");

// 3. REGISTRO DAS ROTAS
// Só registra se a rota for uma função válida para evitar o crash 'argument handler must be a function'
if (authRoutes) app.use("/auth", authRoutes);
if (mealRoutes) app.use("/meals", mealRoutes);
if (userRoutes) app.use("/users", userRoutes);
if (workoutRoutes) app.use("/workouts", workoutRoutes);

// Rota de teste para ver se o servidor está online
app.get("/health", (req, res) => res.json({ status: "online" }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando com sucesso na porta ${PORT}`);
  console.log(`🔗 Teste o servidor em: http://localhost:${PORT}/health`);
});