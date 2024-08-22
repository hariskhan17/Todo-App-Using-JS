const inputBox = document.getElementById('input-box');
const listContainer = document.getElementById('list-container');
const taskCount = document.getElementById('task-count');

// Function to add a new task
function addTask() {
    if (inputBox.value === '') {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "You must write something!",
        });
    } else {
        let li = document.createElement("li");
        li.innerHTML = inputBox.value;
        li.setAttribute('draggable', true);  // Make list items draggable
        listContainer.appendChild(li);

        let span = document.createElement("span");
        span.innerHTML = "\u00d7";  // Close button
        li.appendChild(span);

        // Enable editing by double-clicking the task
        li.addEventListener('dblclick', function () {
            editTask(li);
        });

        updateTaskCount();  // Update task count
        saveData();  // Save data to localStorage
    }
    inputBox.value = '';
}

// Function to edit a task
function editTask(task) {
    Swal.fire({
        title: 'Edit your task',
        input: 'text',
        inputValue: task.firstChild.textContent,
        showCancelButton: true,
    }).then((result) => {
        if (result.isConfirmed && result.value.trim() !== '') {
            task.firstChild.textContent = result.value;
            saveData();  // Save edited task to localStorage
        }
    });
}

// Event listener for task actions (mark complete, delete)
listContainer.addEventListener("click", function (e) {
    if (e.target.tagName === "LI") {
        e.target.classList.toggle("checked");
        saveData();  // Save status to localStorage
    } else if (e.target.tagName === "SPAN") {
        e.target.parentElement.remove();
        updateTaskCount();  // Update task count after deletion
        saveData();  // Save to localStorage
    }
}, false);

// Function to update the task count
function updateTaskCount() {
    const tasks = listContainer.getElementsByTagName('li');
    const pendingTasks = Array.from(tasks).filter(task => !task.classList.contains('checked')).length;
    taskCount.textContent = `Pending Tasks: ${pendingTasks}`;
}

// Clear all tasks
function clearTasks() {
    Swal.fire({
        title: 'Are you sure?',
        text: "This will clear all tasks!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, clear it!',
    }).then((result) => {
        if (result.isConfirmed) {
            listContainer.innerHTML = '';
            updateTaskCount();  // Update task count
            saveData();  // Clear saved data in localStorage
        }
    });
}

// Function to save tasks to localStorage
function saveData() {
    localStorage.setItem("data", listContainer.innerHTML);
    updateTaskCount();  // Update task count after saving
}

// Function to load tasks from localStorage
function showTask() {
    listContainer.innerHTML = localStorage.getItem("data");
    updateTaskCount();  // Update task count after loading
}

// Load tasks when the page is first loaded
showTask();
