document.addEventListener('DOMContentLoaded', function() {
    const addTaskButton = document.getElementById('add-task-button');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');

    loadTask();

    
    function addTask(){
        const taskText = taskInput.value.trim();

        if(taskText === '') return;

        //create task object to store multiple values inside
        const task = {
            id: Date.now(),
            text: taskText,
            completed: false,
            createdAt: new Date().toISOString()
        }

        chrome.storage.sync.get(['tasks'], function(result) {
            //if false then get after ||
            const tasks = result.tasks || [];

            tasks.push(task);

            chrome.storage.sync.set({tasks: tasks}, function(){

                addTaskToUI(task);

                taskInput.value = '';
                taskInput.focus();
            });
        })
    }

    function addTaskToUI(task) {
        const listItem = document.createElement('li');

        listItem.dataset.id = task.id;

        const circleIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        circleIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        circleIcon.setAttribute('width', '24');
        circleIcon.setAttribute('height', '24');
        circleIcon.setAttribute('viewBox', '0 0 24 24');
        circleIcon.classList.add('circle-icon');

        const fillCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        fillCircle.setAttribute('cx', '12');
        fillCircle.setAttribute('cy', '12');
        fillCircle.setAttribute('r', '0');
        fillCircle.setAttribute('fill', '#4CAF50');
        fillCircle.classList.add('circle-fill');
        circleIcon.appendChild(fillCircle);

        const circlePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        circlePath.setAttribute('fill', 'currentColor');
        circlePath.setAttribute('d', 'M11.5 3a9.5 9.5 0 0 1 9.5 9.5a9.5 9.5 0 0 1-9.5 9.5A9.5 9.5 0 0 1 2 12.5A9.5 9.5 0 0 1 11.5 3m0 1A8.5 8.5 0 0 0 3 12.5a8.5 8.5 0 0 0 8.5 8.5a8.5 8.5 0 0 0 8.5-8.5A8.5 8.5 0 0 0 11.5 4');
        circleIcon.appendChild(circlePath);
        listItem.appendChild(circleIcon);

        const taskSpan = document.createElement('span');
        taskSpan.textContent = task.text;
        taskSpan.classList.add('task-text');
        listItem.appendChild(taskSpan);

        const trashIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        trashIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        trashIcon.setAttribute('width', '24');
        trashIcon.setAttribute('height', '24');
        trashIcon.setAttribute('viewBox', '0 0 24 24');

        const trashPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        trashPath.setAttribute('fill', 'currentColor');
        trashPath.setAttribute('d', 'M18 19a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V7H4V4h4.5l1-1h4l1 1H19v3h-1zM6 7v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2V7zm12-1V5h-4l-1-1h-3L9 5H5v1zM8 9h1v10H8zm6 0h1v10h-1z');
        trashIcon.appendChild(trashPath);
        listItem.appendChild(trashIcon);

        taskList.appendChild(listItem);

        trashIcon.addEventListener('click', function(event){
            const taskId = parseInt(listItem.dataset.id);
            deleteTask(taskId);
            listItem.remove();

        })

        circleIcon.addEventListener('click', function(){
            task.completed = true;

            circleIcon.classList.toggle('completed', task.completed);
            taskSpan.classList.toggle('completed', task.completed);

            updateTaskInStorage(task);
        })
    }

    function deleteTask(taskId){
        chrome.storage.sync.get(['tasks'], function(result){
            let tasks = result.tasks || [];
            tasks = tasks.filter(task => task.id !== taskId);

            chrome.storage.sync.set({tasks: tasks}, function(){
                return;
            })
        })
    }

    function updateTaskInStorage(updatedTask) {
        chrome.storage.sync.get(['tasks'], function(result){
            let tasks = result.tasks || [];
            tasks = tasks.map(task =>
                task.id === updatedTask.id ? updatedTask: task
            );
            chrome.storage.sync.set({tasks: tasks});
        });
    }
    function loadTask() {
        chrome.storage.sync.get(['tasks'], function(result) {
            const tasks = result.tasks || [];
            taskList.innerHTML = '';
            
            const incompleteTasks = tasks.filter(task => !task.completed);
            incompleteTasks.forEach(function(task){
                addTaskToUI(task);
            })
        })
    }

    addTaskButton.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', function(event) {
        if(event.key === 'Enter'){
            addTask();
        }
    })
});