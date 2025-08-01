console.log("✅ script.js loaded");

const input = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");
const micBtn = document.getElementById("mic-btn");

let currentAudio = null;
let isSpeaking = false;

// 🔓 Unlock audio context
document.body.addEventListener(
  "click",
  () => {
    const unlock = new Audio();
    unlock.play().catch(() => {});
    console.log("🔓 Audio context unlocked");
  },
  { once: true }
);

// 📨 Send user message and handle response
async function sendMessage() {
  const userMessage = input.value.trim();
  if (!userMessage) return;

  addMessage("user", userMessage);
  input.value = "";

  const msgElem = addMessage("bot", "Strange is thinking...");

  try {
    const response = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage }),
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    console.log("✅ Gemini API response:", data);

    msgElem.innerText = data.reply || "Strange had no reply.";
    chatBox.scrollTop = chatBox.scrollHeight;

    if (data.audio_url) {
      console.log("🎧 Audio URL received:", data.audio_url);

      // Stop previous audio if still playing
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        isSpeaking = false;
        currentAudio = null;
      }

      currentAudio = new Audio(`${data.audio_url}?t=${Date.now()}`);

   currentAudio.addEventListener("canplaythrough", () => {
  console.log("✅ Audio ready to play (awaiting user interaction)");
});


      currentAudio.onended = () => {
        isSpeaking = false;
        console.log("🔚 Voice playback ended");
      };

      // Enable Speak button
      document.getElementById("speak-btn").disabled = false;
    }
  } catch (error) {
    console.error("❌ Chat fetch error:", error);
    msgElem.innerText = "Strange is unavailable right now 😞";
  }
}

// 💬 Append message to chat UI
function addMessage(sender, text = "", isTyping = false) {
  const msg = document.createElement("div");
  msg.className = `message ${sender}` + (isTyping ? " typing" : "");
  msg.innerText = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
  return msg;
}

// 🎙️ Microphone voice recognition
if ("webkitSpeechRecognition" in window && micBtn) {
  const recognition = new webkitSpeechRecognition();
  recognition.continuous = false;
  recognition.lang = "en-US";

  micBtn.addEventListener("click", () => {
    micBtn.style.backgroundColor = "#00ffcc";
    recognition.start();
  });

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    input.value = transcript;
    sendMessage();
  };

  recognition.onend = () => {
    micBtn.style.backgroundColor = "";
  };
}

// ⌨️ Enter key triggers send
input.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    sendMessage();
  }
});

// 🚀 Focus input on load
window.onload = () => input.focus();

// 🗣️ Speak/Stop button
document.addEventListener("DOMContentLoaded", () => {
  const speakBtn = document.createElement("button");
  speakBtn.innerText = "🗣️ Speak/Stop";
  speakBtn.id = "speak-btn";
  speakBtn.disabled = true;
  speakBtn.style.marginLeft = "10px";

  speakBtn.addEventListener("click", () => {
    if (currentAudio) {
      if (!isSpeaking) {
        currentAudio.play()
          .then(() => {
            isSpeaking = true;
            console.log("🎵 Playing Azmuth's voice");
          })
          .catch((err) => console.error("❌ Audio play error:", err));
      } else {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        isSpeaking = false;
        console.log("⏹️ Stopped voice");
      }
    }
  });

  document.querySelector(".input-container").appendChild(speakBtn);
});
