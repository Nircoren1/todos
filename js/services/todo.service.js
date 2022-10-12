'use strict'

const STORAGE_KEY = 'todoDB'
var gFilterBy = {
    txt: '',
    status: 'all',
}
var gTodos;
var gSortBy;
_createTodos()

function getTodosForDisplay() {
    var todos = gTodos
    if (gFilterBy.status !== 'all') {
        todos = todos.filter(todo =>
            (todo.isDone && gFilterBy.status === 'done') ||
            (!todo.isDone && gFilterBy.status === 'active')
        )
    }
    todos = todos.filter(todo => todo.txt.toLowerCase().includes(gFilterBy.txt.toLowerCase()))
    return todos
}

function sortTodos(todos) {
    if (gSortBy === 'created' || !gSortBy) return
    if (gSortBy === 'importance') todos.sort((a, b) => a.priority - b.priority)
    else todos.sort((a, b) => a.txt.localeCompare(b.txt))
}

function removeTodo(todoId) {
    const todoIdx = gTodos.findIndex(todo => todo.id === todoId)
    gTodos.splice(todoIdx, 1)
    _saveTodosToStorage()
}

function toggleTodo(todoId) {
    const todo = gTodos.find(todo => todo.id === todoId)
    todo.isDone = !todo.isDone
    _saveTodosToStorage()
}

function addTodo(txt, currPriotity) {
    const todo = _createTodo(txt, currPriotity)
    gTodos.push(todo)
    _saveTodosToStorage()
}

function setFilter(status) {
    gFilterBy.status = status
}

function getFilter() {
    return gFilterBy
}

function setFilterByTxt(txt) {
    gFilterBy.txt = txt
}

function setSortBy(value) {
    gSortBy = value
}

function getTotalCount() {
    return gTodos.length
}

function getActiveCount() {
    return gTodos.filter(todo => !todo.isDone).length
}

function _createTodos() {

    var todos = loadFromStorage(STORAGE_KEY)

    if (!todos || !todos.length) {
        const currTime = getTime()
        todos = [
            {
                id: 't101',
                txt: 'Learn HTML',
                isDone: true,
                date: currTime,
                priority: 1
            },
            {
                id: 't102',
                txt: 'Master JS',
                isDone: false,
                date: currTime,
                priority: 2
            },
            {
                id: 't103',
                txt: 'Study CSS',
                isDone: false,
                date: currTime,
                priority: 3
            },
        ]
    }

    gTodos = todos;
    _saveTodosToStorage();
}

function _createTodo(txt, currPriotity) {
    const todo = {
        id: _makeId(),
        txt,
        isDone: false,
        date: getTime(),
        priority: currPriotity
    }
    return todo
}

function _saveTodosToStorage() {
    saveToStorage(STORAGE_KEY, gTodos)
}

function _makeId(length = 5) {
    var txt = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        txt += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return txt;
}

function getTime() {
    const date = new Date();
    const minutes = addZero(date.getMinutes())
    const hours = addZero(date.getHours())
    const month = addZero(date.getMonth() + 1)
    const day = addZero(date.getDate())
    return `${day}/${month} ${hours}:${minutes}`
}

function addZero(time) {
    return time < 10 ? `0${time}` : time
}

function switchTodos(elBtn) {
    const idx = +elBtn.dataset.idx;
    const isUp = elBtn.value === 'up' ? -1 : 1;
    let temp = { ...gTodos[idx] };
    gTodos[idx] = { ...gTodos[idx + isUp] };
    gTodos[idx + isUp] = { ...temp };
    _saveTodosToStorage();
}