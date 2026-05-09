import type { APIRoute } from 'astro';
import { GEMINI_API_KEY } from 'astro:env/server';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const { prompt } = await request.json();
    
    // 1. Basic Validation
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length < 5) {
      return Response.json({ 
        error: { message: "Prompt quá ngắn hoặc không hợp lệ!" } 
      }, { status: 400 });
    }

    if (prompt.length > 5000) {
      return Response.json({ 
        error: { message: "Prompt quá dài! (Tối đa 5000 ký tự)" } 
      }, { status: 400 });
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
      console.error("Gemini API Error Status:", response.status);
      console.error("Gemini API Error Body:", data);
      return Response.json({
        error: { message: data.error?.message || `Gemini API returned an error (${response.status})` }
      }, { status: response.status });
    }

    return Response.json(data);
  } catch (e: any) {
    if (e.name === 'AbortError') {
      return Response.json({ 
        error: { message: "Yêu cầu quá thời gian xử lý. Vui lòng thử lại!" } 
      }, { status: 504 });
    }
    console.error("Chat API System Error:", e);
    return Response.json({ 
      error: { message: "Lỗi hệ thống! Vui lòng thử lại sau." } 
    }, { status: 500 });
  }
};
