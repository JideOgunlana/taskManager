import React, { useState, useEffect } from 'react';
import { Button, Input } from '@ui5/webcomponents-react';
import TaskTable from './components/TaskTable/TaskTable';

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>('');

  useEffect(() => {
    fetch('http://localhost:3001/tasks')
      .then(response => response.json())
      .then(data => setTasks(data))
      .catch(err => console.error('Error fetching tasks:', err));
  }, []);

  const handleAddTask = () => {
    if (newTask.trim() === '') return;

    fetch('http://localhost:3001/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: newTask }),
    })
      .then(response => response.json())
      .then(newTask => {
        setTasks([...tasks, newTask]);
        setNewTask('');
      })
      .catch(err => console.error('Error adding task:', err));
  };

  const handleDeleteTask = (id: number) => {
    fetch(`http://localhost:3001/tasks/${id}`, { method: 'DELETE' })
      .then(() => {
        setTasks(tasks.filter(task => task.id !== id));
      })
      .catch(err => console.error('Error deleting task:', err));
  };

  const handleToggleComplete = (id: number) => {
    const task = tasks.find(task => task.id === id);
    if (!task) return;

    fetch(`http://localhost:3001/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ completed: !task.completed }),
    })
      .then(response => response.json())
      .then(updatedTask => {
        setTasks(tasks.map(task => (task.id === id ? updatedTask : task)));
      })
      .catch(err => console.error('Error updating task:', err));
  };

  // Tasks separated into completed and incompleted
  const completedTasks = tasks.filter(task => task.completed);
  const incompleteTasks = tasks.filter(task => !task.completed);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Task Manager</h1>
      <div style={{ marginBottom: '20px' }}>
        <Input
          placeholder="Enter a new task"
          value={newTask}
          style={{ width: "80%" }}
          onInput={(e: any) => setNewTask(e.target.value)}
        />
        <Button
          icon="add"
          design="Emphasized"
          onClick={handleAddTask}
          style={{ width: "15%", marginLeft: "5%" }}
        >
          Add Task
        </Button>
      </div>

      <h4>Tasks To Do</h4>
      <TaskTable 
        tasks={incompleteTasks} 
        onToggleComplete={handleToggleComplete} 
        onDeleteTask={handleDeleteTask} 
      />

      <h4>Tasks Completed</h4>
      <TaskTable 
        tasks={completedTasks} 
        onToggleComplete={handleToggleComplete} 
        onDeleteTask={handleDeleteTask} 
      />
    </div>
  );
};

export default App;
