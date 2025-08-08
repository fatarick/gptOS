kernel.registerApp('fileexplorer', 'File Explorer', function (shell) {
  return createFileExplorerWindow(shell);
}, 'assets/icons/folder.svg');

// Create File Explorer Window
function createFileExplorerWindow(shell) {
  const w = createWindow("File Explorer");

  // Toolbar
  const toolbar = document.createElement('div');
  toolbar.style.display = 'flex';
  toolbar.style.backgroundColor = '#333';
  toolbar.style.padding = '5px';

  // New Folder Button
  const newFolderButton = document.createElement('button');
  newFolderButton.textContent = 'New Folder';
  newFolderButton.style.marginRight = '10px';
  newFolderButton.onclick = () => openDialog('New Folder', (name) => createFolder(name));
  toolbar.appendChild(newFolderButton);

  // New File Button
  const newFileButton = document.createElement('button');
  newFileButton.textContent = 'New File';
  newFileButton.style.marginRight = '10px';
  newFileButton.onclick = () => openDialog('New File', (name) => createFile(name));
  toolbar.appendChild(newFileButton);

  // Copy Button
  const copyButton = document.createElement('button');
  copyButton.textContent = 'Copy';
  copyButton.style.marginRight = '10px';
  copyButton.onclick = () => {
      if (selectedItem) {
          clipboard = { action: 'copy', item: selectedItem };
          alert(`Copied: ${selectedItem.name}`);
      } else {
          alert('No item selected to copy.');
      }
  };
  toolbar.appendChild(copyButton);

  // Cut Button
  const cutButton = document.createElement('button');
  cutButton.textContent = 'Cut';
  cutButton.style.marginRight = '10px';
  cutButton.onclick = () => {
      if (selectedItem) {
          clipboard = { action: 'cut', item: selectedItem };
          alert(`Cut: ${selectedItem.name}`);
      } else {
          alert('No item selected to cut.');
      }
  };
  toolbar.appendChild(cutButton);

  // Paste Button
  const pasteButton = document.createElement('button');
  pasteButton.textContent = 'Paste';
  pasteButton.style.marginRight = '10px';
  pasteButton.onclick = () => {
      if (clipboard) {
          const destPath = `${shell.cwd}/${clipboard.item.name}`;
          if (clipboard.action === 'copy') {
              fsWriteFile(destPath, fsReadFile(clipboard.item.path));
              alert(`Pasted (copied): ${clipboard.item.name}`);
          } else if (clipboard.action === 'cut') {
              fsWriteFile(destPath, fsReadFile(clipboard.item.path));
              fsDeleteFile(clipboard.item.path);
              alert(`Pasted (moved): ${clipboard.item.name}`);
          }
          clipboard = null;
          populate();
      } else {
          alert('Clipboard is empty.');
      }
  };
  toolbar.appendChild(pasteButton);

  const list = document.createElement('ul');
  list.style.listStyle = 'none';
  list.style.padding = '0';
  list.style.margin = '0';

  let currentItems = [];
  let clipboard = null;
  let selectedItem = null;

  // Populate File List
  function populate() {
      list.innerHTML = '';
      const { dirs, files } = fsListDir(shell.cwd);
      currentItems = [];

      // Up Item
      const upItem = document.createElement('li');
      upItem.textContent = '..';
      upItem.style.cursor = 'pointer';
      upItem.onclick = () => {
          shell.cwd = shell.cwd.split('/').slice(0, -1).join('/') || '/';
          populate();
      };
      list.appendChild(upItem);
      currentItems.push({ name: '..', dir: true });

      // Directories
      for (const dir of dirs) {
          const li = document.createElement('li');
          li.textContent = `[Dir] ${dir}`;
          li.style.cursor = 'pointer';
          li.onclick = () => {
              shell.cwd += `/${dir}`;
              populate();
          };
          li.oncontextmenu = (e) => {
              e.preventDefault();
              selectedItem = { name: dir, path: `${shell.cwd}/${dir}`, isDir: true };
          };
          list.appendChild(li);
          currentItems.push({ name: dir, dir: true });
      }

      // Files
      for (const file of files) {
          const li = document.createElement('li');
          li.textContent = file;
          li.style.cursor = 'pointer';
          li.onclick = () => {
              if (file.endsWith('.txt')) {
                  openTextEditor(`${shell.cwd}/${file}`, fsReadFile(`${shell.cwd}/${file}`));
              } else {
                  alert(`Opening file: ${file}`);
              }
          };
          li.oncontextmenu = (e) => {
              e.preventDefault();
              selectedItem = { name: file, path: `${shell.cwd}/${file}`, isDir: false };
          };
          list.appendChild(li);
          currentItems.push({ name: file, dir: false });
      }
  }
  populate();

  // Open Text Editor
  function openTextEditor(filePath, content) {
      const textEditorApp = kernel.getApps().find((app) => app.id === 'texteditor');
      if (textEditorApp) {
          const editor = textEditorApp.createFunc(filePath, content);
          window.apps.push(editor);
      } else {
          alert('Text Editor app is not available.');
      }
  }

  // Open Dialog for New Folder or New File
  function openDialog(title, callback) {
      const dialogWindow = createWindow(title);

      const input = document.createElement('input');
      input.type = 'text';
      input.placeholder = `Enter ${title.toLowerCase()} name...`;
      input.style.width = '100%';
      input.style.marginBottom = '10px';

      const createButton = document.createElement('button');
      createButton.textContent = 'Create';
      createButton.style.marginRight = '10px';
      createButton.onclick = () => {
          const name = input.value.trim();
          if (!name) {
              alert('Name cannot be empty.');
              return;
          }
          callback(name);
          dialogWindow.element.remove();
      };

      const cancelButton = document.createElement('button');
      cancelButton.textContent = 'Cancel';
      cancelButton.onclick = () => dialogWindow.element.remove();

      dialogWindow.content.appendChild(input);
      dialogWindow.content.appendChild(createButton);
      dialogWindow.content.appendChild(cancelButton);
  }

  // Create New Folder
  function createFolder(name) {
      const dirPath = `${shell.cwd}/${name}`;
      if (fsIsDir(dirPath)) {
          alert('Folder already exists.');
          return;
      }
      fsWriteFile(dirPath, {}); // Create an empty object to represent the folder
      populate();
  }

  // Create New File
  function createFile(name) {
      const filePath = `${shell.cwd}/${name}`;
      if (fsGetNode(filePath)) {
          alert('File already exists.');
          return;
      }
      fsWriteFile(filePath, ''); // Create an empty file
      populate();
  }

  // Append Toolbar and List to Window
  w.content.appendChild(toolbar);
  w.content.appendChild(list);

  const id = 'fileexplorer:' + Math.random().toString(36).substr(2, 5);
  return { id, element: w.element };
}