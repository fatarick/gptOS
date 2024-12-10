kernel.registerApp('about','About', function() {
    return createAboutWindow();
});

function createAboutWindow() {
    const w = createWindow("About");

    // Create a main container for the about text
    let desc = document.createElement('div');

    // Create each line of info
    let desc1 = document.createElement('div');
    desc1.textContent = "gptOS 1.0";

    let desc2 = document.createElement('div');
    desc2.textContent = "gptOS is a simple operating system that runs in the browser. It is built using HTML, CSS, and JavaScript. It is a project by ChatGPT and Fatarick.";

    let desc3 = document.createElement('div');
    desc3.textContent = "Code: ChatGPT | Creative: Fatarick";

    // Append the lines to the main description container
    desc.appendChild(desc1);
    desc.appendChild(desc2);
    desc.appendChild(desc3);

    // Append the container to the window content
    w.content.appendChild(desc);

    const id = 'about:' + Math.random().toString(36).substr(2,5);
    return {id, element:w.element};
}