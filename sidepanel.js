
const countrySection = document.getElementById("country-section");
const output = document.getElementById("output");

async function loadCountry() {
  const countries = ["Japan", "France", "Brazil", "USA", "Kenya", "Norway", "Mexico", "Italy"];
  const country = countries[Math.floor(Math.random() * countries.length)];
  renderLoading(country);
  try {
    const brief = await generateCountryBrief(country);
    renderCountryBrief(brief);
  } catch (err) {
    console.error("Error generating country brief:", err);
    output.innerText = "⚠️ Unable to load country data. Try again.";
  }
}

async function generateCountryBrief(country) {
  //if (!chrome.ai || !chrome.ai.prompt || !chrome.ai.prompt.generate) {
    //throw new Error("Prompt API not available — enable in Chrome Canary flags.");
  

  const prompt = `
  Provide a cultural overview for ${country} with the following structure:
  1. Culture Capsule
  2. Global Voice
  3. Essential Phrase (native greeting)
  `;
  const session = await LanguageModel.create();
        
  const response = await session.prompt(prompt);
  //console.log("AI response:", response);
  return { 
    country, 
    content: response || "No response received." 
  };
}

function renderLoading(country) {
  document.getElementById("country-name").innerText = `Discovering ${country}...`;
  document.getElementById("culture-capsule").innerText = "";
  document.getElementById("global-voice").innerText = "";
  document.getElementById("essential-phrase").innerText = "";
}

function formatMarkdownLite(text) {
  if (!text) return "";

  // Escape HTML first for safety
  text = text.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));

  // Convert headings (## and #)
  text = text.replace(/^##\s*(.*)$/gm, '<h3 class="gck-heading">$1</h3>');
  text = text.replace(/^#\s*(.*)$/gm, '<h2 class="gck-heading">$1</h2>');

  // Bold
  text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  // Bullets
  text = text.replace(/^\*\s+(.*)$/gm, "• $1");

  // Line breaks
  text = text.replace(/\n{2,}/g, "<br><br>");
  text = text.replace(/\n/g, "<br>");

  // Inline code
  text = text.replace(/`([^`]*)`/g, "<code>$1</code>");

  return text;
}


function renderCountryBrief(response) {
  console.log("Rendering brief:", response);

  let countryName = "Unknown Country";
  let contentText = "";

  if (typeof response === "string") {
    contentText = response;
  } else if (response && typeof response === "object") {
    countryName = response.country || "Unknown Country";
    contentText = response.content || "";
  }

  contentText = contentText.replace(/\r/g, "").trim();
  //console.log("Raw AI output:\n", contentText);

  // Extract sections more flexibly
  const cultureMatch =
    contentText.match(/(?:\*\*\s*)?1?\.*\s*Culture Capsule[:\*\*]*([\s\S]*?)(?:2\.|Global Voice|$)/i);
  const globalMatch =
    contentText.match(/(?:\*\*\s*)?2?\.*\s*Global Voice[:\*\*]*([\s\S]*?)(?:3\.|Essential Phrase|$)/i);
  const phraseMatch =
    contentText.match(/(?:\*\*\s*)?3?\.*\s*Essential Phrase[:\*\*]*([\s\S]*)/i);

  document.getElementById("country-name").innerText = countryName.trim();

  document.getElementById("culture-capsule").innerHTML =
  formatMarkdownLite(cultureMatch?.[1]?.trim() || "No cultural info available.");

document.getElementById("global-voice").innerHTML =
  formatMarkdownLite(globalMatch?.[1]?.trim() || "No global perspective available.");

document.getElementById("essential-phrase").innerHTML =
  formatMarkdownLite(phraseMatch?.[1]?.trim() || "No phrase found.");

}




document.getElementById("new-country").onclick = loadCountry;
document.getElementById("more-detail").onclick = () => {
const country = document.getElementById("country-name").innerText;
chrome.tabs.create({ url: `https://en.wikipedia.org/wiki/${country}` });
};

document.getElementById("translate-brief").onclick = async () => {
  const output = document.getElementById("output");
  const section = document.getElementById("country-section");

  output.innerHTML = '🌀 Translating brief...';

  try {
    // Grab text to translate
    const text = section.innerText.trim();

    const translator = await Translator.create({
      sourceLanguage: "en",
      targetLanguage: "hi", // or navigator.language
      monitor(m) {
        m.addEventListener("downloadprogress", (e) =>
          console.log(`Downloaded ${(e.loaded * 100).toFixed(1)}%`)
        );
      },
    });

    const translation = await translator.translate(text);

    // Hide the original content temporarily
    const existingChildren = [...section.children];
    existingChildren.forEach((child) => (child.style.display = "none"));

    // Create translation grid container
    const gridWrapper = document.createElement("div");
    gridWrapper.id = "translation-wrapper";
    gridWrapper.style.marginTop = "16px";

    // Build grid for original + translation
    const grid = document.createElement("div");
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = "1fr 1fr";
    grid.style.gap = "12px";

    const originalDiv = document.createElement("div");
    originalDiv.innerHTML = `
      <h4>🌍 Original</h4>
      <div style="white-space: pre-wrap;">${text.replace(/\n/g, "<br>")}</div>`;
    Object.assign(originalDiv.style, {
      padding: "10px",
      border: "1px solid #ddd",
      borderRadius: "8px",
      background: "#fafafa",
    });

    const translatedDiv = document.createElement("div");
    translatedDiv.innerHTML = `
      <h4>🇮🇳 Translated</h4>
      <div style="white-space: pre-wrap;">${translation.replace(/\n/g, "<br>")}</div>`;
    Object.assign(translatedDiv.style, {
      padding: "10px",
      border: "1px solid #cdecc7",
      borderRadius: "8px",
      background: "#f1f9f1",
    });

    grid.appendChild(originalDiv);
    grid.appendChild(translatedDiv);

    // Back button
    const backBtn = document.createElement("button");
    backBtn.innerText = "🔙 Back";
    Object.assign(backBtn.style, {
      marginTop: "16px",
      padding: "6px 12px",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      background: "#0078d7",
      color: "white",
      fontSize: "14px",
    });

    backBtn.onclick = () => {
      gridWrapper.remove();
      existingChildren.forEach((child) => (child.style.display = ""));
      output.innerText = "";
    };

    gridWrapper.appendChild(grid);
    gridWrapper.appendChild(backBtn);
    section.appendChild(gridWrapper);

    output.innerText = "✅ Translation complete.";
  } catch (err) {
    console.error("Translation error:", err);
    output.innerText = "⚠️ Translation failed — check console for details.";
  }
};



// Toolbar functions
const summarizeBtn = document.getElementById("summarizer");
const translatorBtn = document.getElementById("translator");
const writerBtn = document.getElementById("writer");
const rewriterBtn = document.getElementById("rewriter");
const proofreaderBtn = document.getElementById("proofreader");
const langDetectorBtn = document.getElementById("lang-detector");

// --- Writer Icon Click (Popup Modal) ---
writerBtn.onclick = async () => {
  // Reopen if already created
  let modal = document.getElementById("writer-popup");
  if (modal) {
    modal.style.display = "flex";
    return;
  }

  // --- Create modal overlay ---
  modal = document.createElement("div");
  modal.id = "writer-popup";
  Object.assign(modal.style, {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "none", // hidden by default
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(0, 0, 0, 0.5)",
    zIndex: "999999",
    padding: "10px",
  });

  // --- Modal content ---
  modal.innerHTML = `
    <div class="writer-modal">
      <span class="writer-close">&times;</span>
      <h2>✍️ Global Writer</h2>

      <label>🌐 Language:</label>
      <select id="write-language">
        <option value="en">English</option>
        <option value="hi">Hindi</option>
        <option value="es">Spanish</option>
        <option value="ja">Japanese</option>
      </select>

      <label>🧭 What to Generate:</label>
      <select id="write-topic">
        <option value="brief">Country Brief</option>
        <option value="poem">Poem about the Country</option>
        <option value="travel">Top Travel Places</option>
      </select>

      <button id="generate-write">✨ Generate</button>

      <textarea id="write-output" placeholder="Your generated text will appear here..."></textarea>

      <div class="writer-actions">
        <button id="copy-write">📋 Copy</button>
        <button id="rewrite-write">🔁 Rewrite</button>
      </div>
    </div>
  `;

  // ✅ Append to <html> root to prevent showing inline in sidepanel
  document.documentElement.appendChild(modal);

  // --- Add inline styles for modal content ---
  const style = document.createElement("style");
  style.textContent = `
    .writer-modal {
      background: #fff;
      border-radius: 12px;
      padding: 20px;
      width: 90%;
      max-width: 480px;
      box-shadow: 0 0 20px rgba(0,0,0,0.25);
      display: flex;
      flex-direction: column;
      gap: 10px;
      position: relative;
      animation: fadeIn 0.25s ease;
    }
    .writer-close {
      position: absolute;
      right: 12px;
      top: 8px;
      font-size: 22px;
      cursor: pointer;
    }
    textarea {
      height: 160px;
      border-radius: 8px;
      border: 1px solid #ccc;
      padding: 8px;
      resize: vertical;
      font-family: "Segoe UI", sans-serif;
    }
    button {
      border: none;
      border-radius: 8px;
      padding: 8px 12px;
      cursor: pointer;
      background: #0078d7;
      color: #fff;
      font-weight: 500;
    }
    button:hover { background: #005fa3; }
    .writer-actions {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
  `;
  document.head.appendChild(style);

  // --- Show modal now ---
  modal.style.display = "flex";

  // --- Close Modal ---
  modal.querySelector(".writer-close").onclick = () => {
    modal.style.display = "none";
  };

  // --- Handle Generate ---
  document.getElementById("generate-write").onclick = async () => {
    const lang = document.getElementById("write-language").value;
    const topic = document.getElementById("write-topic").value;
    const textBox = document.getElementById("write-output");
    const country = document.getElementById("country-name")?.innerText || "the selected country";
    textBox.value = "🪄 Generating content...";

    let promptText = "";
    if (topic === "brief") promptText = `Write a cultural and social brief about ${country} in ${lang}.`;
    if (topic === "poem") promptText = `Write a creative poem about ${country} in ${lang}.`;
    if (topic === "travel") promptText = `List and describe the top travel destinations in ${country} in ${lang}.`;

    try {
      const writer = await Writer.create({
        length: "medium",
        format: "markdown",
        outputLanguage: lang,
      });

      const generated = await writer.write(promptText);
      textBox.value = generated.trim();
    } catch (err) {
      console.error("Writer API error:", err);
      textBox.value = "⚠️ Failed to generate text.";
    }
  };

  // --- Copy Button ---
  document.getElementById("copy-write").onclick = async () => {
    const text = document.getElementById("write-output").value;
    if (!text.trim()) return alert("No content to copy!");
    await navigator.clipboard.writeText(text);
    alert("✅ Copied to clipboard!");
  };

  // --- Rewrite Button ---
  document.getElementById("rewrite-write").onclick = async () => {
    const textBox = document.getElementById("write-output");
    const text = textBox.value;
    if (!text.trim()) return alert("Please generate some text first!");

    try {
      const rewriter = await Rewriter.create({ format: "markdown" });
      const rewritten = await rewriter.rewrite(text);
      textBox.value = rewritten.trim();
    } catch (err) {
      console.error("Rewriter API error:", err);
      alert("⚠️ Rewrite failed — check console.");
    }
  };
};
// Note: writer UI is exposed as a modal only. In-panel copy handler removed to avoid
// referencing non-existent elements (copyBtn / writer-output).



summarizeBtn.onclick = async () => {
  output.innerHTML = `🌀 Summarizing...`;

  try {
    // 🔹 Get selected text from active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const selectedText = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => window.getSelection().toString(),
    });

    let text = selectedText?.[0]?.result?.trim();

    // 🔸 If nothing selected, fall back to sidepanel text
    if (!text) {
      text = document.getElementById("country-section").innerText;
    }

    // 🧠 Use Summarizer API
    const summarizer = await Summarizer.create({
  monitor(m) {
    m.addEventListener('downloadprogress', (e) => {
      console.log(`Downloaded ${e.loaded * 100}%`);
    });
  }
});
  
     const summary = await summarizer.summarize(text);

      output.innerHTML = "<hr><h3>Summary</h3><br>" + summary + "<hr><br>";
    }
   catch (err) {
    console.error("Summarization error:", err);
    output.innerText = "⚠️ Summarization failed — check console for details.";
  }
};


translatorBtn.onclick = async () => {
  console.log("Translator button clicked");
  output.innerText = "🌐 Translating...";

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const selectedText = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => window.getSelection().toString(),
    });

    let text = selectedText?.[0]?.result?.trim();
    if (!text) {
      text = document.getElementById("country-section").innerText;
    }

    // 🏷️ Get the selected target language from dropdown
    const targetLanguage = document.getElementById("language-select").value || "hi";

    const translator = await Translator.create({
      sourceLanguage: "en", 
      targetLanguage,
      monitor(m) {
        m.addEventListener("downloadprogress", (e) =>
          console.log(`Downloaded ${(e.loaded * 100).toFixed(1)}%`)
        );
      },
    });

    console.log(`Translating to ${targetLanguage}:`, text);
    const translation = await translator.translate(text);

  console.log("Translation result:", translation);
    //output.innerHTML = translation;

     // Preserve line breaks
    output.innerHTML =
      translation.replace(/\n/g, "<br>");

  } catch (err) {
    console.error("Translation error:", err);
    output.innerText = "⚠️ Translation failed — check console for details.";
  }
};



proofreaderBtn.onclick = async () => {
const text = document.getElementById("country-section").innerText;
const proof = await chrome.ai.proofreader.proofread(text);
output.innerText = proof.suggestions.map(s => s.text).join("\n");
};

langDetectorBtn.onclick = async () => {
const text = document.body.innerText.slice(0, 500);
const lang = await chrome.ai.languageDetector.detect(text);
output.innerText = `Primary language detected: ${lang.language}`;
};

loadCountry();