const input = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");
const micBtn = document.getElementById("mic-btn");

async function sendMessage() {
  const userMessage = input.value.trim();
  if (!userMessage) return;

  // Add user message
  addMessage("user", userMessage);
  input.value = "";

  // Show bot placeholder
  const msgElem = addMessage("bot", "Azmuth is thinking...");

  try {
    const response = await fetch("/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: userMessage })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    msgElem.innerText = data.reply || "Azmuth had no reply.";
    chatBox.scrollTop = chatBox.scrollHeight;

  } catch (error) {
    console.error("Chat fetch error:", error);
    msgElem.innerText = "Azmuth is unavailable right now 😞";
  }
}

function addMessage(sender, text = "", isTyping = false) {
  const msg = document.createElement("div");
  msg.className = `message ${sender}` + (isTyping ? " typing" : "");
  msg.innerText = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
  return msg;
}

// Voice recognition
if ('webkitSpeechRecognition' in window && micBtn) {
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

// Enter key triggers message
input.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    sendMessage();
  }
});

// Focus input on load
window.onload = () => input.focus();
