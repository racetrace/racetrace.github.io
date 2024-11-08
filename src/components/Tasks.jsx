import { useState } from 'react';
import { wsRootUrl } from '../config';
import useWebSocket from '../hooks/useWebSocket';

// eslint-disable-next-line react/prop-types
function TaskUpdates({userId}) {
  const [tasks, setTasks] = useState([]);
  
  const handleIncomingMessage = (data) => {
    const parsedData = JSON.parse(data); // Parse the JSON string into an object
    setTasks((prevTasks) => {
      // Update task state based on incoming data
      return prevTasks.map(task => 
        task.id === parsedData.id ? { ...task, status: parsedData.status } : task
      );
    });
  };

  const { isConnected } = useWebSocket(wsRootUrl + 'ws/tasks/' + userId.toString(), {
    onMessage: handleIncomingMessage,
  }, [userId]);

  return (
    <div>
      <h2>Task Updates {isConnected ? '🔵' : '🔴'}</h2>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>{task.name}: {task.status}</li>
        ))}
      </ul>
    </div>
  );
}

export default TaskUpdates;