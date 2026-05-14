import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SYSTEM_PROMPT = `You are PokéPilot AI, an expert Pokémon assistant embedded in the PokéPilot living dex tracker app.

You have deep knowledge of all mainline Pokémon games (Let's Go Pikachu/Eevee, Sword/Shield, Brilliant Diamond/Shining Pearl, Legends: Arceus, Scarlet/Violet, Legends: Z-A).

When the user provides their app context (dex progress, caught Pokémon, active hunts, game data), use it to give personalised answers. If no context is provided, answer generally.

Keep answers concise and friendly. Use bullet points for lists. When discussing shiny hunting, be specific about odds and methods for the relevant game.`;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("OPENAI_API_KEY");
    const model = Deno.env.get("AI_MODEL") || "gpt-4o-mini";

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "AI is not configured. Please add OPENAI_API_KEY to Supabase secrets." }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { messages, appContext } = await req.json();

    if (!Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "messages must be an array" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemContent = appContext
      ? `${SYSTEM_PROMPT}\n\n--- USER'S APP DATA ---\n${JSON.stringify(appContext, null, 2)}\n--- END APP DATA ---`
      : SYSTEM_PROMPT;

    const openaiMessages = [
      { role: "system", content: systemContent },
      ...messages.slice(-20),
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: openaiMessages,
        max_tokens: 1024,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("OpenAI error:", err);
      let friendlyError = "AI request failed. Please try again.";
      try {
        const parsed = JSON.parse(err);
        if (parsed?.error?.message) friendlyError = parsed.error.message;
      } catch { /* ignore */ }
      return new Response(
        JSON.stringify({ error: friendlyError }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content ?? "";

    return new Response(
      JSON.stringify({ reply }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("pokemon-ai error:", err);
    return new Response(
      JSON.stringify({ error: "Something went wrong. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
