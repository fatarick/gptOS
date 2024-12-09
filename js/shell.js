// shell.js: Internal shell commands + integration with kernel.commands

class Shell {
    constructor() {
      this.cwd = '/';
    }
    runCommand(line) {
      const args = line.trim().split(' ').filter(a=>a);
      if (args.length===0) return "";
      const cmd = args[0];
  
      // First check shell built-ins
      const builtIn = this.handleBuiltIn(cmd, args.slice(1));
      if (builtIn !== null) return builtIn;
  
      // If not found in built-ins, check kernel.commands
      if (kernel.commands[cmd]) {
        return kernel.commands[cmd](args.slice(1), this);
      }
  
      return cmd+": command not found";
    }
  
    handleBuiltIn(cmd, args) {
      switch(cmd) {
        case 'ls': return this.cmdLs(args);
        case 'cd': return this.cmdCd(args);
        case 'cat': return this.cmdCat(args);
        case 'echo': return args.join(' ');
        case 'version': return kernel.commands.version();
        case 'help': return "Commands: ls, cd, cat, echo, help, version, mkdir, rmdir, touch, rm, mv, cp, kill";
        default:
          return null;
      }
    }
  
    fsJoin(path) {
      if (path.startsWith('/')) return this.normalize(path);
      return this.normalize(this.cwd + '/' + path);
    }
    normalize(path) {
      const parts = [];
      for (let p of path.split('/')) {
        if (!p || p=='.') continue;
        if (p==='..') {
          if (parts.length) parts.pop();
        } else {
          parts.push(p);
        }
      }
      return '/' + parts.join('/');
    }
    cmdLs(args) {
      let p = args[0]||this.cwd;
      p = this.fsJoin(p);
      if (!fsIsDir(p)) return "ls: "+p+": No such directory";
      const {dirs,files}=fsListDir(p);
      return "Directories:\n"+dirs.join('\n')+"\nFiles:\n"+files.join('\n');
    }
    cmdCd(args) {
      if (args.length===0) {
        this.cwd = '/'; return "";
      }
      let p=this.fsJoin(args[0]);
      if (!fsIsDir(p)) return "cd: "+args[0]+": No such directory";
      this.cwd = p;
      return "";
    }
    cmdCat(args) {
      if (args.length===0) return "cat: missing file";
      let p=this.fsJoin(args[0]);
      let c=fsReadFile(p);
      if (c===null) return "cat: "+args[0]+": No such file";
      return c;
    }
  }
