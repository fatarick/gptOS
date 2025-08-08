// Register the Media Player app
kernel.registerApp('mediaplayer', 'Media Player', function () {
    return createMediaPlayer();
}, 'assets/icons/play-circle.svg');

function createMediaPlayer() {
    // Create window
    const w = createWindow("Media Player");

    w.element.style.resize = 'none'; // Disable resizing
    w.element.style.overflow = 'hidden'; // Prevent showing resize handles

    // Create main container for the media player
    const container = document.createElement('div');
    container.style.textAlign = 'center';
    container.style.height = '100%';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.justifyContent = 'center';
    container.style.alignItems = 'center';

    // Create the video element
    const video = document.createElement('video');
    video.style.width = '100%';
    video.style.height = 'auto';
    video.controls = true;
    video.style.border = '1px solid #ccc';
    video.style.backgroundColor = '#000';

    // Add a source element to the video
    const source = document.createElement('source');
    source.src = ''; // No initial video
    source.type = 'video/mp4';
    video.appendChild(source);

    // Create the title bar input field for the video URL
    const urlInput = document.createElement('input');
    urlInput.type = 'text';
    urlInput.placeholder = 'Enter video URL here...';
    urlInput.style.marginRight = '10px';
    urlInput.style.flex = '1';
    urlInput.style.maxWidth = '70%'; // Limit the size to fit well next to buttons

    // Handle URL input changes
    urlInput.addEventListener('change', () => {
        const url = urlInput.value.trim();
        if (url) {
            source.src = url;
            video.load(); // Reload video with the new URL
        }
    });

    // Add the input field to the title bar, before the window buttons
    const titleBar = w.element.querySelector('.title-bar');
    const windowButtons = titleBar.querySelector('.window-buttons');
    titleBar.insertBefore(urlInput, windowButtons);

    // Append the video to the container
    container.appendChild(video);

    // Add the container to the window content
    w.content.appendChild(container);

    // Return the window object
    const id = 'mediaplayer:' + Math.random().toString(36).substr(2, 5);
    return { id, element: w.element };
}

// Create a window with title and content
function createWindow(title) {
    const windowElement = document.createElement('div');
    windowElement.className = 'window';
    windowElement.style.position = 'absolute';
    windowElement.style.background = 'rgba(34, 34, 34, 0.8)';
    windowElement.style.border = '1px solid rgba(68, 68, 68, 0.5)';
    windowElement.style.width = '400px';
    windowElement.style.height = '300px';
    windowElement.style.resize = 'both';
    windowElement.style.overflow = 'hidden';
    windowElement.style.borderRadius = '10px';
    windowElement.style.backdropFilter = 'blur(15px)';
    windowElement.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.5)';
    windowElement.style.display = 'flex';
    windowElement.style.flexDirection = 'column';

    // Title bar
    const titleBar = document.createElement('div');
    titleBar.className = 'title-bar';
    titleBar.style.height = '30px';
    titleBar.style.background = 'rgba(51, 51, 51, 0.9)';
    titleBar.style.color = 'white';
    titleBar.style.display = 'flex';
    titleBar.style.alignItems = 'center';
    titleBar.style.padding = '0 5px';
    titleBar.style.boxSizing = 'border-box';
    titleBar.style.cursor = 'move';
    titleBar.style.gap = '10px'; // Adds spacing between elements

    const titleText = document.createElement('div');
    titleText.className = 'title-text';
    titleText.textContent = title;
    titleText.style.flex = 'none';

    const windowButtons = document.createElement('div');
    windowButtons.className = 'window-buttons';
    windowButtons.style.display = 'flex';
    windowButtons.style.alignItems = 'center';
    windowButtons.style.justifyContent = 'flex-end';

    const closeButton = document.createElement('button');
    closeButton.textContent = '✖';
    closeButton.style.background = 'none';
    closeButton.style.color = 'white';
    closeButton.style.border = 'none';
    closeButton.style.cursor = 'pointer';
    closeButton.style.width = '24px';
    closeButton.style.height = '24px';
    closeButton.addEventListener('click', () => {
        windowElement.remove();
    });
    windowButtons.appendChild(closeButton);

    // Append title bar elements
    titleBar.appendChild(titleText);
    titleBar.appendChild(windowButtons);

    // Content area
    const content = document.createElement('div');
    content.className = 'window-content';
    content.style.flex = '1';
    content.style.padding = '5px';
    content.style.overflow = 'auto';
    content.style.boxSizing = 'border-box';

    // Append title bar and content to the window
    windowElement.appendChild(titleBar);
    windowElement.appendChild(content);

    // Append the window to the document body
    document.body.appendChild(windowElement);

    return { element: windowElement, content };
}