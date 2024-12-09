kernel.registerApp('fileexplorer','File Explorer', function(shell) {
    return createFileExplorerWindow(shell);
  });
  
  function createFileExplorerWindow(shell) {
    const w=createWindow("File Explorer");
    let list=document.createElement('ul');
    list.style.listStyle='none';list.style.padding='0';list.style.margin='0';
  
    let currentItems = [];
  
    function populate() {
      list.innerHTML='';
      const {dirs,files}=fsListDir(shell.cwd);
      currentItems = [];
      // Up item
      let liUp=document.createElement('li');liUp.textContent='..';liUp.style.cursor='pointer';
      liUp.onclick=()=>{shell.runCommand('cd ..');populate();};
      list.appendChild(liUp);
      currentItems.push({name:'..', dir:true});
      // Dirs
      for (let d of dirs) {
        let li=document.createElement('li');
        li.textContent=d;
        li.style.cursor='pointer';
        li.onclick=()=>{shell.runCommand("cd "+d.replace('/',''));populate();};
        li.oncontextmenu=(e)=>showFileContextMenu(e, d, true); 
        list.appendChild(li);
        currentItems.push({name:d, dir:true});
      }
      // Files
      for (let f of files) {
        let li=document.createElement('li');
        li.textContent=f;
        li.style.cursor='pointer';
        li.onclick=()=>{
          let p=shell.fsJoin(f);
          let c=fsReadFile(p);
          let tw=createTextEditor(p,c);
          window.apps.push(tw);
          updateTaskbar();
        };
        li.oncontextmenu=(e)=>showFileContextMenu(e, f, false);
        list.appendChild(li);
        currentItems.push({name:f, dir:false});
      }
    }
  
    function showFileContextMenu(ev, name, isDir) {
      ev.preventDefault();
      closeContextMenu();
      let menu=document.getElementById('context-menu');
      menu.innerHTML='';
      let p = shell.fsJoin(name.replace('/',''));
      if (name==='..') return; // no menu for '..'
  
      if (isDir) {
        // Directory: maybe "Delete Dir" if empty
        let node = fsGetNode(p);
        let canDelete = (Object.keys(node).length===0);
        if (canDelete) {
          let del=document.createElement('li');
          del.textContent="Delete Directory";
          del.onclick=()=>{
            kernel.commands.rmdir([name.replace('/','')], shell);
            closeContextMenu();
            populate();
          };
          menu.appendChild(del);
        }
        let prop=document.createElement('li');
        prop.textContent="Properties";
        prop.onclick=()=>{
          alert("Directory: "+p);
          closeContextMenu();
        };
        menu.appendChild(prop);
      } else {
        // File: "Delete File"
        let del=document.createElement('li');
        del.textContent="Delete File";
        del.onclick=()=>{
          kernel.commands.rm([name], shell);
          closeContextMenu();
          populate();
        };
        menu.appendChild(del);
  
        let prop=document.createElement('li');
        prop.textContent="Properties";
        prop.onclick=()=>{
          alert("File: "+p);
          closeContextMenu();
        };
        menu.appendChild(prop);
      }
  
      menu.style.display='block';
      menu.style.left=ev.clientX+'px';
      menu.style.top=ev.clientY+'px';
    }
  
    w.content.appendChild(list);
    populate();
  
    const id='fileexplorer:'+Math.random().toString(36).substr(2,5);
    return {id, element:w.element};
  }