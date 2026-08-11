const chat = document.getElementById("chat");
const form = document.getElementById("form");
const input = document.getElementById("input");

function add(text, className) {
  const div = document.createElement("div");
  div.className = className;
  div.textContent = text;
  chat.appendChild(div);
  return div;
}

form.onsubmit = async (e) => {
  e.preventDefault();

  const message = input.value.trim();
  if (!message) return;

  add(message, "you");
  input.value = "";

  const bot = add("", "bot");

  try {
    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const parts = buffer.split("\n\n");
      buffer = parts.pop() || "";

      for (const part of parts) {
        const dataLine = part.split("\n").find((l) => l.startsWith("data:"));
        if (!dataLine || part.includes("event: done")) continue;

        bot.textContent += JSON.parse(dataLine.slice(5));
      }
    }
  } catch {
    bot.textContent = "Error. Try again.";
  }
};
