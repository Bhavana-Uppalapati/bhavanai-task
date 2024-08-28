// Initial Setup
document.addEventListener('DOMContentLoaded', () => {
    init();
  });
  
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const appDiv = document.getElementById('app');
  
  // Initialize the Application
  function init() {
    renderTaskList();
    setupRouting();
  }
  
  // Render the Task List View
  function renderTaskList() {
    appDiv.innerHTML = `
      <h1>Task List</h1>
      <button onclick="navigateTo('/add')">Add New Task</button>
      <div id="task-list">
        ${tasks.map(task => `
          <div class="task">
            <span>${task.title}</span>
            <button onclick="navigateTo('/edit/${task.id}')">Edit</button>
            <button onclick="deleteTask(${task.id})">Delete</button>
          </div>
        `).join('')}
      </div>
    `;
  }
  
  // Render the Add/Edit Task Form View
  function renderTaskForm(task = {}) {
    const isEdit = Boolean(task.id);
    appDiv.innerHTML = `
      <h1>${isEdit ? 'Edit Task' : 'Add Task'}</h1>
      <form id="task-form">
        <input type="text" id="task-title" placeholder="Task Title" value="${task.title || ''}" required />
        <button type="submit">${isEdit ? 'Update' : 'Add'}</button>
      </form>
      <button onclick="navigateTo('/')">Back</button>
    `;
  
    document.getElementById('task-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('task-title').value;
      if (isEdit) {
        updateTask(task.id, title);
      } else {
        addTask(title);
      }
      navigateTo('/');
    });
  }
  
  // Add Task
  function addTask(title) {
    const newTask = {
      id: Date.now(),
      title
    };
    tasks.push(newTask);
    saveTasks();
  }
  
  // Update Task
  function updateTask(id, title) {
    tasks = tasks.map(task => task.id === id ? { ...task, title } : task);
    saveTasks();
  }
  
  // Delete Task
  function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTaskList();
  }
  
  // Save Tasks to LocalStorage
  function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
  
  // Navigation
  function navigateTo(path) {
    history.pushState(null, null, path);
    router();
  }
  
  // Router Setup
  function setupRouting() {
    window.addEventListener('popstate', router);
    router();
  }
  
  // Router Logic
  function router() {
    const path = window.location.pathname;
    if (path === '/') {
      renderTaskList();
    } else if (path === '/add') {
      renderTaskForm();
    } else if (path.startsWith('/edit/')) {
      const taskId = parseInt(path.split('/').pop());
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        renderTaskForm(task);
      } else {
        navigateTo('/');
      }
    } else {
      renderTaskList();
    }
  }
  