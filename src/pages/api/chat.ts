import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const { prompt } = await request.json();
    // In hybrid mode, we use process.env or import.meta.env on the server
    const apiKey = process.env.PUBLIC_GEMINI_API_KEY || import.meta.env.PUBLIC_GEMINI_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ 
        error: { message: "Server API Key missing. Please set PUBLIC_GEMINI_API_KEY in environment variables." } 
      }), { status: 500 });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { "Content-Type": "application/json" }
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ 
      error: { message: e.message || "Internal Server Error" } 
    }), { status: 500 });
  }
};
