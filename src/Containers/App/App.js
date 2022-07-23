// Librairies
import React, { useState, useEffect } from 'react';
import classes from './App.module.css';
import Task from '../../Components/Task/Task';
import axios from '../../axios-firebase';

function App() {

  // States
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');

  // Etats
  useEffect(() => {
    console.log('[App.js] useEffect');

    // Récupèrer les élèves
    fetchTasks();

    return() => {
      console.log('[App.js] useEffect (didUnmount)');
    }
  }, []);

  useEffect(() => {
    console.log('[App.js] useEffect (didUpdate)');
  });

  // Fonctions 
  const removeClickedHandler = index => {
    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTasks(newTasks);

    axios.delete('/tasks/' + tasks[index].id + '.json')
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const doneClickedHandler = index => {
    const newTasks = [...tasks];
    newTasks[index].done = !tasks[index].done;
    setTasks(newTasks);

    axios.put('/tasks/' + tasks[index].id + '.json', newTasks[index])
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      })

  }
  
  const submittedTaskHandler = event => {
    event.preventDefault();

    const newTask = {
      content: input,
      done: false
    }
  setTasks([...tasks, newTask]);
  setInput('');
  
  axios.post('/tasks.json', newTask)
    .then((response) => {
      fetchTasks();
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });    
  
  }

  const changedFormHandler = event => {
    setInput(event.target.value);
  }

  const fetchTasks = () => {
    axios.get('/tasks.json')
    .then((response) => {
      console.log(response);
      const tasksArrAy = [];
      for (let key in response.data) {
        tasksArrAy.push({
        ...response.data[key],
        id: key
        });
      }
      setTasks(tasksArrAy);
      
    })
    .catch((error) => {
      console.log(error);
    });
  }
  
  
  // Variables
  let tasksDisplayed = tasks.map((task, index) => (
    <Task
      done={task.done}
      content={task.content}
      key={index}
      removeClicked={() => removeClickedHandler(index)}
      doneClicked={() => doneClickedHandler(index)}
    />
  ));
  // let donedTasks = tasks.filter(task => task.done)
  //   .map((filteredTask, index) => (
  //     <Task
  //       done={filteredTask.done}
  //       content={filteredTask.content}
  //       key={index}
  //       removeClicked={() => removeClickedHandler(index)}
  //       doneClicked={() => doneClickedHandler(index)}
  //     />
  // ));

  return (
    <div className={classes.App}>
      <header>
        <span>TO-DO</span>
      </header>

      <div className={classes.add}>
        <form onSubmit={(e) => submittedTaskHandler(e)}>
          <input
            type="text"
            value={input}
            onChange={(e) => changedFormHandler(e)}
            placeholder="Que souhaitez-vous ajouter ?" 
            autoFocus 
          />
          <button type="submit">
            Ajouter
          </button>
        </form>
      </div>

      {tasksDisplayed}
    </div>
  );
}

export default App;
