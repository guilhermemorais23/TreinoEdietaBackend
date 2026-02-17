const db = require("./sqlite");

const initDb = () => {
  console.log("🛠️  Iniciando criação de tabelas...");

  // Criar Tabela de Usuários
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT
  )`);

  // Criar Tabela de Refeições
  db.run(`CREATE TABLE IF NOT EXISTS meals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    title TEXT,
    foods TEXT,
    calories REAL,
    protein REAL,
    carbs REAL,
    fat REAL,
    date TEXT,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`);

  // Criar Tabela de Perfis
  db.run(`CREATE TABLE IF NOT EXISTS profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER UNIQUE,
    weight REAL,
    height REAL,
    goal TEXT,
    activity_level TEXT,
    calories_target INTEGER,
    protein_target INTEGER,
    carbs_target INTEGER,
    fat_target INTEGER,
    workout_plan TEXT,
    advice TEXT,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`, (err) => {
    if (err) {
      console.error("❌ Erro ao criar tabelas:", err.message);
    } else {
      console.log("✅ Banco de dados conferido e tabelas prontas!");
    }
  });
};

module.exports = initDb;