// =============================
// background.js
// =============================
chrome.action.onClicked.addListener((tab) => {
chrome.sidePanel.open({ windowId: tab.windowId });
});

// Context menu for quick access to APIs
chrome.runtime.onInstalled.addListener(() => {
chrome.contextMenus.create({
id: "summarize",
title: "Summarize Selected Text",
contexts: ["selection"]
});

chrome.contextMenus.create({
id: "translate",
title: "Translate Selected Text",
contexts: ["selection"]
});
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
if (info.menuItemId === "summarize") {
await chrome.scripting.executeScript({
target: { tabId: tab.id },
func: summarizeSelection,
});
}
if (info.menuItemId === "translate") {
await chrome.scripting.executeScript({
target: { tabId: tab.id },
func: translateSelection,
});
}
});

async function summarizeSelection() {
const text = window.getSelection().toString();
  const session = await LanguageModel.create();
        
  const response = await session.summarize(text);

  console.log(response);
};


function translateSelection() {
const text = window.getSelection().toString();
chrome.ai.translator.translate(text, "en").then((translated) => {
alert(translated);
});
}

