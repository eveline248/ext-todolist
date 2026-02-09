document.addEventListener('DOMContentLoaded', function() {
    const addTaskButton = document.getElementById('add-task-button');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');

    loadTasks();

    function loadTasks() {
        chrome.storage.sync.get(['todoList'], function(result) {
            if (result.todoList) {
                result.todoList.forEach(task => {
                    const listItem = document.createElement('li');
                    const circleIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                    circleIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
                    circleIcon.setAttribute('width', '24');
                    circleIcon.setAttribute('height', '24');
                    circleIcon.setAttribute('viewBox', '0 0 24 24');
                    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                    path.setAttribute('fill', 'currentColor');
                    path.setAttribute('d', 'M11.5 3a9.5 9.5 0 0 1 9.5 9.5a9.5 9.5 0 0 1-9.5 9.5A9.5 9.5 0 0 1 2 12.5A9.5 9.5 0 0 1 11.5 3m0 1A8.5 8.5 0 0 0 3 12.5a8.5 8.5 0 0 0 8.5 8.5a8.5 8.5 0 0 0 8.5-8.5A8.5 8.5 0 0 0 11.5 4');
                    circleIcon.appendChild(path);
                    listItem.appendChild(circleIcon);
                    const textSpan = document.createElement('span');
                    textSpan.textContent = task;
                    listItem.appendChild(textSpan);
                    taskList.appendChild(listItem);

                    const trashIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                    trashIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
                    trashIcon.setAttribute('width', '24');
                    trashIcon.setAttribute('height', 24);
                    trashIcon.setAttribute('viewBox', '0 0 24 24');
                    const paths = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                    paths.setAttribute('fill', 'currentColor');
                    paths.setAttribute('d', 'M18 19a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V7H4V4h4.5l1-1h4l1 1H19v3h-1zM6 7v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2V7zm12-1V5h-4l-1-1h-3L9 5H5v1zM8 9h1v10H8zm6 0h1v10h-1z');
                    trashIcon.appendChild(paths);
                    listItem.appendChild(trashIcon);

                    
                });
            }
        });
    }

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText !== '') {
            const listItem = document.createElement('li');
            const circleIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            circleIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
            circleIcon.setAttribute('width', '24');
            circleIcon.setAttribute('height', '24');
            circleIcon.setAttribute('viewBox', '0 0 24 24');
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('fill', 'currentColor');
            path.setAttribute('d', 'M11.5 3a9.5 9.5 0 0 1 9.5 9.5a9.5 9.5 0 0 1-9.5 9.5A9.5 9.5 0 0 1 2 12.5A9.5 9.5 0 0 1 11.5 3m0 1A8.5 8.5 0 0 0 3 12.5a8.5 8.5 0 0 0 8.5 8.5a8.5 8.5 0 0 0 8.5-8.5A8.5 8.5 0 0 0 11.5 4');
            circleIcon.appendChild(path);
            listItem.appendChild(circleIcon);
            const textSpan = document.createElement('span');
            textSpan.textContent = taskText;
            listItem.appendChild(textSpan);
            taskList.appendChild(listItem);
            taskInput.value = '';
            taskInput.focus();
            saveTasks();
        }
    }

    function saveTasks() {
        const tasks = [];
        const items = taskList.querySelectorAll('li');

        items.forEach(item => {
            tasks.push(item.querySelector('span').textContent);
        });

        chrome.storage.sync.set({todoList: tasks}, function() {
            console.log("Tasks saved successfully.");
        });
    }

    addTaskButton.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            addTask();
        }
    });
}); 
