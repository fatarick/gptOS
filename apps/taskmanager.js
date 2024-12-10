kernel.registerApp('taskmanager','Task Manager', function() {
    return createTaskManagerWindow();
  });
  
  function createTaskManagerWindow() {
    const w=createWindow("Task Manager");
    let list=document.createElement('ul');
    list.style.listStyle='none';
    list.style.padding='0';
    list.style.margin='0';
  
    let taskManagerWindowObj = {id:'taskmanager:'+Math.random().toString(36).substr(2,5), element:w.element};
  
    taskManagerWindowObj.populate = function() {
      list.innerHTML='';
      for (let app of window.apps) {
        let li=document.createElement('li');
        li.textContent=app.id;
        li.style.cursor='pointer';
        li.oncontextmenu=(ev)=>showTaskContextMenu(ev, app);
        list.appendChild(li);
      }
    }
  
    function showTaskContextMenu(ev, app) {
      ev.preventDefault();
      closeContextMenu();
      let menu=document.getElementById('context-menu');
      menu.innerHTML='';
  
      let closeItem=document.createElement('li');
      closeItem.textContent="Close App";
      closeItem.onclick=()=>{
        closeAppByElement(app.element);
        closeContextMenu();
        taskManagerWindowObj.populate();
      };
      menu.appendChild(closeItem);
  
      menu.style.display='block';
      menu.style.left=ev.clientX+'px';
      menu.style.top=ev.clientY+'px';
    }
  
    w.content.appendChild(list);
  
    taskManagerWindowObj.populate();
    window.taskManagerWindowRef = taskManagerWindowObj;
    return taskManagerWindowObj;
  }