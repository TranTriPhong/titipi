import type { APIRoute } from 'astro';
import { GEMINI_API_KEY } from 'astro:env/server';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const { prompt } = await request.json();
    
    // 1. Basic Validation
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length < 5) {
      return new Response(JSON.stringify({ 
        error: { message: "Prompt quá ngắn hoặc không hợp lệ!" } 
      }), { status: 400 });
    }

    if (prompt.length > 5000) {
      return new Response(JSON.stringify({ 
        error: { message: "Prompt quá dài! (Tối đa 5000 ký tự)" } 
      }), { status: 400 });
    }

    const apiKey = GEMINI_API_KEY;

    // 2. Fetch with Timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
        signal: controller.signal
      }
    );

    clearTimeout(timeoutId);

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API Error:", data);
      return new Response(JSON.stringify({
        error: { message: data.error?.message || "Gemini API returned an error" }
      }), { status: response.status });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (e: any) {
    if (e.name === 'AbortError') {
      return new Response(JSON.stringify({ 
        error: { message: "Yêu cầu quá thời gian xử lý. Vui lòng thử lại!" } 
      }), { status: 504 });
    }
    console.error("Chat API Error:", e);
    return new Response(JSON.stringify({ 
      error: { message: "Lỗi hệ thống! Vui lòng thử lại sau." } 
    }), { status: 500 });
  }
};
