import { useState } from 'react'
import './App.css'

const FILTERS = {
  all: 'All',
  active: 'Active',
  completed: 'Completed',
}

function App() {
  const [tasks, setTasks] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [filter, setFilter] = useState('all')

  const addTask = (event) => {
    event.preventDefault()
    const title = inputValue.trim()

    if (!title) {
      return
    }

    setTasks((currentTasks) => [
      ...currentTasks,
      {
        id: crypto.randomUUID(),
        title,
        completed: false,
      },
    ])
    setInputValue('')
  }

  const toggleTask = (taskId) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    )
  }

  const visibleTasks = tasks.filter((task) => {
    if (filter === 'active') {
      return !task.completed
    }
    if (filter === 'completed') {
      return task.completed
    }
    return true
  })

  const remainingCount = tasks.filter((task) => !task.completed).length

  return (
    <main className="task-manager">
      <h1>Task Manager</h1>

      <form className="task-input-row" onSubmit={addTask}>
        <input
          type="text"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          placeholder="Enter a task"
          aria-label="Task title"
        />
        <button type="submit">Add</button>
      </form>

      <ul className="task-list">
        {visibleTasks.map((task) => (
          <li key={task.id}>
            <button
              type="button"
              className={`task-item ${task.completed ? 'completed' : ''}`}
              onClick={() => toggleTask(task.id)}
            >
              {task.title}
            </button>
          </li>
        ))}
      </ul>

      <div className="filters" role="group" aria-label="Filter tasks">
        {Object.entries(FILTERS).map(([key, label]) => (
          <button
            key={key}
            type="button"
            className={filter === key ? 'active' : ''}
            onClick={() => setFilter(key)}
          >
            {label}
          </button>
        ))}
      </div>

      <p className="task-count">
        {remainingCount} {remainingCount === 1 ? 'task' : 'tasks'} remaining
      </p>
    </main>
  )
}

export default App
