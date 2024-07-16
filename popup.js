document.addEventListener("DOMContentLoaded", function () {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action === "scanSelectedTextResult") {
            displayResult(message.result);
        }
    });
});

function displayResult(result) {
    const resultContainer = document.createElement('div');
    resultContainer.classList.add('result-container');
    
    const resultText = `
        <div class="result-item"><strong>Comment:</strong> ${result.text}</div>
        <div class="result-item"><strong>Suspicious Comments Percentage:</strong> ${result.percentage}%</div>
        <div class="result-item"><strong>Risk Level:</strong> ${result.risk_level}</div>
    `;
    
    resultContainer.innerHTML = resultText;

    const buttonsContainer = document.createElement('div');
    buttonsContainer.classList.add('buttons-container');
    
    const reportCommentButton = document.createElement('button');
    reportCommentButton.textContent = 'Report Suspicious Comment';
    reportCommentButton.classList.add('button', 'report-comment-button');
    reportCommentButton.addEventListener('click', () => {
        reportSuspicious('comment', result.text);
    });
    buttonsContainer.appendChild(reportCommentButton);

    const reportUserButton = document.createElement('button');
    reportUserButton.textContent = 'Report Suspicious User';
    reportUserButton.classList.add('button', 'report-user-button');
    reportUserButton.addEventListener('click', () => {
        reportSuspicious('user', result.text);
    });
    buttonsContainer.appendChild(reportUserButton);

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.classList.add('button', 'close-button');
    closeButton.addEventListener('click', () => {
        document.body.removeChild(resultContainer);
    });
    buttonsContainer.appendChild(closeButton);
    
    resultContainer.appendChild(buttonsContainer);
    document.body.appendChild(resultContainer);
}

function reportSuspicious(type, text) {
    fetch(`http://127.0.0.1:5000/report-${type}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text })
    })
    .then(response => response.json())
    .then(data => {
        alert(`Suspicious ${type} reported successfully.`);
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while reporting.');
    });
}
