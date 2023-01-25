import { useEffect, useState } from "react";
import TaskForm from "./TaskForm";
import Task from "./Task";
import { toast } from "react-toastify";
import axios from "axios";
import loadingImage from '../assets/loader.gif';


const TaskList = () => {

    const [tasks, setTasks] = useState([]);
    const [completedTasks, setCompletedTasks] = useState([]);

    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [taskID, setTaskID] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        completed: false
    })

    const { name } = formData;


    const handleInputChange = (event) => {
        const { name, value } = event.target;

        setFormData({ ...formData, [name]: value });
    }


    const getTasks = async () => {
        setIsLoading(true);

        try {
            const { data } = await axios.get("/api/tasks");
            setTasks(data);

            setIsLoading(false);
        } catch (error) {
            toast.error(error.message);

            setIsLoading(false)
        }
    }

    useEffect(() => {
        getTasks();
    }, [])

    
    const createTask = async (event) => {
        event.preventDefault();

        if (name === "") {
            return toast.error("Input field cannot be empty");
        }

        try {
            await axios.post("/api/tasks", formData);
            toast.success("Task added successfully");

            setFormData({ ...formData, name: "" });

            getTasks();

        } catch (error) {
            toast.error(error.message);

        }
    }

    const deleteTask = async (id) => {
        try {
            await axios.delete(`/api/tasks/${id}`);

            getTasks();

            toast.success("Task deleted successfully");
        } catch (error) {
            toast.error(error.message);
        }
    }

    const getSingleTask = async (task) => {
        setFormData({ name: task.name, completed: false });

        setIsEditing(true);

        setTaskID(task._id);
    }

    const editTask = async (event) => {
        event.preventDefault();

        if (name === "") {
            return toast.error("Input field cannot be empty");
        }

        try {
            await axios.put(`/api/tasks/${taskID}`, formData)

            setFormData({ ...formData, name: "" });

            setIsEditing(false);

            getTasks();

            toast.success("Task updated successfully");
        } catch (error) {
            toast.error(error.message);
        }
    }

    const taskCompleted = async (task) => {

        try {
            await axios.put(`/api/tasks/${task._id}`, {name: task.name, completed: true});

            getTasks();

            toast.success("Task completed successfully");
        } catch (error) {
            toast.error(error.message);
        }
    }

    useEffect(() => {
        setCompletedTasks(tasks.filter((task) => {
            return task.completed === true;
        }))
    }, [tasks])


    return <div>
        <h2>Task Manager</h2>
        <TaskForm
            name={name}
            handleInputChange={handleInputChange}
            createTask={createTask}
            isEditing={isEditing}
            editTask={editTask} />
        {tasks.length > 0 && (<div className="--flex-between --pb">
            <p><b>Total Tasks:</b> {tasks.length}</p>
            <p><b>Completed Tasks:</b> {completedTasks.length}</p>
        </div>)}
        <hr />
        {
            isLoading && (
                <div className="--flex-center">
                    <img src={loadingImage} alt="Loading" />
                </div>
            )
        }

        {
            !isLoading && tasks.length === 0 ? (
                <p className="--py">No tasks added</p>
            ) : (
                tasks.map((task, index) => {
                    return <Task
                        key={task._id}
                        index={index}
                        task={task}
                        deleteTask={deleteTask}
                        getSingleTask={getSingleTask}
                        taskCompleted={taskCompleted} />
                })
            )
        }
    </div>
}

export default TaskList