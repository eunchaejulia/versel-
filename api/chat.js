export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;

  try {
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }],
      }),
    });

    const data = await openaiRes.json();
    console.log("🔍 GPT 응답 결과 (stringified):", JSON.stringify(data));

    return res.status(200).json({ reply: data.choices?.[0]?.message?.content || "응답 오류남" });
  } catch (err) {
    console.error("❌ OpenAI 호출 에러:", err);
    return res.status(500).json({ error: "서버 에러" });
  }
}
