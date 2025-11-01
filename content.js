// =============================
// content.js
// =============================
document.addEventListener('mouseup', async () => {
const selection = window.getSelection().toString();
if (!selection) return;

const tooltip = document.createElement('div');
tooltip.innerHTML = '📖 Summarize | 💬 Translate';
tooltip.style.position = 'absolute';
tooltip.style.background = '#fff';
tooltip.style.border = '1px solid #ccc';
tooltip.style.padding = '4px';
tooltip.style.borderRadius = '6px';
tooltip.style.zIndex = 9999;
tooltip.style.top = event.pageY + 'px';
tooltip.style.left = event.pageX + 'px';
document.body.appendChild(tooltip);

tooltip.onclick = async (e) => {
if (e.target.innerText.includes('Summarize')) {
const summary = await chrome.ai.summarizer.summarize(selection);
alert(summary.summary);
}
if (e.target.innerText.includes('Translate')) {
const translated = await chrome.ai.translator.translate(selection, navigator.language);
alert(translated);
}
tooltip.remove();
};

setTimeout(() => tooltip.remove(), 6000);
});