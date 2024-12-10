window.appRegistry = [];
const version = '1.2.2';

window.kernel = {
  version: version,

  // Register a new application
  registerApp: function (id, name, createFunc) {
    this.appRegistry.push({ id, name, createFunc });
  },

  // Get a list of registered applications
  getApps: function () {
    return this.appRegistry;
  },

  commands: {
    // Display gptOS version
    'version': function (args, shell) {
      return "gptOS version " + kernel.version;
    },

    // Kill a process by its ID
    'kill': function (args, shell) {
      if (args.length === 0) return "kill: missing process ID";
      const appId = args[0];
      const app = window.apps.find(app => app.id === appId);
      if (!app) return `kill: no process found with ID '${appId}'`;

      app.element.remove();
      window.apps = window.apps.filter(a => a.id !== appId);
      return `Process '${appId}' has been terminated.`;
    },

    // Create a new directory
    'mkdir': function (args, shell) {
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

    // Remove an empty directory
    'rmdir': function (args, shell) {
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

    // Create a new file
    'touch': function (args, shell) {
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

    // Remove a file or directory with support for -rf
    'rm': function (args, shell) {
      if (args.length === 0) return "rm: missing file or directory name";

      const flags = args.filter(arg => arg.startsWith('-'));
      const targets = args.filter(arg => !arg.startsWith('-'));

      if (targets.length === 0) return "rm: missing file or directory name";

      const recursive = flags.includes('-rf');
      let result = "";

      targets.forEach(target => {
        let p = shell.fsJoin(target);
        let node = fsGetNode(p);

        if (!node) {
          result += `rm: cannot remove '${target}': No such file or directory\n`;
        } else if (typeof node === 'object' && !recursive) {
          result += `rm: cannot remove '${target}': Is a directory\n`;
        } else {
          let parentPath = p.substring(0, p.lastIndexOf('/')) || '/';
          let parentNode = fsGetNode(parentPath);
          let name = p.substring(p.lastIndexOf('/') + 1);

          if (parentNode && typeof parentNode === 'object') {
            delete parentNode[name];
            result += `Removed '${target}'\n`;
          } else {
            result += `rm: cannot remove '${target}': Permission denied\n`;
          }
        }
      });

      return result.trim();
    },

    // Move a file or directory
    'mv': function (args, shell) {
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

    // Copy a file or directory
    'cp': function (args, shell) {
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