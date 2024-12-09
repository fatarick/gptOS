kernel.registerApp('texteditor', 'Text Editor', function (filePath = null, content = '') {
    return createTextEditor(filePath, content);
});

// Create Text Editor Window
function createTextEditor(filePath = null, content = '') {
    const w = createWindow("Text Editor");

    // Create Toolbar
    const toolbar = document.createElement('div');
    toolbar.style.display = 'flex';
    toolbar.style.alignItems = 'center';
    toolbar.style.backgroundColor = '#333';
    toolbar.style.padding = '5px';

    // Save Button
    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save';
    saveButton.style.marginRight = '10px';
    saveButton.onclick = () => {
        const path = pathInput.value.trim();
        if (!path) {
            alert('Please enter a valid file path.');
            return;
        }
        fsWriteFile(path, textArea.value);
        alert(`File saved to ${path}`);
    };
    toolbar.appendChild(saveButton);

    // Path Input Bar
    const pathInput = document.createElement('input');
    pathInput.type = 'text';
    pathInput.placeholder = 'Enter /path/to/filename';
    pathInput.style.flex = '1';
    pathInput.style.marginRight = '10px';
    pathInput.value = filePath || ''; // Pre-fill with the current file path, if available
    toolbar.appendChild(pathInput);

    // Text Area
    const textArea = document.createElement('textarea');
    textArea.style.width = '100%';
    textArea.style.height = 'calc(100% - 30px)';
    textArea.style.boxSizing = 'border-box';
    textArea.value = content;

    // Add Toolbar and Text Area to the Window
    w.content.appendChild(toolbar);
    w.content.appendChild(textArea);

    const id = 'texteditor:' + Math.random().toString(36).substr(2, 5);
    return { id, element: w.element };
}