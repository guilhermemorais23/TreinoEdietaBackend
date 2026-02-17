const db = require("../config/sqlite");

exports.updateProfile = (req, res) => {
  const userId = req.user.id;
  const { weight, height, goal, activity_level } = req.body;

  // Garante que peso e altura sejam números
  const w = parseFloat(weight);
  const h = parseFloat(height);

  if (!w || !h) {
    return res.status(400).json({ error: "Peso e altura são obrigatórios!" });
  }

  const query = `
    INSERT INTO profiles (user_id, weight, height, goal, activity_level)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(user_id) DO UPDATE SET
    weight=excluded.weight,
    height=excluded.height,
    goal=excluded.goal,
    activity_level=excluded.activity_level
  `;

  db.run(query, [userId, w, h, goal, activity_level || 'Moderado'], function(err) {
    if (err) {
      console.error("Erro no SQLite:", err.message);
      return res.status(500).json({ error: "Erro ao salvar no banco" });
    }
    console.log(`✅ Perfil do usuário ${userId} atualizado com sucesso!`);
    res.json({ message: "Perfil configurado! Agora você pode gerar treinos." });
  });
};

exports.getProfile = (req, res) => {
  const userId = req.user.id;
  db.get(`SELECT * FROM profiles WHERE user_id = ?`, [userId], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row || {});
  });
};