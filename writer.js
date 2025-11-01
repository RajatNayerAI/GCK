document.getElementById("generate-write").onclick = async () => {
  const lang = document.getElementById("write-language").value;
  const topic = document.getElementById("write-topic").value;
  const textBox = document.getElementById("write-output");

  textBox.value = "🪄 Generating content...";

  let promptText = "";
  if (topic === "brief") promptText = `Write a cultural and social brief about Japan in ${lang}.`;
  if (topic === "poem") promptText = `Write a creative poem about Japan in ${lang}.`;
  if (topic === "travel") promptText = `List and describe the top travel destinations in Japan in ${lang}.`;

  try {
    const writer = await Writer.create({
      length: "medium",
      format: "text/plain",
      outputLanguage: lang,
    });

    const generated = await writer.write(promptText);
    textBox.value = generated.trim();
  } catch (err) {
    console.error("Writer API error:", err);
    textBox.value = "⚠️ Failed to generate text.";
  }
};

document.getElementById("copy-write").onclick = async () => {
  const text = document.getElementById("write-output").value;
  if (!text.trim()) return alert("No content to copy!");
  await navigator.clipboard.writeText(text);
  alert("✅ Copied to clipboard!");
};

document.getElementById("rewrite-write").onclick = async () => {
  const textBox = document.getElementById("write-output");
  const text = textBox.value;
  if (!text.trim()) return alert("Please generate some text first!");

  try {
    const rewriter = await Rewriter.create({ tone: "neutral" });
    const rewritten = await rewriter.rewrite(text);
    textBox.value = rewritten.trim();
  } catch (err) {
    console.error("Rewriter API error:", err);
    alert("⚠️ Rewrite failed — check console.");
  }
};
