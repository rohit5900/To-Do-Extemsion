
let input = document.getElementById("taskInput");
let addBtn = document.getElementById("addBtn");
let list = document.getElementById("taskList");

function render(tasks) {
  list.innerHTML = "";
  tasks.forEach((task, index) => {
    let li = document.createElement("li");
    li.classList.add("task-item");

    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed || false;
    checkbox.className = "task-checkbox";
    checkbox.onchange = () => {
      task.completed = checkbox.checked;
      chrome.storage.sync.set({ tasks });
      render(tasks);
    };

    let span = document.createElement("span");
    span.textContent = task.text;
    span.className = "task-text";
    if (task.completed) {
      span.classList.add("completed");
    }

    let del = document.createElement("button");
    del.className = "delete";
    del.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
    del.onclick = () => {
      tasks.splice(index, 1);
      chrome.storage.sync.set({ tasks });
      render(tasks);
    };

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(del);
    list.appendChild(li);
  });
}

chrome.storage.sync.get(["tasks"], r => {
  let tasks = r.tasks || [];
  // Migrate old string tasks to objects if necessary
  tasks = tasks.map(task => typeof task === 'string' ? { text: task, completed: false } : task);
  chrome.storage.sync.set({ tasks }); // Save migrated tasks
  render(tasks);
});

addBtn.onclick = () => {
  let txt = input.value.trim();
  if (!txt) return;
  chrome.storage.sync.get(["tasks"], r => {
    let tasks = r.tasks || [];
    tasks = tasks.map(task => typeof task === 'string' ? { text: task, completed: false } : task);
    tasks.push({ text: txt, completed: false });
    chrome.storage.sync.set({ tasks });
    render(tasks);
  });
  input.value = "";
};
