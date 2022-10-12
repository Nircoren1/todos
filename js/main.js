'use strict'

function onInit() {
    renderTodos()
}

function renderTodos() {
    const todos = getTodosForDisplay()
    let strHTMLs
    if (!todos.length) {
        if (!getTotalCount()) { strHTMLs = `<h1>No Todos</h1>` }
        else if (!getActiveCount()) {
            strHTMLs = `<h1>No Active Todos</h1>`
        }
        else { strHTMLs = `<h1>No Done Todos</h1>` }
        document.querySelector('ul').innerHTML = strHTMLs
    } else {
        sortTodos(todos)
        strHTMLs = todos.map((todo, idx) => `
            <li onclick="onToggleTodo('${todo.id}')">
            <button class="delete-todo-btn" onclick="onRemoveTodo(event,'${todo.id}')">X</button>
            <span class="${(todo.isDone) ? 'done' : ''}">${todo.date} <span class="priority${todo.priority}">${todo.priority}</span> ${todo.txt}</span>
                ${(idx === 0 || idx === todos.length - 1 || gFilterBy.txt || gFilterBy.status !== 'all') ? '' :
                `
                    <div class="arrow-btns-container">
                        <button data-idx="${idx}" value="up" onclick="onArrow(this)">🠕</button>
                        <button data-idx="${idx}" value="down" onclick="onArrow(this)">🠗</button>
                    </div>
                    `
            }
            </li>
        `).join('')

    }

    document.querySelector('ul').innerHTML = strHTMLs
    document.querySelector('span.total').innerText = getTotalCount()
    document.querySelector('span.active').innerText = getActiveCount()
}

function onRemoveTodo(ev, todoId) {
    ev.stopPropagation()
    if (!confirm('Are You Sure?')) return
    removeTodo(todoId)
    renderTodos()
}

function onToggleTodo(todoId) {
    toggleTodo(todoId)
    renderTodos()
}

function onAddTodo(ev) {
    ev.preventDefault()
    const elTxt = document.querySelector('[name="txt"]')
    const txt = elTxt.value
    const currPriotity = document.querySelector('.select-priotity').value
    console.log(currPriotity);
    if (!txt || !currPriotity) return
    addTodo(txt, currPriotity)
    renderTodos()
    elTxt.value = ''
}

function onSetFilter(filterBy) {
    setFilter(filterBy)
    renderFilterBtns(filterBy)
    renderTodos()
}

function onSortBy(value) {
    setSortBy(value)
    renderTodos()
}

function onSetFilterByTxt(txt) {
    setFilterByTxt(txt)
    renderTodos()
}

function onSetPriority(value) {
    setPriorityValue(value);
}

function onArrow(elBtn) {
    event.stopPropagation()
    switchTodos(elBtn);
    renderTodos();
}

function renderFilterBtns(filterBy) {
    const filterBtns = document.querySelector(".filter-btns").children
    for (let i = 0; i < filterBtns.length; i++) {
        if (filterBtns[i].value === filterBy) filterBtns[i].classList.add("active-btn")
        else filterBtns[i].classList.remove("active-btn")
    }
}
