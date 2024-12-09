// Register the Task Manager application
kernel.registerApp('taskmanager', 'Task Manager', function () {
  return createTaskManagerWindow();
});

// Create Task Manager Window
function createTaskManagerWindow() {
  const w = createWindow("Task Manager");

  // Create the list to display running apps
  const list = document.createElement('ul');
  list.style.listStyle = 'none';
  list.style.padding = '0';
  list.style.margin = '0';

  // Create "Kill Task" button
  const killTaskButton = document.createElement('button');
  killTaskButton.textContent = 'Kill Task';
  killTaskButton.style.marginBottom = '10px';
  killTaskButton.style.padding = '5px';
  killTaskButton.disabled = true;

  let selectedApp = null;

  // Kill the selected task
  killTaskButton.addEventListener('click', () => {
      if (selectedApp) {
          closeAppByElement(selectedApp.element);
          selectedApp = null;
          killTaskButton.disabled = true;
          taskManagerWindowObj.populate();
      }
  });

  // Task Manager object
  const taskManagerWindowObj = {
      id: 'taskmanager:' + Math.random().toString(36).substr(2, 5),
      element: w.element,
  };

  // Populate the Task Manager list with running apps
  taskManagerWindowObj.populate = function () {
      list.innerHTML = '';
      for (const app of window.apps) {
          const li = document.createElement('li');
          li.textContent = app.id;
          li.style.cursor = 'pointer';

          // Highlight selected app
          li.addEventListener('click', () => {
              selectedApp = app;
              killTaskButton.disabled = false;
          });

          list.appendChild(li);
      }
  };

  // Periodically check running instances
  taskManagerWindowObj.checkInstances = function () {
      for (const app of window.apps) {
          try {
              // Example check: Verify if the app's element is still in the DOM
              if (!document.body.contains(app.element)) {
                  console.warn(`App ${app.id} is no longer in the DOM.`);
              }
          } catch (error) {
              console.error(`Error checking app ${app.id}: ${error.message}`);
          }
      }
  };

  // Start periodic checks every second
  taskManagerWindowObj.startChecking = function () {
      taskManagerWindowObj.interval = setInterval(() => {
          taskManagerWindowObj.checkInstances();
      }, 1000);
  };

  // Stop periodic checks
  taskManagerWindowObj.stopChecking = function () {
      if (taskManagerWindowObj.interval) {
          clearInterval(taskManagerWindowObj.interval);
          taskManagerWindowObj.interval = null;
      }
  };

  // Add the "Kill Task" button and list to the window
  w.content.appendChild(killTaskButton);
  w.content.appendChild(list);

  // Populate the list initially
  taskManagerWindowObj.populate();

  // Start checking instances
  taskManagerWindowRef = taskManagerWindowObj;
  taskManagerWindowObj.startChecking();

  return taskManagerWindowObj;
}

// Close an app by removing its element and reference
function closeAppByElement(element) {
  // Remove the app's DOM element
  element.remove();

  // Remove the app from the apps array
  window.apps = window.apps.filter((app) => app.element !== element);
}

// Example `createWindow` function to create app windows
function createWindow(title) {
  const windowElement = document.createElement('div');
  windowElement.className = 'window';
  windowElement.style.position = 'absolute';
  windowElement.style.width = '400px';
  windowElement.style.height = '300px';
  windowElement.style.border = '1px solid #666';
  windowElement.style.backgroundColor = '#222';
  windowElement.style.color = '#fff';
  windowElement.style.borderRadius = '10px';
  windowElement.style.padding = '10px';
  windowElement.style.overflow = 'hidden';

  const titleBar = document.createElement('div');
  titleBar.className = 'title-bar';
  titleBar.style.backgroundColor = '#333';
  titleBar.style.padding = '5px';
  titleBar.style.cursor = 'move';
  titleBar.textContent = title;

  const content = document.createElement('div');
  content.className = 'window-content';
  content.style.flex = '1';
  content.style.padding = '5px';
  content.style.overflow = 'auto';

  windowElement.appendChild(titleBar);
  windowElement.appendChild(content);
  document.body.appendChild(windowElement);

  // Make the window draggable
  titleBar.onmousedown = (e) => {
      const shiftX = e.clientX - windowElement.getBoundingClientRect().left;
      const shiftY = e.clientY - windowElement.getBoundingClientRect().top;
      document.onmousemove = (event) => {
          windowElement.style.left = `${event.pageX - shiftX}px`;
          windowElement.style.top = `${event.pageY - shiftY}px`;
      };
      document.onmouseup = () => {
          document.onmousemove = null;
          document.onmouseup = null;
      };
  };

  return { element: windowElement, content };
}
