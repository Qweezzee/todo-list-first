import { useState, useEffect } from 'react'
import Header from './components/header/Header'
import './App.css'

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks')
    return saved ? JSON.parse(saved) : []
  });
  const [taskText, setTaskText] = useState('');
  const [search, setSearch] = useState('');
  const [tags, setTags] = useState(['Важное', 'Работа', 'Срочно']);
  const [newTag, setNewTag] = useState('');
  const [theme, setTheme] = useState('light');
  const [editTaskId, setEditTaskId] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (taskText.trim() === '') return;
    const newTask = {
      id: Date.now(),
      text: taskText,
      tags: [],
      deadline: null,
      completed: false,
      createdAt: new Date().toISOString()
    };
    setTasks([newTask, ...tasks]);
    setTaskText('');
  }

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  }

  const startEdit = (task) => {
    setEditTaskId(task.id);
    setEditText(task.text);
  }

  const saveEdit = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, text: editText } : t));
    setEditTaskId(null);
  }

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  }

  const addTagToTask = (taskId, tag) => {
    if (!tasks.find(t => t.id === taskId).tags.includes(tag)) {
      setTasks(tasks.map(t => 
        t.id === taskId ? { ...t, tags: [...t.tags, tag] } : t
      ));
    }
  }

  const removeTagFromTask = (taskId, tag) => {
    setTasks(tasks.map(t => 
      t.id === taskId ? { ...t, tags: t.tags.filter(tg => tg !== tag) } : t
    ));
  }

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  }

  const setTaskDeadline = (taskId, date) => {
    setTasks(tasks.map(t => 
      t.id === taskId ? { ...t, deadline: date } : t
    ));
  }

  const toggleComplete = (taskId) => {
    setTasks(tasks.map(t => 
      t.id === taskId ? { ...t, completed: !t.completed } : t
    ));
  }

  const filteredTasks = tasks.filter(t => 
    t.text.toLowerCase().includes(search.toLowerCase()) ||
    t.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className={`app ${theme}`}>
      <div className="app-header">
        <Header toggleTheme={toggleTheme} theme={theme} />
      </div>
      
      <div className="container">
        <div className="search-container">
          <input
            className="search-input"
            placeholder=" Поиск задач или тегов"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="add-task-section">
          <div className="add-task">
            <input
              className="add-task-input"
              placeholder=" Введите новую задачу"
              value={taskText}
              onChange={(e) => setTaskText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
            />
            <button className="add-task-btn" onClick={addTask}>
              Добавить задачу
            </button>
          </div>
        </div>

        <div className="tags-section">
          <div className="tags-input-container">
            <input
              className="tags-input"
              placeholder="Создать новый тег"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTag()}
            />
            <button className="add-tag-btn" onClick={addTag}>
              Добавить тег
            </button>
          </div>
          <div className="tags-list">
            {tags.map(tag => (
              <div key={tag} className="tag" onClick={() => setTags(tags.filter(t => t !== tag))}>
                {tag} ×
              </div>
            ))}
          </div>
        </div>

        {filteredTasks.length === 0 ? (
          <div className="empty-state">         
          </div>
        ) : (
          <ul className="task-list">
            {filteredTasks.map(task => {
              const isOverdue = task.deadline && 
                new Date(task.deadline) < new Date() && 
                !task.completed;
              
              return (
                <li key={task.id} className={`task-item ${isOverdue ? 'overdue' : ''}`}>
                  <div className="task-content">
                    <input
                      type="checkbox"
                      className="task-checkbox"
                      checked={task.completed}
                      onChange={() => toggleComplete(task.id)}
                    />
                    
                    {editTaskId === task.id ? (
                      <div style={{ display: 'flex', flex: 1, alignItems: 'center' }}>
                        <input
                          className="edit-input"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          autoFocus
                        />
                        <button className="edit-btn" onClick={() => saveEdit(task.id)}>
                          Сохранить
                        </button>
                        <button className="delete-btn" onClick={() => setEditTaskId(null)}>
                          Отмена
                        </button>
                      </div>
                    ) : (
                      <>
                        <span 
                          className={`task-text ${task.completed ? 'completed' : ''}`}
                          onDoubleClick={() => startEdit(task)}
                        >
                          {task.text}
                        </span>
                        <div className="task-actions">
                          <button className="edit-btn" onClick={() => startEdit(task)}>
                             Редактировать
                          </button>
                          <button className="delete-btn" onClick={() => deleteTask(task.id)}>
                             Удалить
                          </button>
                        </div>
                      </>
                    )}
                  </div>


                  <div className="task-tags">
                    {task.tags.map(tag => (
                      <div 
                        key={tag} 
                        className="task-tag"
                        onClick={() => removeTagFromTask(task.id, tag)}
                      >
                        {tag} ×
                      </div>
                    ))}
                    <button 
                      className="add-tag-btn-task"
                      onClick={() => {
                        const newTagForTask = prompt('Введите тег для этой задачи:');
                        if (newTagForTask && newTagForTask.trim()) {
                          addTagToTask(task.id, newTagForTask.trim());
                        }
                      }}
                    >
                      + Добавить тег
                    </button>
                  </div>

               
                  <div className="deadline-section">
                    <span className="deadline-label">Срок выполнения:</span>
                    <input
                      type="date"
                      className="deadline-input"
                      value={task.deadline || ''}
                      onChange={(e) => setTaskDeadline(task.id, e.target.value)}
                    />
                    {isOverdue && <span style={{ color: '#ff4757', fontWeight: 'bold' }}>⏰ Просрочено!</span>}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;