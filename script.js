function addTask() {
    const taskInput = document.getElementById('new-task');
    const taskValue = taskInput.value.trim();
    const taskDate = document.getElementById('task-date').value;
    const taskTime = document.getElementById('task-time').value;
    const taskCategory = document.getElementById('task-category').value;

    if (taskValue && taskDate && taskCategory) {
        const pendingTasks = document.getElementById('pending-tasks');
        const newTask = document.createElement('li');
        const dueDateTime = new Date(`${taskDate}T${taskTime}`);

        newTask.setAttribute('data-date', taskDate);
        newTask.setAttribute('data-category', taskCategory);
        newTask.setAttribute('data-time', taskTime);
        newTask.classList.add('task-item');
        newTask.innerHTML = `
            <div class="task-details">
                <span class="task-name">${taskValue}</span>
                <span>Due: ${taskDate} ${taskTime}</span>
                <span>Category: ${taskCategory}</span>
                <span class="time-left">Time left: <span class="countdown"></span></span>
            </div>
            <div>
                <button onclick="completeTask(this)">Complete</button>
                <button onclick="editTask(this)">Edit</button>
                <button onclick="deleteTask(this)">Delete</button>
            </div>
        `;
        pendingTasks.appendChild(newTask);

        taskInput.value = '';
        document.getElementById('task-date').value = '';
        document.getElementById('task-time').value = '';
        document.getElementById('task-category').value = 'Work';

        const countdownInterval = setInterval(() => updateCountdown(newTask, dueDateTime), 1000);
        newTask.setAttribute('data-countdown-interval', countdownInterval);
    } else {
        alert("Please enter task, date, time, and category");
    }
}

function deleteTask(button) {
    const task = button.parentElement.parentElement;
    clearInterval(task.getAttribute('data-countdown-interval'));
    task.remove();
}

function completeTask(button) {
    const task = button.parentElement.parentElement;
    const completedTasks = document.getElementById('completed-tasks');
    task.querySelector('button').remove(); // Remove the "Complete" button
    clearInterval(task.getAttribute('data-countdown-interval'));
    task.querySelector('.time-left').remove(); // Remove the countdown timer
    completedTasks.appendChild(task);
    sortTasks('completed');
}

function editTask(button) {
    const task = button.parentElement.parentElement;
    const taskName = task.querySelector('.task-name').textContent;
    const taskDate = task.getAttribute('data-date');
    const taskTime = task.getAttribute('data-time');
    const taskCategory = task.getAttribute('data-category');

    document.getElementById('new-task').value = taskName;
    document.getElementById('task-date').value = taskDate;
    document.getElementById('task-time').value = taskTime;
    document.getElementById('task-category').value = taskCategory;

    clearInterval(task.getAttribute('data-countdown-interval'));
    task.remove();
}

function sortTasks(type) {
    const sortOption = document.getElementById(`${type}-sort`).value;
    const taskList = document.getElementById(`${type}-tasks`);
    const tasks = Array.from(taskList.getElementsByClassName('task-item'));

    tasks.sort((a, b) => {
        if (sortOption === 'date') {
            return new Date(a.getAttribute('data-date')) - new Date(b.getAttribute('data-date'));
        } else if (sortOption === 'category') {
            return a.getAttribute('data-category').localeCompare(b.getAttribute('data-category'));
        }
    });

    while (taskList.firstChild) {
        taskList.removeChild(taskList.firstChild);
    }

    tasks.forEach(task => taskList.appendChild(task));
}

function searchTasks() {
    const query = document.getElementById('search-bar').value.toLowerCase();
    const pendingTasks = document.getElementById('pending-tasks').getElementsByClassName('task-item');
    const completedTasks = document.getElementById('completed-tasks').getElementsByClassName('task-item');

    filterList(pendingTasks, query);
    filterList(completedTasks, query);
}

function filterList(tasks, query) {
    Array.from(tasks).forEach(task => {
        const taskName = task.querySelector('.task-name').textContent.toLowerCase();
        if (taskName.includes(query)) {
            task.style.display = '';
        } else {
            task.style.display = 'none';
        }
    });
}

function filterTasks(type) {
    const filterOption = document.getElementById(`${type}-filter`).value;
    const taskList = document.getElementById(`${type}-tasks`).getElementsByClassName('task-item');

    Array.from(taskList).forEach(task => {
        const category = task.getAttribute('data-category');
        if (filterOption === 'all' || category === filterOption) {
            task.style.display = '';
        } else {
            task.style.display = 'none';
        }
    });
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
}

function toggleTodayTasks() {
    const today = new Date().toISOString().split('T')[0];
    const pendingTasks = document.getElementById('pending-tasks').getElementsByClassName('task-item');
    const button = document.getElementById('pending-today-btn');

    if (button.getAttribute('data-showing-today') === 'true') {
        Array.from(pendingTasks).forEach(task => {
            task.style.display = '';
        });
        button.setAttribute('data-showing-today', 'false');
        button.textContent = 'Pending Today';
    } else {
        Array.from(pendingTasks).forEach(task => {
            const taskDate = task.getAttribute('data-date');
            if (taskDate === today) {
                task.style.display = '';
            } else {
                task.style.display = 'none';
            }
        });
        button.setAttribute('data-showing-today', 'true');
        button.textContent = 'Show All Pending';
    }
}

function updateCountdown(task, dueDateTime) {
    const now = new Date();
    const timeLeft = dueDateTime - now;

    if (timeLeft <= 0) {
        task.querySelector('.countdown').textContent = 'Time is up!';
        task.querySelector('.time-left').style.color = 'red';
        return;
    }

    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    task.querySelector('.countdown').textContent = `${hours}h ${minutes}m ${seconds}s`;
}
