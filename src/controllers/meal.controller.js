const db = require("../config/sqlite");
const { analyzeFoodImage } = require("../utils/gemini");

// ANALISAR IMAGEM
exports.analyzeImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Envie uma foto!" });
    const analysis = await analyzeFoodImage(req.file.buffer, req.file.mimetype);
    const userId = req.user.id;

    db.run(
      `INSERT INTO meals (user_id, title, foods, calories, protein, carbs, fat, date) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
      [userId, analysis.title, JSON.stringify(analysis.foods), analysis.calories, analysis.protein, analysis.carbs, analysis.fat],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, ...analysis });
      }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// CRIAR MANUAL
exports.createMeal = (req, res) => {
  const { title, calories, protein, carbs, fat } = req.body;
  const userId = req.user.id;
  const kcal = calories || (Number(protein || 0) * 4) + (Number(carbs || 0) * 4) + (Number(fat || 0) * 9);

  db.run(
    `INSERT INTO meals (user_id, title, foods, calories, protein, carbs, fat, date) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
    [userId, title, title, kcal, protein || 0, carbs || 0, fat || 0],
    function (err) {
      if (err) return res.status(500).json(err);
      res.json({ id: this.lastID, title, calories: kcal });
    }
  );
};

// LISTAR
exports.getMeals = (req, res) => {
  const userId = req.user.id;
  db.all(`SELECT * FROM meals WHERE user_id = ? ORDER BY date DESC`, [userId], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
};

// DELETAR
exports.deleteMeal = (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  db.run(`DELETE FROM meals WHERE id = ? AND user_id = ?`, [id, userId], function (err) {
    if (err) return res.status(500).json(err);
    res.json({ message: "Removido" });
  });
};

// ESTATÍSTICAS SEMANAIS
exports.getWeeklyStats = (req, res) => {
  const userId = req.user.id;
  const query = `
    SELECT 
      CASE strftime('%w', date)
        WHEN '0' THEN 'Sunday' WHEN '1' THEN 'Monday' WHEN '2' THEN 'Tuesday'
        WHEN '3' THEN 'Wednesday' WHEN '4' THEN 'Thursday' WHEN '5' THEN 'Friday'
        WHEN '6' THEN 'Saturday'
      END as day,
      SUM(calories) as total_calories, SUM(protein) as total_protein, SUM(carbs) as total_carbs
    FROM meals WHERE user_id = ? AND date >= date('now', 'weekday 0', '-7 days')
    GROUP BY day`;

  db.all(query, [userId], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows || []);
  });
};