import { createWindow } from '../js/main.js';

// Register the Media Player app
kernel.registerApp('mediaplayer', 'Media Player', function () {
    return createMediaPlayer();
});

function createMediaPlayer() {
    // Create window
    const w = createWindow("Media Player");
    w.id = 'mediaplayer:' + Math.random().toString(36).substr(2, 5);

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
    return w;
}
