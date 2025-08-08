// fs.js: Virtual File System in-memory

const fs = {
    '/': {
      'home': {
        'readme.txt': "Welcome to the VOS!",
        'notes.txt': "Some notes..."
      },
      'docs': {},
      'bin': {}
    }
  };
  
  function fsGetNode(path) {
    const parts = path.split('/').filter(p=>p);
    let node = fs['/'];
    for (let p of parts) {
      if (!(p in node)) return null;
      node = node[p];
    }
    return node;
  }
  
  function fsIsDir(path) {
    const n = fsGetNode(path);
    return n && typeof n === 'object';
  }
  
  function fsListDir(path) {
    const n = fsGetNode(path);
    if (!n || typeof n !== 'object') return {dirs:[],files:[]};
    const dirs = [];
    const files = [];
    for (let k in n) {
      if (typeof n[k] === 'object') dirs.push(k+'/');
      else files.push(k);
    }
    return {dirs, files};
  }
  
  function fsReadFile(path) {
    const p = fsGetNode(path);
    if (typeof p === 'string') return p;
    return null;
  }
  
  function fsWriteFile(path, content) {
    let parts = path.split('/').filter(p=>p);
    let fname = parts.pop();
    let dirpath = '/' + parts.join('/');
    if (dirpath === '') dirpath='/';
    let dnode = fsGetNode(dirpath);
    if (dnode && typeof dnode === 'object') {
      dnode[fname] = content;
    }
  }

  function fsDeleteFile(path) {
    let parts = path.split('/').filter(p=>p);
    let fname = parts.pop();
    let dirpath = '/' + parts.join('/');
    if (dirpath === '') dirpath = '/';
    let dnode = fsGetNode(dirpath);
    if (!dnode || typeof dnode !== 'object' || !(fname in dnode)) {
      console.error('fsDeleteFile: path not found', path);
      return false;
    }
    delete dnode[fname];
    return true;
  }

  if (typeof module !== 'undefined') {
    module.exports = {
      fsGetNode,
      fsIsDir,
      fsListDir,
      fsReadFile,
      fsWriteFile,
      fsDeleteFile
    };
  }
