kernel.registerApp('stickynotes', 'Sticky Notes', function () {
    return createStickyNote();
 }, 'assets/icons/sticky-notes.svg');

// Restore saved notes when the OS loads
window.addEventListener('DOMContentLoaded', () => {
    const saved = JSON.parse(localStorage.getItem('stickynotes') || '{}');
    for (const [id, content] of Object.entries(saved)) {
        createStickyNote(content, id);
    }
});

function createStickyNote(content = '', id = null) {
    const noteId = id || ('stickynotes:' + Math.random().toString(36).substr(2, 5));
    const w = createWindow('Sticky Note');

    // Make the window small
    w.element.style.width = '200px';
    w.element.style.height = '200px';

    // Text area for note content
    const textarea = document.createElement('textarea');
    textarea.style.width = '100%';
    textarea.style.height = '100%';
    textarea.style.boxSizing = 'border-box';
    textarea.style.border = 'none';
    textarea.style.resize = 'none';
    textarea.style.background = 'lemonchiffon';
    textarea.style.padding = '10px';
    textarea.value = content;

    textarea.addEventListener('input', () => {
        saveStickyNote(noteId, textarea.value);
    });

    w.content.appendChild(textarea);

    // Override close button to remove from storage
    const closeBtn = w.element.querySelector('.window-buttons button:last-child');
    closeBtn.onclick = () => {
        deleteStickyNote(noteId);
        closeAppByElement(w.element);
    };

    saveStickyNote(noteId, textarea.value); // ensure note exists in storage
    return { id: noteId, element: w.element };
}

function saveStickyNote(id, text) {
    const notes = JSON.parse(localStorage.getItem('stickynotes') || '{}');
    notes[id] = text;
    localStorage.setItem('stickynotes', JSON.stringify(notes));
}

function deleteStickyNote(id) {
    const notes = JSON.parse(localStorage.getItem('stickynotes') || '{}');
    delete notes[id];
    localStorage.setItem('stickynotes', JSON.stringify(notes));
}
