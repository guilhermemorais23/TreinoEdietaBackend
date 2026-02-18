const { Mistral } = require('@mistralai/mistralai');

const client = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });

// 1. Função para analisar a foto do prato
async function analyzeFoodImage(imageBuffer, mimeType) {
  try {
    const base64Image = imageBuffer.toString("base64");

    const chatResponse = await client.chat.complete({
      model: "pixtral-12b-2409",
      messages: [
        {
          role: "user",
          content: [
            { 
              type: "text", 
              text: "Aja como um nutricionista brasileiro. Analise a imagem e identifique os alimentos. Retorne APENAS um JSON: {\"title\": \"string\", \"foods\": \"string\", \"calories\": number, \"protein\": number, \"carbs\": number, \"fat\": number}"
            },
            { 
              type: "image_url", 
              imageUrl: `data:${mimeType};base64,${base64Image}` 
            }
          ],
        },
      ],
      response_format: { type: "json_object" } 
    });

    let responseText = chatResponse.choices[0].message.content;
    return JSON.parse(responseText.replace(/```json/g, "").replace(/```/g, "").trim());

  } catch (error) {
    console.error("ERRO NA IA (Imagem):", error);
    throw new Error("Erro ao analisar imagem");
  }
}

// 2. Função para gerar plano de saúde (Metas de Calorias)
async function generateHealthPlan(userData) {
  try {
    const chatResponse = await client.chat.complete({
      model: "mistral-large-latest",
      messages: [
        {
          role: "user",
          content: `Aja como um especialista em fitness brasileiro. Com base nestes dados:
            Peso: ${userData.weight}kg, Altura: ${userData.height}cm, Objetivo: ${userData.goal}.
            Retorne APENAS um JSON em português com:
            {
              "calories_target": number,
              "protein_target": number,
              "carbs_target": number,
              "fat_target": number,
              "plan_text": "um resumo curto das metas"
            }`
        },
      ],
      response_format: { type: "json_object" }
    });

    let planText = chatResponse.choices[0].message.content;
    return JSON.parse(planText.replace(/```json/g, "").replace(/```/g, "").trim());
  } catch (error) {
    console.error("Erro ao gerar plano:", error);
    throw new Error("Erro ao gerar plano");
  }
}

// 3. Função para gerar a FICHA DE TREINO (COM VOLUME DE EXERCÍCIOS)
async function generateWorkoutAI(profile) {
  try {
    // Adicionamos 'activity_level' ou 'exercise_count' se vier do seu banco
    const activity = profile.activity_level || "moderado"; 

    const chatResponse = await client.chat.complete({
      model: "mistral-large-latest",
      messages: [
        {
          role: "user",
          content: `Aja como um personal trainer brasileiro de elite. 
            Gere um treino para um aluno com objetivo: ${profile.goal}, peso: ${profile.weight}kg e altura: ${profile.height}cm.
            Considere que o aluno tem um volume de treino: ${activity}.

            REGRAS OBRIGATÓRIAS:
            1. IDIOMA: Português do Brasil.
            2. DIVISÃO: 5 dias de treino (segunda, terca, quarta, quinta, sexta).
            3. MÉTODO: Intercale entre Membros Superiores e Membros Inferiores.
            4. ESTRUTURA: Em vez de aquecimento, coloque uma seção de 'mobilidade' articular opcional.
            
            Retorne APENAS um JSON com as chaves: segunda, terca, quarta, quinta, sexta.
            Dentro de cada chave, use este formato: 
            { "mobilidade": "texto curto", "treino": "lista de exercícios com séries/reps", "finalizacao": "texto curto" }`
        },
      ],
      response_format: { type: "json_object" }
    });

    let workoutText = chatResponse.choices[0].message.content;
    const cleanData = JSON.parse(workoutText.replace(/```json/g, "").replace(/```/g, "").trim());
    return cleanData;

  } catch (error) {
    console.error("Erro ao gerar treino na Mistral:", error);
    throw new Error("Falha ao gerar treino");
  }
}

// Exportação unificada
module.exports = { analyzeFoodImage, generateHealthPlan, generateWorkoutAI };