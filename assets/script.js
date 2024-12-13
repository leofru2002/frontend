const API_BASE_URL = 'https://vtydmxkaqj.execute-api.us-east-1.amazonaws.com';

let tasks = []; // Variable global para almacenar las tareas

document.addEventListener('DOMContentLoaded', () => {
  const tasksTableBody = document.getElementById('tasks-table');
  const taskForm = document.getElementById('task-form');
  const taskModal = new bootstrap.Modal(document.getElementById('taskModal'), {});

  async function loadTasks() {
    tasks = await getTasks(); // Obtén las tareas del backend
    tasksTableBody.innerHTML = '';
    tasks.forEach(task => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${task.title}</td>
        <td>${task.description}</td>
        <td>
          <button class="btn btn-warning btn-sm" onclick="editTask('${task.id}')">Editar</button>
          <button class="btn btn-danger btn-sm" onclick="handleDeleteTask('${task.id}')">Eliminar</button>
        </td>
      `;
      tasksTableBody.appendChild(row);
    });
  }

  window.openTaskModal = () => {
    document.getElementById('task-id').value = ''; // Limpia el campo oculto para indicar que es una nueva tarea
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('taskModalLabel').innerText = 'Nueva Tarea';
    taskModal.show(); // Abre el modal
  };

  window.editTask = (id) => {
    const task = tasks.find(task => task.id === id); // Busca la tarea en la lista
    if (!task) {
      alert('Tarea no encontrada');
      return;
    }
    // Rellena el formulario del modal con los datos de la tarea
    document.getElementById('task-id').value = task.id;
    document.getElementById('title').value = task.title;
    document.getElementById('description').value = task.description;
    document.getElementById('taskModalLabel').innerText = 'Editar Tarea';
    taskModal.show();
  };

  window.handleDeleteTask = async (id) => {
    try {
      await deleteTask(id); // Llama a la función que elimina la tarea
      alert('Tarea eliminada con éxito');
      loadTasks(); // Recarga las tareas después de eliminar
    } catch (error) {
      console.error('Error al eliminar la tarea:', error);
    }
  };

  taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('task-id').value;
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;

    if (id) {
      // Si hay un ID, estamos editando
      await updateTask(id, { title, description });
      alert('Tarea editada con éxito');
    } else {
      // Si no hay un ID, estamos creando
      await createTask({ title, description });
      alert('Tarea creada con éxito');
    }

    taskModal.hide(); // Cierra el modal después de guardar
    loadTasks(); // Recarga las tareas
  });

  loadTasks(); // Carga las tareas al inicio
});

async function getTasks() {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    return data.body.tasks || [];
  } catch (error) {
    console.error('Error al obtener las tareas:', error);
    return [];
  }
}

async function createTask(task) {
  try {
    await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(task)
    });
  } catch (error) {
    console.error('Error al crear la tarea:', error);
  }
}

async function updateTask(id, task) {
  try {
    await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(task)
    });
  } catch (error) {
    console.error('Error al actualizar la tarea:', error);
  }
}

async function deleteTask(id) {
  try {
    await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'DELETE'
    });
  } catch (error) {
    console.error('Error al eliminar la tarea:', error);
  }
}

// Funciones para el modal de endpoints
function openEndpointsModal() {
  const endpointsModal = new bootstrap.Modal(document.getElementById('endpointsModal'), {});
  endpointsModal.show();
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
    .then(() => {
      alert(`Copiado al portapapeles: ${text}`);
    })
    .catch(err => {
      console.error('Error al copiar al portapapeles:', err);
    });
}
