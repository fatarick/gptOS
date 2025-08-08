import { createWindow, closeAppByElement } from '../js/main.js';

// Register the Task Manager application
kernel.registerApp('taskmanager', 'Task Manager', function () {
  return createTaskManagerWindow();
});

// Create Task Manager Window
function createTaskManagerWindow() {
  const w = createWindow("Task Manager");
  w.element.style.resize = 'none'; // Disable resizing
  w.element.style.overflow = 'hidden'; // Prevent showing resize handles

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
