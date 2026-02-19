
import { GoogleGenAI } from "@google/genai";

export const getAITip = async (userPrompt: string, chatHistory: {role: string, text: string}[] = []) => {
  if (!process.env.API_KEY) {
    console.error("API_KEY manquante");
    return "Désolé, je rencontre une petite difficulté technique. Contactez Basile directement via WhatsApp !";
  }
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Construction du contexte complet de Basile
  const basileContext = `
    TON IDENTITÉ : 
    Tu es l'Expert-IA, l'assistant personnel de BASILE KADJOLO, entrepreneur digital de référence à Lomé, Togo.
    
    COMPÉTENCES DE BASILE :
    1. Graphisme : Expert Canva et Suite Adobe. Création de logos, identités visuelles, flyers pro.
    2. Vidéo : Maître du montage dynamique sur CapCut et Premiere Pro. Spécialiste TikTok, Reels Instagram et publicités YouTube.
    3. Marketing : Expert en Facebook Ads, Google Ads et stratégies de visibilité organique.
    4. Formation : Basile est aussi un coach qui forme les jeunes et les entrepreneurs aux outils digitaux.
    
    TON OBJECTIF :
    - Conseiller les visiteurs sur leurs problématiques digitales.
    - Valoriser l'expertise de Basile.
    - Si l'utilisateur a un projet concret (ex: "je veux un logo"), dis-lui que Basile est la personne idéale et suggère-lui de cliquer sur le bouton WhatsApp.
    
    TON TON :
    Professionnel, chaleureux, expert et très réactif. Utilise un français impeccable, parfois avec une touche de dynamisme propre à l'entrepreneuriat togolais.
  `;

  try {
    // Conversion de l'historique pour le format Gemini
    const contents = chatHistory.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.text }]
    }));

    // Ajout du dernier message
    contents.push({
      role: 'user',
      parts: [{ text: userPrompt }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: contents as any,
      config: {
        systemInstruction: basileContext,
        temperature: 0.8,
        topP: 0.95,
      },
    });

    return response.text || "Je n'ai pas pu formuler de réponse. Essayez de reformuler ou contactez Basile !";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Je suis un peu surchargé par les demandes. Cliquez sur le bouton WhatsApp pour parler directement à Basile !";
  }
};
