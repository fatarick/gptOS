window.appRegistry = []; 

window.kernel = {
  registerApp: function(id, name, createFunc) {
    window.appRegistry.push({id, name, createFunc});
  },
  getApps: function() {
    return window.appRegistry;
  },
  commands: {
    'version': function(args, shell) {
      return"gptOS 1.0 Credits to chatGPT";
    },
    'mkdir': function(args, shell) {
      if (args.length===0) return "mkdir: missing directory name";
      let dirName = args[0];
      let p = shell.fsJoin(dirName);
      if (fsGetNode(p) !== null) return "mkdir: cannot create directory, already exists";
      let parentPath = p.substring(0,p.lastIndexOf('/')) || '/';
      let parentNode = fsGetNode(parentPath);
      if (!parentNode || typeof parentNode !== 'object') return "mkdir: cannot create directory at "+parentPath;
      let dName = p.substring(p.lastIndexOf('/')+1);
      parentNode[dName] = {};
      return "";
    },
    'rmdir': function(args, shell) {
      if (args.length===0) return "rmdir: missing directory name";
      let dirName = args[0];
      let p = shell.fsJoin(dirName);
      let node = fsGetNode(p);
      if (!node || typeof node !== 'object') return "rmdir: directory not found";
      if (Object.keys(node).length>0) return "rmdir: directory not empty";
      let parentPath = p.substring(0,p.lastIndexOf('/')) || '/';
      let parentNode = fsGetNode(parentPath);
      let dName = p.substring(p.lastIndexOf('/')+1);
      delete parentNode[dName];
      return "";
    },
    'touch': function(args, shell) {
      if (args.length===0) return "touch: missing file name";
      let fName = args[0];
      let p = shell.fsJoin(fName);
      let parentPath = p.substring(0,p.lastIndexOf('/')) || '/';
      let parentNode = fsGetNode(parentPath);
      if (!parentNode || typeof parentNode !== 'object') return "touch: cannot create file";
      let fileN = p.substring(p.lastIndexOf('/')+1);
      parentNode[fileN] = "";
      return "";
    },
    'rm': function(args, shell) {
      if (args.length===0) return "rm: missing file name";
      let fName = args[0];
      let p = shell.fsJoin(fName);
      let node = fsGetNode(p);
      if (node===null || typeof node==='object') return "rm: no such file";
      let parentPath = p.substring(0,p.lastIndexOf('/')) || '/';
      let parentNode = fsGetNode(parentPath);
      let fileN = p.substring(p.lastIndexOf('/')+1);
      delete parentNode[fileN];
      return "";
    },
    'git': function(args, shell) {
      if (args.length===0) return "git: no command specified";
      let subcmd = args[0];
      if (subcmd==='status') {
        return "On branch main\nNothing to commit, working tree clean";
      } else if (subcmd==='commit') {
        return "[mock commit] Changes committed successfully!";
      } else {
        return "git: unknown subcommand "+subcmd;
      }
    }
  }
};
