kernel.registerApp('wallpaper','Wallpaper', function() {
    return createSettingsWindow();
  }, 'assets/icons/image.svg');
  
  w.element.style.resize = 'none'; // Disable resizing
  w.element.style.overflow = 'hidden'; // Prevent showing resize handles

  function createSettingsWindow() {
    const w=createWindow("Wallpaper");
  
    let desc=document.createElement('div');
    desc.textContent="Change Desktop Color:";
    w.content.appendChild(desc);
  
    let btn=document.createElement('button');
    btn.className='color-btn';
    btn.textContent='Pick Color';
    btn.onclick=()=>{
      let c=prompt("Enter a color (e.g. #123456 or red):","#0066cc");
      if (c) {
        document.body.style.background=c;
        document.body.style.backgroundSize = '';
        document.body.style.backgroundImage = '';
      }
    };
    w.content.appendChild(btn);
  
    // Add wallpaper function
    let wallpaperLabel=document.createElement('div');
    wallpaperLabel.textContent="Set Wallpaper URL:";
    w.content.appendChild(wallpaperLabel);
  
    let wallpaperBtn=document.createElement('button');
    wallpaperBtn.className='color-btn';
    wallpaperBtn.textContent='Set Wallpaper';
    wallpaperBtn.onclick=()=>{
      let url=prompt("Enter wallpaper image URL:");
      if (url) {
        document.body.style.background = `url('${url}') no-repeat center center fixed`;
        document.body.style.backgroundSize = 'cover';
      }
    };
    w.content.appendChild(wallpaperBtn);
  
    const id='settings:'+Math.random().toString(36).substr(2,5);
    return {id, element:w.element};
  }