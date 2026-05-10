

async function testGemini() {
  const GEMINI_API_KEY = "AIzaSyCjJwjTM5tQOJgIjd3QfWaGXHDa0qBpTpA";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;
  
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          { role: "user", parts: [{ text: "Hello" }] }
        ]
      })
    });
    
    const text = await res.text();
    console.log("Status:", res.status);
    console.log("Response:", text);
  } catch (e) {
    console.error("Error:", e);
  }
}

testGemini();
