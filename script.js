/* =========================
   Scroll Frame Animation
========================= */

const frameCount = 240;
const canvas = document.getElementById("hero-canvas");
const context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const currentFrame = index => 
  `frames/ezgif-frame-${String(index).padStart(3, '0')}.jpg`;

const images = [];
let img = new Image();

for (let i = 1; i <= frameCount; i++) {
  const image = new Image();
  image.src = currentFrame(i);
  images.push(image);
}

function render() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(img, 0, 0, canvas.width, canvas.height);
}

window.addEventListener("scroll", () => {
  const scrollTop = document.documentElement.scrollTop;
  const maxScrollTop = document.documentElement.scrollHeight - window.innerHeight;
  const scrollFraction = scrollTop / maxScrollTop;
  const frameIndex = Math.min(
    frameCount - 1,
    Math.ceil(scrollFraction * frameCount)
  );

  img = images[frameIndex];
  render();
});

images[0].onload = render;


/* =========================
   Gemini Chat Integration
========================= */

const API_KEY = "YOUR_GEMINI_API_KEY";

const SYSTEM_PROMPT = `
You are a resume assistant chatbot.
STRICT RULES:
1. Answer ONLY using the resume details provided below.
2. Do NOT generate extra information.
3. If the answer is not in the resume, reply: "Information not available in resume."

Resume Content:
Name: Akash M
Location: Mudivaithanendal, Tamil Nadu
Phone: 9952172708
Email: akash2006m123@gmail.com
Education: B.E Electronics and Communication Engineering (Expected 2027), Government College of Engineering, Tirunelveli
Skills: Python, C, C++, Java, Logical reasoning, Project planning
Project: Smart Agriculture – protects field from heavy rain and maintains water level
Certifications: C, C++, Java, Python, Typewriting Higher Level, Hindi Pandit
`;

async function sendMessage() {

    const input = document.getElementById("user-input");
    const chatBody = document.getElementById("chat-body");

    if (!input.value.trim()) return;

    const userMessage = input.value;
    chatBody.innerHTML += `<p><strong>You:</strong> ${userMessage}</p>`;

    input.value = "";

    const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + API_KEY,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [
                    { role: "user", parts: [{ text: SYSTEM_PROMPT + "\nUser Question: " + userMessage }] }
                ]
            })
        }
    );

    const data = await response.json();
    const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Error";

    chatBody.innerHTML += `<p><strong>Bot:</strong> ${botReply}</p>`;
    chatBody.scrollTop = chatBody.scrollHeight;
}
