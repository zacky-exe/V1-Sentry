chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "scanSelectedText",
        title: "Scan Selected Comment",
        contexts: ["selection"]
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "scanSelectedText") {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: getSelectedText
        }, (results) => {
            if (results && results[0] && results[0].result) {
                const selectedText = results[0].result;
                chrome.tabs.sendMessage(tab.id, { action: "scanSelectedText", selectedText: selectedText });
            }
        });
    }
});

chrome.commands.onCommand.addListener((command) => {
    if (command === "scan_selected_comment") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                function: getSelectedText
            }, (results) => {
                if (results && results[0] && results[0].result) {
                    const selectedText = results[0].result;
                    chrome.tabs.sendMessage(tabs[0].id, { action: "scanSelectedText", selectedText: selectedText });
                }
            });
        });
    }
});

function getSelectedText() {
    return window.getSelection().toString();
}
