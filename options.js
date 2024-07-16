document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('optionsForm');

    // Load saved settings
    chrome.storage.sync.get(['setting1', 'setting2'], (result) => {
        if (result.setting1) {
            document.getElementById('setting1').value = result.setting1;
        }
        document.getElementById('setting2').checked = result.setting2 || false;
    });

    // Save settings
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const setting1 = document.getElementById('setting1').value;
        const setting2 = document.getElementById('setting2').checked;

        chrome.storage.sync.set({ setting1, setting2 }, () => {
            alert('Settings saved');
        });
    });
});
