const db = require("../config/sqlite");
const { generateWorkoutAI } = require("../utils/gemini");

exports.generateWorkout = async (req, res) => {
  try {
    const userId = req.user.id;

    // Buscando o perfil do usuário
    db.get(`SELECT * FROM profiles WHERE user_id = ?`, [userId], async (err, profile) => {
      if (err) {
        console.error("❌ Erro no banco ao buscar perfil:", err);
        return res.status(500).json({ error: "Erro interno no banco de dados" });
      }
      
      if (!profile || !profile.weight) {
        return res.status(400).json({ error: "Perfil incompleto. Salve peso e altura primeiro!" });
      }

      console.log("🤖 Solicitando treino para a IA para o usuário:", userId);
      console.log("📊 Dados enviados:", { goal: profile.goal, weight: profile.weight });

      try {
        const workoutPlan = await generateWorkoutAI(profile);
        
        if (!workoutPlan) {
          throw new Error("A IA retornou um plano vazio");
        }

        console.log("✅ IA respondeu com sucesso!");
        return res.json(workoutPlan);

      } catch (aiError) {
        // Log detalhado para você ver na Render o que aconteceu de verdade
        console.error("❌ ERRO CRÍTICO NA IA:", aiError.message);
        
        return res.status(500).json({ 
          error: "Falha ao gerar treino", 
          details: aiError.message 
        });
      }
    });
  } catch (error) {
    console.error("❌ Erro no Try/Catch do Controller:", error);
    res.status(500).json({ error: error.message });
  }
};