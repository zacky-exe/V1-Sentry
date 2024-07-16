chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "scanSelectedText") {
        fetch('http://localhost:5000/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: request.selectedText })
        })
        .then(response => response.json())
        .then(data => {
            createPopup(data, request.selectedText);
        })
        .catch(error => console.error('Error:', error));
    }
});

function createPopup(result, selectedText) {
    const popup = document.createElement('div');
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.padding = '20px';
    popup.style.backgroundColor = '#ffffff';
    popup.style.border = '1px solid #007bff';
    popup.style.borderRadius = '10px';
    popup.style.boxShadow = '0 4px 12px rgba(0, 123, 255, 0.3)';
    popup.style.zIndex = '10000';
    popup.style.fontFamily = 'Arial, sans-serif';
    popup.style.textAlign = 'center';
    popup.style.maxWidth = '400px';
    popup.style.width = '100%';
    popup.style.color = '#333';

    const resultTable = document.createElement('table');
    resultTable.style.width = '100%';
    resultTable.style.borderCollapse = 'collapse';
    resultTable.style.marginBottom = '10px';

    const addRow = (label, value) => {
        const row = document.createElement('tr');
        const labelCell = document.createElement('td');
        labelCell.textContent = label;
        labelCell.style.border = '1px solid #007bff';
        labelCell.style.padding = '8px';
        labelCell.style.backgroundColor = '#f8f9fa';

        const valueCell = document.createElement('td');
        valueCell.textContent = value;
        valueCell.style.border = '1px solid #007bff';
        valueCell.style.padding = '8px';
        valueCell.style.backgroundColor = '#ffffff';

        row.appendChild(labelCell);
        row.appendChild(valueCell);
        resultTable.appendChild(row);
    };

    addRow('Comment:', result.comment);  // Display the custom comment message
    addRow('Suspicious Comments Percentage:', `${result.percentage}%`);
    addRow('Risk Level:', result.risk_level);

    popup.appendChild(resultTable);

    const reportButtonsContainer = document.createElement('div');
    reportButtonsContainer.style.display = 'flex';
    reportButtonsContainer.style.justifyContent = 'space-between';
    reportButtonsContainer.style.marginTop = '10px';

    const reportCommentButton = document.createElement('button');
    reportCommentButton.textContent = 'Report Suspicious Comment';
    reportCommentButton.style.flex = '1';
    reportCommentButton.style.marginRight = '5px';
    reportCommentButton.style.padding = '10px 20px';
    reportCommentButton.style.border = '1px solid #007bff';
    reportCommentButton.style.borderRadius = '5px';
    reportCommentButton.style.backgroundColor = '#007bff';
    reportCommentButton.style.color = '#ffffff';
    reportCommentButton.style.cursor = 'pointer';
    reportCommentButton.style.fontFamily = 'Arial, sans-serif';
    reportCommentButton.addEventListener('click', () => {
        reportSuspicious('comment', selectedText);
    });
    reportButtonsContainer.appendChild(reportCommentButton);

    const reportUserButton = document.createElement('button');
    reportUserButton.textContent = 'Report Suspicious User';
    reportUserButton.style.flex = '1';
    reportUserButton.style.marginLeft = '5px';
    reportUserButton.style.padding = '10px 20px';
    reportUserButton.style.border = '1px solid #007bff';
    reportUserButton.style.borderRadius = '5px';
    reportUserButton.style.backgroundColor = '#007bff';
    reportUserButton.style.color = '#ffffff';
    reportUserButton.style.cursor = 'pointer';
    reportUserButton.style.fontFamily = 'Arial, sans-serif';
    reportUserButton.addEventListener('click', () => {
        showUserReportPopup(selectedText);
    });
    reportButtonsContainer.appendChild(reportUserButton);

    const closeButtonContainer = document.createElement('div');
    closeButtonContainer.style.display = 'flex';
    closeButtonContainer.style.justifyContent = 'center';
    closeButtonContainer.style.marginTop = '10px';

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.style.padding = '8px 16px';
    closeButton.style.border = '1px solid #dc3545';
    closeButton.style.borderRadius = '5px';
    closeButton.style.backgroundColor = '#dc3545';
    closeButton.style.color = '#ffffff';
    closeButton.style.cursor = 'pointer';
    closeButton.style.fontFamily = 'Arial, sans-serif';
    closeButton.addEventListener('click', () => {
        document.body.removeChild(popup);
    });
    closeButtonContainer.appendChild(closeButton);

    popup.appendChild(reportButtonsContainer);
    popup.appendChild(closeButtonContainer);

    document.body.appendChild(popup);
}

function showUserReportPopup(comment) {
    const userReportPopup = document.createElement('div');
    userReportPopup.style.position = 'fixed';
    userReportPopup.style.top = '50%';
    userReportPopup.style.left = '50%';
    userReportPopup.style.transform = 'translate(-50%, -50%)';
    userReportPopup.style.padding = '20px';
    userReportPopup.style.backgroundColor = '#ffffff';
    userReportPopup.style.border = '1px solid #007bff';
    userReportPopup.style.borderRadius = '10px';
    userReportPopup.style.boxShadow = '0 4px 12px rgba(0, 123, 255, 0.3)';
    userReportPopup.style.zIndex = '10000';
    userReportPopup.style.fontFamily = 'Arial, sans-serif';
    userReportPopup.style.textAlign = 'center';
    userReportPopup.style.maxWidth = '400px';
    userReportPopup.style.width = '100%';
    userReportPopup.style.color = '#333';

    const instruction = document.createElement('p');
    instruction.textContent = 'Please enter the username of the user who posted this comment:';
    userReportPopup.appendChild(instruction);

    const usernameInput = document.createElement('input');
    usernameInput.type = 'text';
    usernameInput.placeholder = 'Enter username';
    usernameInput.style.width = '100%';
    usernameInput.style.marginBottom = '10px';
    usernameInput.style.padding = '10px';
    usernameInput.style.border = '1px solid #007bff';
    usernameInput.style.borderRadius = '5px';
    userReportPopup.appendChild(usernameInput);

    const reportButtonContainer = document.createElement('div');
    reportButtonContainer.style.display = 'flex';
    reportButtonContainer.style.justifyContent = 'space-between';

    const submitButton = document.createElement('button');
    submitButton.textContent = 'Report User';
    submitButton.style.flex = '1';
    submitButton.style.marginRight = '5px';
    submitButton.style.padding = '10px 20px';
    submitButton.style.border = '1px solid #007bff';
    submitButton.style.borderRadius = '5px';
    submitButton.style.backgroundColor = '#007bff';
    submitButton.style.color = '#ffffff';
    submitButton.style.cursor = 'pointer';
    submitButton.style.fontFamily = 'Arial, sans-serif';
    submitButton.addEventListener('click', () => {
        const username = usernameInput.value.trim();
        if (username) {
            reportSuspicious('user', username);
            document.body.removeChild(userReportPopup);
        } else {
            alert('Please enter a username.');
        }
    });
    reportButtonContainer.appendChild(submitButton);

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.style.flex = '1';
    closeButton.style.marginLeft = '5px';
    closeButton.style.padding = '10px 20px';
    closeButton.style.border = '1px solid #dc3545';
    closeButton.style.borderRadius = '5px';
    closeButton.style.backgroundColor = '#dc3545';
    closeButton.style.color = '#ffffff';
    closeButton.style.cursor = 'pointer';
    closeButton.style.fontFamily = 'Arial, sans-serif';
    closeButton.addEventListener('click', () => {
        document.body.removeChild(userReportPopup);
    });
    reportButtonContainer.appendChild(closeButton);

    userReportPopup.appendChild(reportButtonContainer);
    document.body.appendChild(userReportPopup);
}

function reportSuspicious(type, text) {
    fetch(`http://localhost:5000/report-${type}`, {
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
