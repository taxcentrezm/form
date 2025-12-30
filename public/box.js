// Toggle chatbox visibility
function toggleChatbox() {
  const chatbox = document.getElementById("chatbox-modal");
  chatbox.style.display = chatbox.style.display === "flex" ? "none" : "flex";
  chatbox.style.flexDirection = "column";
}

// Load ZRA intents and initialize Fuse.js
let intentsData = null;
let intentsFuse = null;

// Load all training phrases for fuzzy matching
fetch("assets/zra_intents.json")
  .then(response => response.json())
  .then(data => {
    intentsData = data;

    // Create a flat array of all training phrases with their intent info
    const trainingPhrases = [];
    data.intents.forEach(intent => {
      intent.training_phrases.forEach(phrase => {
        trainingPhrases.push({
          phrase: phrase,
          intentId: intent.id,
          responses: intent.responses
        });
      });
    });

    // Initialize Fuse.js for fuzzy matching on training phrases
    intentsFuse = new Fuse(trainingPhrases, {
      keys: ['phrase'],
      threshold: 0.5,  // More lenient matching
      includeScore: true,
      distance: 100  // Allow more character distance
    });

    console.log("✅ ZRA Intents loaded:", data.bot_meta.name);
  })
  .catch(error => {
    console.error("❌ Failed to load zra_intents.json:", error);
  });

// Typing indicator animation
let typingInterval;

function showTypingIndicator() {
  const indicator = document.getElementById("typing-indicator");
  const text = document.getElementById("typing-text");

  if (!indicator || !text) return;

  indicator.style.display = "flex";

  let dots = 0;
  typingInterval = setInterval(() => {
    dots = (dots + 1) % 4;
    text.textContent = "⏳ Gathering your answer" + ".".repeat(dots);
  }, 500);
}

function hideTypingIndicator() {
  clearInterval(typingInterval);
  const indicator = document.getElementById("typing-indicator");
  if (indicator) indicator.style.display = "none";
}

// Tooltip animation loop
function loopTooltip() {
  const tooltip = document.getElementById("chatbot-tooltip");
  if (!tooltip) return;

  setInterval(() => {
    tooltip.style.opacity = "0";
    tooltip.style.animation = "none";

    setTimeout(() => {
      tooltip.style.animation = "fadeShake 2.5s ease forwards";
    }, 300);
  }, 3000);
}

document.addEventListener("DOMContentLoaded", loopTooltip);

// Send message and trigger bot response
function sendMessage() {
  const input = document.getElementById("userInput");
  const message = input.value.trim();
  if (message) {
    addMessage("user", message);
    showTypingIndicator();

    setTimeout(() => {
      const response = getBotResponse(message);
      hideTypingIndicator();
      addMessage("bot", response);
    }, 1000);

    input.value = "";
  }
}

// Add message to chat window
function addMessage(sender, text) {
  const chatBody = document.getElementById("chat-body");
  const msg = document.createElement("div");
  msg.className = `chat-message ${sender} highlighted`;

  const avatar = document.createElement("img");
  avatar.className = "chat-avatar";
  avatar.src = sender === "bot" ? "bot.png" : "user.jpg";

  const bubble = document.createElement("div");
  bubble.className = "chat-bubble";
  bubble.textContent = text;

  msg.appendChild(avatar);
  msg.appendChild(bubble);
  chatBody.appendChild(msg);
  chatBody.scrollTop = chatBody.scrollHeight;

  const sound = document.getElementById("chat-sound");
  if (sound) sound.play();

  // Save to backend
  fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sender, text })
  });
}

// Play sound
const sound = document.getElementById("chat-sound");
if (sound) sound.play();


// Bot response logic with intent matching
function getBotResponse(message) {
  if (!intentsData || !intentsFuse) {
    return "The assistant is still loading. Please try again in a moment.";
  }

  const lower = message.toLowerCase().trim();

  // Use fuzzy matching to find best matching intent
  const results = intentsFuse.search(lower);

  if (results.length > 0 && results[0].score < 0.6) {
    // Found a good match (lower score = better match in Fuse.js)
    const matchedIntent = results[0].item;
    const responses = matchedIntent.responses;

    // Return random response from the intent's responses
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    return randomResponse;
  }

  // No good match found - use fallback
  const fallbackResponses = intentsData.fallback.responses;
  const fallbackMessage = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];

  return `${fallbackMessage}\n\n📞 Call: +260 211 381111\n📧 Email: info@zra.org.zm`;
}


document.addEventListener("DOMContentLoaded", () => {
  const chatbox = document.getElementById("chatbox-modal");
  const minimizeBtn = document.getElementById("minimize-btn");
  const maximizeBtn = document.getElementById("maximize-btn");

  if (minimizeBtn && maximizeBtn && chatbox) {
    minimizeBtn.addEventListener("click", () => {
      chatbox.style.height = "50px";
      chatbox.querySelector(".chat-body").style.display = "none";
      chatbox.querySelector(".chat-input").style.display = "none";
      chatbox.querySelector("#typing-indicator").style.display = "none";
    });

    maximizeBtn.addEventListener("click", () => {
      chatbox.style.height = "600px";
      chatbox.querySelector(".chat-body").style.display = "block";
      chatbox.querySelector(".chat-input").style.display = "flex";
    });
  } else {
    console.warn("Minimize/Maximize buttons not found in DOM.");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const chatbox = document.getElementById("chatbox-modal");
  const header = chatbox.querySelector(".chat-header");

  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  header.style.cursor = "move";

  header.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - chatbox.getBoundingClientRect().left;
    offsetY = e.clientY - chatbox.getBoundingClientRect().top;
    chatbox.style.transition = "none";
  });

  document.addEventListener("mousemove", (e) => {
    if (isDragging) {
      chatbox.style.left = `${e.clientX - offsetX}px`;
      chatbox.style.top = `${e.clientY - offsetY}px`;
      chatbox.style.bottom = "auto"; // override bottom positioning
      chatbox.style.right = "auto";  // override right positioning
    }
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
    chatbox.style.transition = "all 0.3s ease";
  });
});
