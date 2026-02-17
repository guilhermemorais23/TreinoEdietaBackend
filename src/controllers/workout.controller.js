const db = require("../config/sqlite");
const { generateWorkoutAI } = require("../utils/gemini");

exports.generateWorkout = async (req, res) => {
  try {
    const userId = req.user.id;

    db.get(`SELECT * FROM profiles WHERE user_id = ?`, [userId], async (err, profile) => {
      if (err) return res.status(500).json({ error: "Erro no banco" });
      
      if (!profile || !profile.weight) {
        return res.status(400).json({ error: "Perfil incompleto. Salve peso e altura primeiro!" });
      }

      console.log("🤖 Solicitando treino para a IA...");
      try {
        const workoutPlan = await generateWorkoutAI(profile);
        console.log("✅ IA respondeu com sucesso!");
        res.json(workoutPlan);
      } catch (aiError) {
        console.error("❌ Falha na IA:", aiError);
        res.status(500).json({ error: "A IA falhou. Verifique sua conexão ou chave API." });
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};