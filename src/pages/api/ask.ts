export const prerender = false;

export async function POST({ request }) {
  try {
    const data = await request.json();
    const question = data.question;
    const context = data.context;
    
    // Lấy chìa khóa từ file .env (hoặc từ biến môi trường của Vercel)
    const apiKey = import.meta.env.GEMINI_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Chưa có API Key sếp ơi!" }), { status: 500 });
    }

    // Kịch bản RAG: Định hướng AI trả lời chuẩn xác theo dữ liệu của web mày
    const prompt = `Bạn là trợ lý AI trên nền tảng chia sẻ dự án và kiến thức công nghệ titipi. 
    Hãy trả lời câu hỏi của người dùng thật ngắn gọn, chính xác, giữ phong cách "Clean Tech" chuyên nghiệp.
    CHỈ DỰA VÀO ĐOẠN KIẾN THỨC SAU ĐÂY ĐỂ TRẢ LỜI:
    ---
    ${context}
    ---
    Câu hỏi của người dùng: ${question}`;

    // Gọi API thẳng đến Google (dùng model siêu tốc Gemini 1.5 Flash)
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const result = await response.json();
    
    // Nếu API trả về lỗi (ví dụ hết hạn ngạch, sai key...)
    if (result.error) throw new Error(result.error.message);

    const answer = result.candidates[0].content.parts[0].text;

    return new Response(JSON.stringify({ answer }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Đường truyền AI bị nghẽn rồi, thử lại sau nhé!" }), { status: 500 });
  }
}