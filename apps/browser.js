kernel.registerApp('browser', 'Browser', function () {
    return createBrowserWindow();
});

function createBrowserWindow() {
    const w = createWindow('Browser');
    w.element.style.width = '800px';
    w.element.style.height = '600px';

    const toolbar = document.createElement('div');
    toolbar.style.display = 'flex';
    toolbar.style.marginBottom = '5px';

    const urlInput = document.createElement('input');
    urlInput.type = 'text';
    urlInput.placeholder = 'Enter URL';
    urlInput.value = 'https://example.com';
    urlInput.style.flex = '1';
    urlInput.style.marginRight = '5px';

    const goButton = document.createElement('button');
    goButton.textContent = 'Go';

    toolbar.appendChild(urlInput);
    toolbar.appendChild(goButton);
    w.content.appendChild(toolbar);

    const iframe = document.createElement('iframe');
    iframe.src = urlInput.value;
    iframe.style.width = '100%';
    iframe.style.height = 'calc(100% - 30px)';
    iframe.style.border = 'none';
    w.content.appendChild(iframe);

    function navigate() {
        let url = urlInput.value.trim();
        if (url && !/^https?:\/\//i.test(url)) {
            url = 'https://' + url;
        }
        iframe.src = url;
    }

    goButton.addEventListener('click', navigate);
    urlInput.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter') navigate();
    });

    const id = 'browser:' + Math.random().toString(36).substr(2, 5);
    return { id, element: w.element };
}

