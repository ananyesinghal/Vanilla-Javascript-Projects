class TaskList {
    constructor(title, time) {
        this.title = title;
        this.time = time;
    }
}

class UI {
    static displayTasks() {
        const tasks = Store.getTasks();
        tasks.forEach((task) => UI.addTaskToList(task));
    }

    static addTaskToList(task) {
        const list = document.querySelector('#todo-list');
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${task.title}</td>
            <td>${task.time}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;

        list.appendChild(row);
    }

    static deleteTask(el) {
        if(el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#todo-form');
        container.insertBefore(div,form)

        setTimeout(() => document.querySelector('.alert').remove(), 2000);
    }

    static clearField(){
        document.querySelector('#title').value = '';
        document.querySelector('#time').value = '';
    }
}

class Store {
    static getTasks() {
        let tasks;
        if(localStorage.getItem('tasks') === null) {
            tasks = [];
        } else {
            tasks = JSON.parse(localStorage.getItem('tasks'));
        }

        return tasks;
    }

    static addTask(task) {
        const tasks = Store.getTasks();

        tasks.push(task);

        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    static removeTask(time) {
        const tasks = Store.getTasks();

        tasks.forEach((task, index) => {
            if(task.time === time) {
                tasks.splice(index, 1);
            }
        });

        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
}

document.addEventListener('DOMContentLoaded', UI.displayTasks);

document.querySelector('#todo-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.querySelector('#title').value;
    const time = document.querySelector('#time').value;

    if(title == '' || time == '') {
        UI.showAlert('Please fill in all fields', 'danger');
    } else {
        const task = new TaskList(title,time);

        UI.addTaskToList(task);

        Store.addTask(task);

        UI.showAlert('Task Added', 'success');

        UI.clearField();
    }
});

document.querySelector('#todo-list').addEventListener('click', (e) => {
    UI.deleteTask(e.target);
    Store.removeTask(e.target.parentElement.previousElementSibling.textContent);
    UI.showAlert('Task Removed', 'success')
}); 