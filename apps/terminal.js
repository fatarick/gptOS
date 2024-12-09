// terminal.js
kernel.registerApp('terminal', 'Terminal', function (shell) {
  return createTerminalWindow(shell);
});

function createTerminalWindow(shell) {
  const w = createWindow("Terminal");

  w.element.style.height = '270px';

  // Output display area
  const output = document.createElement('div');
  output.className = 'terminal-output';
  output.style.overflowY = 'auto';
  output.style.height = 'calc(100% - 30px)';
  output.style.padding = '5px';
  output.style.whiteSpace = 'pre-wrap';
  output.style.fontFamily = 'monospace';

  // Input area
  const input = document.createElement('input');
  input.className = 'terminal-input';
  input.style.width = '100%';
  input.style.boxSizing = 'border-box';
  input.style.padding = '5px';
  input.style.fontFamily = 'monospace';

  w.content.appendChild(output);
  w.content.appendChild(input);

  // Handle command input
  input.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter') {
          const line = input.value.trim();
          input.value = '';
          if (line) {
              output.textContent += `> ${line}\n`;
              const res = shell.runCommand(line);
              if (res.trim()) output.textContent += `${res}\n`;
              output.scrollTop = output.scrollHeight;
          }
      }
  });

  // Generate a unique ID for this terminal instance
  const id = `terminal:${Math.random().toString(36).substr(2, 5)}`;
  return { id, element: w.element, shell: { appId: id, window: w, runCommand: shell.runCommand } };
}