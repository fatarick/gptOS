window.appRegistry = []; 
var version = '1.2.1';

window.kernel = {
  registerApp: function(id, name, createFunc) {
    window.appRegistry.push({ id, name, createFunc });
  },
  getApps: function() {
    return window.appRegistry;
  },
  
  commands: {
    'version': function(args, shell) {
      return "gptOS version " + version;
    },
    'kill': function(args, shell) {
      if (args.length === 0) return "kill: missing process ID";
      const appId = args[0];
      const app = window.apps.find(app => app.id === appId);
      if (!app) return `kill: no process found with ID '${appId}'`;

      app.element.remove();
      window.apps = window.apps.filter(a => a.id !== appId);
      return `Process '${appId}' has been terminated.`;
    },
    'mkdir': function(args, shell) {
      if (args.length === 0) return "mkdir: missing directory name";
      let dirName = args[0];
      let p = shell.fsJoin(dirName);
      if (fsGetNode(p) !== null) return "mkdir: cannot create directory, already exists";
      let parentPath = p.substring(0, p.lastIndexOf('/')) || '/';
      let parentNode = fsGetNode(parentPath);
      if (!parentNode || typeof parentNode !== 'object') return "mkdir: cannot create directory at " + parentPath;
      let dName = p.substring(p.lastIndexOf('/') + 1);
      parentNode[dName] = {};
      return "";
    },
    'rmdir': function(args, shell) {
      if (args.length === 0) return "rmdir: missing directory name";
      let dirName = args[0];
      let p = shell.fsJoin(dirName);
      let node = fsGetNode(p);
      if (!node || typeof node !== 'object') return "rmdir: directory not found";
      if (Object.keys(node).length > 0) return "rmdir: directory not empty";
      let parentPath = p.substring(0, p.lastIndexOf('/')) || '/';
      let parentNode = fsGetNode(parentPath);
      let dName = p.substring(p.lastIndexOf('/') + 1);
      delete parentNode[dName];
      return "";
    },
    'touch': function(args, shell) {
      if (args.length === 0) return "touch: missing file name";
      let fName = args[0];
      let p = shell.fsJoin(fName);
      let parentPath = p.substring(0, p.lastIndexOf('/')) || '/';
      let parentNode = fsGetNode(parentPath);
      if (!parentNode || typeof parentNode !== 'object') return "touch: cannot create file";
      let fileN = p.substring(p.lastIndexOf('/') + 1);
      parentNode[fileN] = "";
      return "";
    },
    'rm': function(args, shell) {
      if (args.length === 0) return "rm: missing file name";
      let fName = args[0];
      let p = shell.fsJoin(fName);
      let node = fsGetNode(p);
      if (node === null || typeof node === 'object') return "rm: no such file";
      let parentPath = p.substring(0, p.lastIndexOf('/')) || '/';
      let parentNode = fsGetNode(parentPath);
      let fileN = p.substring(p.lastIndexOf('/') + 1);
      delete parentNode[fileN];
      return "";
    },
    'mv': function(args, shell) {
      if (args.length < 2) return "mv: missing source or destination";
      let sourcePath = shell.fsJoin(args[0]);
      let destPath = shell.fsJoin(args[1]);
      let sourceNode = fsGetNode(sourcePath);
      if (!sourceNode) return `mv: cannot stat '${args[0]}': No such file or directory`;

      let destParentPath = destPath.substring(0, destPath.lastIndexOf('/')) || '/';
      let destParentNode = fsGetNode(destParentPath);
      if (!destParentNode || typeof destParentNode !== 'object') return `mv: cannot move to '${args[1]}': No such directory`;

      let destName = destPath.substring(destPath.lastIndexOf('/') + 1);
      destParentNode[destName] = sourceNode;

      let sourceParentPath = sourcePath.substring(0, sourcePath.lastIndexOf('/')) || '/';
      let sourceParentNode = fsGetNode(sourceParentPath);
      let sourceName = sourcePath.substring(sourcePath.lastIndexOf('/') + 1);
      delete sourceParentNode[sourceName];

      return "";
    },
    'cp': function(args, shell) {
      if (args.length < 2) return "cp: missing source or destination";
      let sourcePath = shell.fsJoin(args[0]);
      let destPath = shell.fsJoin(args[1]);
      let sourceNode = fsGetNode(sourcePath);
      if (!sourceNode) return `cp: cannot stat '${args[0]}': No such file or directory`;

      let destParentPath = destPath.substring(0, destPath.lastIndexOf('/')) || '/';
      let destParentNode = fsGetNode(destParentPath);
      if (!destParentNode || typeof destParentNode !== 'object') return `cp: cannot copy to '${args[1]}': No such directory`;

      let destName = destPath.substring(destPath.lastIndexOf('/') + 1);
      destParentNode[destName] = JSON.parse(JSON.stringify(sourceNode));

      return "";
    }
  }
};
