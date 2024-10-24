document.addEventListener('DOMContentLoaded', function() {
    // Cache DOM elements
    const addTaskButton = document.getElementById('add-task');
    const taskList = document.getElementById('task-list');
    const newTaskInput = document.getElementById('new-task');
    const bgColorSelect = document.getElementById('bg-color');
    const fontSizeInput = document.getElementById('font-size');
    const fontSizeValue = document.getElementById('font-size-value');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const fontFamilySelect = document.getElementById('font-family');

    // Initialize app
    loadTasks();
    loadSettings();

    // Task Management Functions
    function addTask() {
        const taskText = newTaskInput.value.trim();
        if (taskText === '') {
            Swal.fire('Error!', 'Please enter a task!', 'error');
            return;
        }

        createTaskElement(taskText);
        saveTasks();
        newTaskInput.value = '';
    }

    function createTaskElement(text, completed = false) {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="task-text">${text}</span>
            <div class="task-buttons">
                <button class="mark-complete" title="Mark as complete">✔</button>
                <button class="edit-task" title="Edit task"><i class="fas fa-pencil-alt"></i></button>
                <button class="delete-task" title="Delete task">✖</button>
            </div>`;

        if (completed) {
            li.classList.add('completed');
        }
        
        taskList.appendChild(li);
    }

    function handleDeleteTask(taskItem) {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                taskItem.remove();
                saveTasks();
                Swal.fire('Deleted!', 'Your task has been deleted.', 'success');
            }
        });
    }

    function handleEditTask(taskItem) {
        const taskText = taskItem.querySelector('.task-text');
        Swal.fire({
            title: 'Edit task',
            input: 'text',
            inputValue: taskText.textContent,
            showCancelButton: true,
            inputValidator: (value) => {
                if (!value.trim()) {
                    return 'You need to write something!';
                }
            }
        }).then((result) => {
            if (result.isConfirmed) {
                taskText.textContent = result.value;
                saveTasks();
            }
        });
    }

    function handleToggleComplete(taskItem) {
        taskItem.classList.toggle('completed');
        saveTasks();
        const taskCompleted = taskItem.classList.contains('completed');
        Swal.fire({
            title: 'Good job!',
            text: taskCompleted ? 'Task completed!' : 'Task marked as incomplete',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
        });
    }

    // Storage Functions
    function saveTasks() {
        const tasks = Array.from(taskList.children).map(li => ({
            text: li.querySelector('.task-text').textContent,
            completed: li.classList.contains('completed')
        }));
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const savedTasks = localStorage.getItem('tasks');
        if (savedTasks) {
            JSON.parse(savedTasks).forEach(task => {
                createTaskElement(task.text, task.completed);
            });
        }
    }

    function saveSettings() {
        const settings = {
            fontSize: fontSizeInput.value,
            backgroundColor: bgColorSelect.value,
            fontFamily: fontFamilySelect.value,
            darkMode: document.body.classList.contains('dark-mode')
        };
        localStorage.setItem('todoSettings', JSON.stringify(settings));
    }

    function loadSettings() {
        const savedSettings = localStorage.getItem('todoSettings');
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            
            // Apply font size
            fontSizeInput.value = settings.fontSize;
            fontSizeValue.textContent = `${settings.fontSize}px`;
            document.body.style.fontSize = `${settings.fontSize}px`;
            
            // Apply background color
            bgColorSelect.value = settings.backgroundColor;
            document.body.style.backgroundColor = settings.backgroundColor;
            
            // Apply font family
            fontFamilySelect.value = settings.fontFamily;
            document.body.className = settings.fontFamily;
            
            // Apply dark mode
            if (settings.darkMode) {
                document.body.classList.add('dark-mode');
            }
        }
    }

    // Event Listeners
    taskList.addEventListener('click', function(e) {
        const target = e.target;
        const taskItem = target.closest('li');

        if (!taskItem) return;

        if (target.classList.contains('delete-task')) {
            handleDeleteTask(taskItem);
        } else if (target.closest('.edit-task')) {
            handleEditTask(taskItem);
        } else if (target.classList.contains('mark-complete')) {
            handleToggleComplete(taskItem);
        }
    });

    // Font size handling
    fontSizeInput.addEventListener('input', function() {
        const size = this.value;
        fontSizeValue.textContent = `${size}px`;
        document.body.style.fontSize = `${size}px`;
    });

    // Font family handling
    fontFamilySelect.addEventListener('change', function() {
        document.body.className = this.value + (document.body.classList.contains('dark-mode') ? ' dark-mode' : '');
        saveSettings();
    });

    // Background color handling
    bgColorSelect.addEventListener('change', function() {
        document.body.style.backgroundColor = this.value;
        saveSettings();
    });

    // Dark mode handling
    darkModeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        saveSettings();
    });

    // Add task handlers
    addTaskButton.addEventListener('click', addTask);
    newTaskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    // Save settings when font size changes
    fontSizeInput.addEventListener('change', saveSettings);
});