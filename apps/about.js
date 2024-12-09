kernel.registerApp('about', 'About', function () {
    return createAboutWindow();
});

function createAboutWindow() {
    const w = createWindow("About");

    // Disable resize by overriding styles
    w.element.style.resize = 'none'; // Disable resizing
    w.element.style.overflow = 'hidden'; // Prevent showing resize handles
    //w.element.style.maxBtn = 'hidden';

    // Find and disable the scale button
    const titleBar = w.element.querySelector('.title-bar');
    if (titleBar) {
        const scaleButton = titleBar.querySelector('.scale-button');
        if (scaleButton) {
            scaleButton.disabled = true; // Disable functionality
            scaleButton.style.backgroundColor = '#888'; // Gray color
            scaleButton.style.cursor = 'not-allowed'; // Indicate it’s unavailable
        }
    }

    // Create a main container for the about text
    let desc = document.createElement('div');

    // Create each line of info
    let desc1 = document.createElement('div');
    desc1.textContent = "gptOS 1.1.3.1";

    let desc2 = document.createElement('div');
    desc2.textContent = "gptOS is a simple operating system that runs in the browser. It is built using HTML, CSS, and JavaScript. It is a project by ChatGPT and Fatarick.";

    let desc3 = document.createElement('div');
    desc3.textContent = "Code: ChatGPT | Creative: Fatarick";

    let desc4 = document.createElement('div');
    desc4.textContent = "(C) 2024 ChatGPT, Fatarick";

    // Append the lines to the main description container
    desc.appendChild(desc1);
    desc.appendChild(desc2);
    desc.appendChild(desc3);
    desc.appendChild(desc4);

    // Append the container to the window content
    w.content.appendChild(desc);

    const id = 'about:' + Math.random().toString(36).substr(2, 5);
    return { id, element: w.element };
}
