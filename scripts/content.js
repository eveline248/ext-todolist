document.addEventListener('DOMContentLoaded', function() {
    const addTaskButton = document.getElementById('add-task-button');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    
    //trying for firefox compatibility but not yet working LOL
    const storage = typeof browser !== 'undefined'
    ? browser.storage
    : chrome.storage;

    //temporary storage because idk how storage works ;-; hence I store here then use your saveTask to store this array, its an array of task component:
    //{
    //id
    //taskName
    //completed
    //}

    let tasks = [];

    loadTasks();
    
    //create a task component, so I can store the status (completed or not)
    function createTaskComponent(task){
        const listItem = document.createElement('li');
        
        if(task.completed) listItem.classList.add('completed');

        const circleIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        circleIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        circleIcon.setAttribute('width', '24');
        circleIcon.setAttribute('height', '24');
        circleIcon.setAttribute('viewBox', '0 0 24 24');

        const circlePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        circlePath.setAttribute('fill', 'currentColor');
        //a ? b : c basically if a is true then b else c
        circlePath.setAttribute('d', task.completed ?  'M12 2a10 10 0 1 0 0 20a10 10 0 0 0 0-20' : 'M11.5 3a9.5 9.5 0 0 1 9.5 9.5a9.5 9.5 0 0 1-9.5 9.5A9.5 9.5 0 0 1 2 12.5A9.5 9.5 0 0 1 11.5 3m0 1A8.5 8.5 0 0 0 3 12.5a8.5 8.5 0 0 0 8.5 8.5a8.5 8.5 0 0 0 8.5-8.5A8.5 8.5 0 0 0 11.5 4');
        circleIcon.appendChild(circlePath);
        listItem.appendChild(circleIcon);

        //toggle status
        circleIcon.addEventListener('click', () => {
            task.completed = !task.completed;
            saveTasks();
            loadTasks();
        });

        const textSpan = document.createElement('span');
        textSpan.textContent = task.text;
        listItem.appendChild(textSpan);

        const trashIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        trashIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        trashIcon.setAttribute('width', '24');
        trashIcon.setAttribute('height', 24);
        trashIcon.setAttribute('viewBox', '0 0 24 24');

        const trashPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        trashPath.setAttribute('fill', 'currentColor');
        trashPath.setAttribute('d', 'M18 19a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V7H4V4h4.5l1-1h4l1 1H19v3h-1zM6 7v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2V7zm12-1V5h-4l-1-1h-3L9 5H5v1zM8 9h1v10H8zm6 0h1v10h-1z');
        trashIcon.appendChild(trashPath);
        listItem.appendChild(trashIcon);

        return listItem;
    }

    function loadTasks() {
        storage.sync.get(['todoList'], function(result) {
            tasks = result.todoList || [];
            taskList.innerHTML = '';

            tasks.forEach(task => {
                taskList.appendChild(createTaskComponent(task));
            });
        });
    }

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText === '') return;
        
        const task = {
            //generate id for deletion I ambil dari stack overflow, katanya like this bisa di sort by date hehe
            id: Date.now().toString(36) + Math.random().toString(36).substr(2),
            text: taskText,
            completed: false,
        }

        tasks.push(task);
        saveTasks();
        loadTasks();

        taskInput.value = '';
        taskInput.focus();
    }

    function saveTasks() {
        storage.sync.set({todoList: tasks}, function() {
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
