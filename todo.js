// ---------------------------
// To-Do List (Vanilla JS)
// ---------------------------

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let filter = "all"; // default filter

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const prioritySelect = document.getElementById("priority");
const taskList = document.getElementById("taskList");
const message = document.getElementById("message");
const totalCount = document.getElementById("totalCount");
const doneCount = document.getElementById("doneCount");
const leftCount = document.getElementById("leftCount");
const clearCompletedBtn = document.getElementById("clearCompleted");
const filterRadios = document.querySelectorAll(".filters input");

// ✅ Save tasks to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ✅ Render tasks with filter
function renderTasks() {
   taskList.innerHTML = "";

  let filteredTasks = tasks.filter((task) => {
    if (filter === "active")
       return !task.completed;
    if (filter === "completed") 
      return task.completed;
    return true; // "all"
  });

  filteredTasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = "task";

    // ✅ Checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => {
      task.completed = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    // ✅ Task text
    const span = document.createElement("span");
    span.textContent = task.text;
    span.style.margin = "0 10px";
    if (task.completed) span.style.textDecoration = "line-through";

    // ✅ Priority (color badge)
    const priority = document.createElement("span");
    priority.textContent = task.priority;
    priority.className = "priority " + task.priority;

    // ✅ Edit button
    const editBtn = document.createElement("button");
    editBtn.textContent = "✏️ Edit";
    editBtn.addEventListener("click", () => {
      const newText = prompt("Edit task:", task.text);
      if (newText && newText.trim() !== "") {
        task.text = newText.trim();
        saveTasks();
        renderTasks();
      }
    });

    // ✅ Delete button
    const delBtn = document.createElement("button");
    delBtn.textContent = "🗑️ Delete";
    delBtn.addEventListener("click", () => {
      tasks = tasks.filter((t) => t.id !== task.id);
      saveTasks();
      renderTasks();
    });

    
    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(priority);
    li.appendChild(editBtn);
    li.appendChild(delBtn);

    taskList.appendChild(li);
  });

  updateStats();
}

// ✅ Update footer counters
function updateStats() {
  const total = tasks.length;
  const done = tasks.filter((t) => t.completed).length;
  const left = total - done;

  totalCount.textContent = total;
  doneCount.textContent = done;
  leftCount.textContent = left;
}

// ✅ Add new task
taskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const text = taskInput.value.trim();
  const priority = prioritySelect.value;

  if (text === "") return;

  const newTask = {
    id: Date.now(),
    text,
    completed: false,
    priority,
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();

  message.textContent = "✅ Task added!";
  taskInput.value = "";
});

// ✅ Filter change
filterRadios.forEach((radio) => {
  radio.addEventListener("change", (e) => {
    filter = e.target.value;
    renderTasks();
  });
});

// ✅ Clear Completed
clearCompletedBtn.addEventListener("click", () => {
  tasks = tasks.filter((t) => !t.completed);
  saveTasks();
  renderTasks();
  
});

// ✅ First render
renderTasks();
