kernel.registerApp('images', 'Images', function() {
    return createImagesWindow();
});

function createImagesWindow() {
    const w = createWindow("Images");

    w.element.style.width = '530px';
    w.element.style.height = '630px';

    let desc = document.createElement('div');
    desc.textContent = "Change Image URL:";
    w.content.appendChild(desc);


    let btn = document.createElement('button');
    btn.className = 'color-btn';
    btn.textContent = 'Set Image';
    btn.style.width = '100px';
    btn.style.height = '50px';
    btn.style.borderRadius = '10px';
    btn.style.textAlign = 'center';
    btn.onclick = () => {
        let c = prompt("Enter image URL:");
        if (c) {
            image.src = c; // Update the image source
        }
    };
    w.content.appendChild(btn);

    let hr = document.createElement('hr');
    w.content.appendChild(hr);

    let image = document.createElement('img');
    image.style.width = '500px';
    image.style.height = '500px';
    image.style.textAlign = 'center';
    image.src = ''; // Initialize with an empty source
    w.content.appendChild(image);

    const id = 'settings:' + Math.random().toString(36).substring(2, 7);
    return { id, element: w.element };
}
