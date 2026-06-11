const API_BASE_URL = "https://coderecall-ai.onrender.com"; // Replace with your backend URL in deployment

const codeInput = document.getElementById("codeInput");
const problemInput = document.getElementById("problemInput");
const explainBtn = document.getElementById("explainBtn");
const statusEl = document.getElementById("status");
const resultCode = document.getElementById("resultCode");

function setStatus(message) {
  statusEl.textContent = message;
}

function setLoading(isLoading) {
  explainBtn.disabled = isLoading;
  if (isLoading) {
    setStatus("Analyzing your code...");
  }
}

explainBtn.addEventListener("click", async () => {
  const code = codeInput.value.trim();
  const problem = problemInput.value.trim();

  resultCode.textContent = "";

  if (!code) {
    setStatus("Please paste your code first.");
    return;
  }

  try {
    setLoading(true);

    const response = await fetch(`${API_BASE_URL}/explain-code`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ code, problem })
    });

    const data = await response.json();

    if (!response.ok) {
      setStatus(data.error || "Something went wrong.");
      return;
    }

    resultCode.textContent = data.result || "";
    setStatus("");
  } catch (err) {
    setStatus("Network error. Please try again.");
  } finally {
    setLoading(false);
  }
});
