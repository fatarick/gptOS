let shell = new Shell();
window.apps = [];
let zIndexCounter = 100;

const startMenu = document.getElementById('start-menu');
const startButton = document.getElementById('start-button');
const runningApps = document.getElementById('running-apps');
const clockLabel = document.getElementById('clock');
const startMenuList = document.getElementById('start-menu-list');
const contextMenu = document.getElementById('context-menu');

document.addEventListener('DOMContentLoaded', ()=>{
  loadStartMenu();
  updateClock();
  setInterval(updateClock, 1000);
});

startButton.addEventListener('click', (e) => {
  e.stopPropagation();
  if (startMenu.style.display === 'none' || startMenu.style.display === '') {
    startMenu.style.display = 'block';
  } else {
    startMenu.style.display = 'none';
  }
});

startMenu.addEventListener('click', (e)=>{
  e.stopPropagation();
});

document.body.addEventListener('click', (e)=>{
  if (e.target !== startButton && !startMenu.contains(e.target)) {
    startMenu.style.display='none';
  }
});

function loadStartMenu() {
  startMenuList.innerHTML='';
  const appsList = kernel.getApps();
  console.log("Loaded apps:", appsList);
  appsList.forEach(app=>{
    let li=document.createElement('li');
    li.textContent=app.name;
    li.setAttribute('data-app-id',app.id);
    li.onclick=(ev)=>{
      ev.stopPropagation();
      openApp(app.id);
      startMenu.style.display='none';
    };
    startMenuList.appendChild(li);
  });
}

function openApp(appId) {
  const appsList = kernel.getApps();
  const appInfo = appsList.find(a=>a.id===appId);
  if (!appInfo) {
    console.log("App not found:", appId);
    return;
  }
  let w = appInfo.createFunc(shell);
  if (!w || !w.element) {
    console.error("App did not return a valid window object:", appId);
    return;
  }
  window.apps.push(w);
  updateTaskbar();
}

function updateTaskbar() {
  runningApps.innerHTML='';
  for (let a of window.apps) {
    let btn=document.createElement('button');
    btn.textContent=a.id;
    btn.onclick=()=>focusWindow(a);
    runningApps.appendChild(btn);
    a.button=btn;
  }
}

function focusWindow(a) {
  a.element.style.zIndex = ++zIndexCounter;
  a.element.style.display='block';
}

function updateClock() {
  clockLabel.textContent=new Date().toLocaleTimeString();
}

function createWindow(title) {
  let w = document.createElement('div');
  w.className='window';
  w.style.top='100px';
  w.style.left='100px';
  w.style.zIndex=++zIndexCounter;

  let titleBar = document.createElement('div');
  titleBar.className='title-bar';

  // Title/Buttons layout
  let titleText=document.createElement('div');
  titleText.className='title-text';
  titleText.textContent=title;

  let btnContainer=document.createElement('div');
  btnContainer.className='window-buttons';

  let minBtn=document.createElement('button');minBtn.textContent='–';
  minBtn.onclick=(e)=>{w.style.display='none';};
  btnContainer.appendChild(minBtn);

  let maxBtn=document.createElement('button');maxBtn.textContent='□';
  maxBtn.onclick=(e)=>{
    if (w.classList.contains('maximized')) {
      w.classList.remove('maximized');
      w.style.width='400px'; w.style.height='300px';
    } else {
      w.classList.add('maximized');
      w.style.top='0'; w.style.left='0'; 
      w.style.width=window.innerWidth+'px'; w.style.height=(window.innerHeight-40)+'px';
    }
  };
  btnContainer.appendChild(maxBtn);

  let closeBtn=document.createElement('button');closeBtn.textContent='✕';
  closeBtn.onclick=(e)=>closeAppByElement(w);
  btnContainer.appendChild(closeBtn);

  // Adjust titleBar
  titleBar.style.justifyContent='space-between';
  titleBar.appendChild(titleText);
  titleBar.appendChild(btnContainer);

  let content=document.createElement('div');
  content.className='window-content';

  w.appendChild(titleBar);
  w.appendChild(content);
  document.body.appendChild(w);

  let mousePos=null;
  titleBar.addEventListener('mousedown', ev=>{
    if (w.classList.contains('maximized')) return;
    mousePos = {x:ev.clientX, y:ev.clientY, left:parseInt(w.style.left), top:parseInt(w.style.top)};
    document.addEventListener('mousemove', moveWin);
    document.addEventListener('mouseup', upWin);
  });
  function moveWin(ev) {
    if (!mousePos) return;
    w.style.left=(mousePos.left+(ev.clientX-mousePos.x))+'px';
    w.style.top=(mousePos.top+(ev.clientY-mousePos.y))+'px';
  }
  function upWin(ev) {
    mousePos=null;
    document.removeEventListener('mousemove', moveWin);
    document.removeEventListener('mouseup', upWin);
  }

  return {id:title.toLowerCase()+':'+Math.random().toString(36).substr(2,5), element:w, content:content};
}

function closeAppByElement(el) {
  window.apps=window.apps.filter(a=>a.element!==el);
  document.body.removeChild(el);
  updateTaskbar();
}