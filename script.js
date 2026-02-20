/* =============================
   Scroll Frame Animation
============================= */

const canvas = document.getElementById("scrollCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const frameCount = 240;

const currentFrame = index =>
  `frames/ezgif-frame-${String(index).padStart(3, '0')}.jpg`;

const images = [];
let img = new Image();

for (let i = 1; i <= frameCount; i++) {
  const image = new Image();
  image.src = currentFrame(i);
  images.push(image);
}

images[0].onload = () => {
  ctx.drawImage(images[0], 0, 0, canvas.width, canvas.height);
};

window.addEventListener("scroll", () => {
  const scrollTop = document.documentElement.scrollTop;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const scrollFraction = scrollTop / maxScroll;

  const frameIndex = Math.min(
    frameCount - 1,
    Math.ceil(scrollFraction * frameCount)
  );

  img = images[frameIndex];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
});

/* =============================
   Gemini Chatbot (STRICT)
============================= */

const API_KEY = "YOUR_GEMINI_API_KEY";

const SYSTEM_PROMPT = `
You are a resume assistant chatbot.

STRICT RULES:
1. You MUST answer ONLY using the resume information provided below.
2. DO NOT add assumptions, explanations, or external knowledge.
3. If the question is outside the resume, reply exactly:
   "Information not available in the resume."

RESUME CONTENT:
Name: Fathima Taj
Role: Data Analyst
Email: faatimataj7@gmail.com
Phone: 7871179650
Education: B.E Electronics and Communication Engineering,
Government College of Engineering, Tirunelveli
CGPA: 8.1
Skills: Data Analysis & Interpretation, Python (Basics),
SQL (Basics), MS Excel, Problem Solving & Analytical Thinking
`;

async function sendMessage() {
  const input = document.getElementById("userInput");
  const chatBody = document.getElementById("chatBody");

  if (!input.value.trim()) return;

  const userText = input.value;
  chatBody.innerHTML += `<p><b>You:</b> ${userText}</p>`;
  input.value = "";

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          role: "user",
          parts: [{ text: SYSTEM_PROMPT + "\nQuestion: " + userText }]
        }]
      })
    }
  );

  const data = await response.json();
  const reply =
    data.candidates?.[0]?.content?.parts?.[0]?.text ||
    "Information not available in the resume.";

  chatBody.innerHTML += `<p><b>Bot:</b> ${reply}</p>`;
  chatBody.scrollTop = chatBody.scrollHeight;
}
