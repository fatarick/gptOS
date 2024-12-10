// terminal.js
kernel.registerApp('terminal','Terminal', function(shell) {
    return createTerminalWindow(shell);
  });
  
  function createTerminalWindow(shell) {
    const w=createWindow("Terminal");
    let output=document.createElement('div');
    output.className='terminal-output';
    let input=document.createElement('input');
    input.className='terminal-input';
  
    w.content.appendChild(output);
    w.content.appendChild(input);
  
    input.addEventListener('keydown', ev=>{
      if (ev.key==='Enter') {
        let line=input.value;
        input.value='';
        output.textContent+= '> '+line+'\n';
        let res=shell.runCommand(line);
        if (res.trim()) output.textContent+=res+'\n';
        output.scrollTop=output.scrollHeight;
      }
    });
  
    const id='terminal:'+Math.random().toString(36).substr(2,5);
    return {id, element:w.element};
  }