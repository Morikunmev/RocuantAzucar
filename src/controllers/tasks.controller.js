export const getAllTasks = (req,res) => res.send("Obteniendo tareas");
export const getTask = (req,res) => res.send('Obteniendo tarea unica');
export const createTask = (req,res) => res.send('Creando tarea')

export const updateTask = (req,res) => res.send('Actualizando tarea unica')

export const deleteTask = (req,res) => res.send('Eliminando tarea unica')