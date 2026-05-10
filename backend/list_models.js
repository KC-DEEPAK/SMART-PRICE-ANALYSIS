async function listModels() {
  const GEMINI_API_KEY = "AIzaSyCjJwjTM5tQOJgIjd3QfWaGXHDa0qBpTpA";
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`;
  try {
    const res = await fetch(url);
    const json = await res.json();
    console.log(json.models.map(m => m.name));
  } catch (e) {
    console.error("Error:", e);
  }
}
listModels();
