import Groq from "groq-sdk";

const apiKey = import.meta.env.VITE_API_KEY;
const groq = new Groq({ apiKey: apiKey, dangerouslyAllowBrowser: true });

export async function generateIntrusiveThoughts() {
  try {
    const prompt = "List 5 anxiety thoughts, each under 6 words not too violent. Do NOT include introductory text.";

    const response = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama3-8b-8192",
    });

    let thoughts = response?.choices?.[0]?.message?.content.split("\n") || [];

    thoughts = thoughts.filter(
      (line) => !line.toLowerCase().includes("anxiety thoughts") && line.trim() !== ""
    );

    return thoughts.slice(0, 5);
  } catch (error) {
    console.error("Error fetching anxiety thoughts:", error);
    return [
      "Am I a failure?",
      "They're laughing at me.",
      "I can't do this.",
      "What if I fail?",
      "Nobody likes me.",
    ]; // Fallback
  }
}


export async function getPositiveResponse(thought) {
  try {
    const prompt = `Give a 7-8 word calming response for: "${thought}"`;

    const response = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama3-8b-8192",
    });

    return response?.choices?.[0]?.message?.content.trim() || "You are doing your best.";
  } catch (error) {
    console.error("Error fetching positive response:", error);
    return "You are doing your best."; // Fallback
  }
}
