const TaskForm = ({ name, handleInputChange, createTask, isEditing, editTask }) => {
    return (
        <form
            className="task-form"
            onSubmit={isEditing ? editTask : createTask} >
            <input
                type="text"
                name="name"
                value={name}
                onChange={handleInputChange}
                placeholder="Add a Task" />
            <button
                type="submit">{isEditing ? "Edit" : "Add"}
            </button>
        </form>
    )
}

export default TaskForm