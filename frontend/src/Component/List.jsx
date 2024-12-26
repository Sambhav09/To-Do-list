import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import axios from 'axios';

const List = () => {
    const { register, setValue, handleSubmit, reset, formState: { errors } } = useForm();
    const [entries, setEntries] = useState([]);
    const [currentEntryID, setCurrentEntryID] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchEntries();
    }, []);

    const fetchEntries = async () => {
        try {
            const response = await axios.get("http://localhost:3000/list");
            setEntries(response.data.map(entry => ({ ...entry, completed: false })));
        } catch (error) {
            console.error("Error fetching entries:", error);
        }
    };

    const handleEdit = (id, entry) => {
        setValue("todo", entry.todo);
        setCurrentEntryID(id);
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        await axios.delete(`http://localhost:3000/list/${id}`);
        fetchEntries();
    };

    const toggleCompletion = (id) => {
        setEntries(prevEntries =>
            prevEntries.map(entry =>
                entry._id === id ? { ...entry, completed: !entry.completed } : entry
            )
        );
    };

    const onSubmit = async (data) => {
        try {
            if (isEditing) {
                await axios.put(`http://localhost:3000/list/${currentEntryID}`, data);
            } else {
                await axios.post('http://localhost:3000/list', data);
            }
        } catch (error) {
            console.error(error);
        }
        setIsEditing(false);
        setCurrentEntryID(null);
        reset();
        fetchEntries();
    };

    const filteredEntries = entries.filter(entry =>
        entry.todo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const completedTasks = entries.filter(entry => entry.completed).length;
    const totalTasks = entries.length;

    return (
        <div className="min-h-screen py-10 flex flex-col items-center">
            <div className="w-11/12 md:w-2/3 lg:w-1/2">
                <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-lg rounded-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                        {isEditing ? "Update Your Task" : "Add a New Task"}
                    </h2>
                    <input
                        type="text"
                        placeholder="What needs to be done?"
                        className="w-full p-3 text-lg border rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        {...register("todo", { required: { value: true, message: "This field is required" } })}
                    />
                    {errors.todo && <p className="text-red-500 mt-2">{errors.todo.message}</p>}
                    <button
                        type="submit"
                        className={`w-full mt-4 py-2 rounded-md text-white font-semibold transition-colors ${
                            isEditing ? "bg-yellow-500 hover:bg-yellow-600" : "bg-indigo-500 hover:bg-indigo-600"
                        }`}
                    >
                        {isEditing ? "Update" : "Add Task"}
                    </button>
                </form>
            </div>

            <div className="w-11/12 md:w-2/3 lg:w-1/2 mt-8">
                <input
                    type="text"
                    placeholder="Search tasks..."
                    className="w-full p-3 text-black text-lg border rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none mb-6"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-xl font-semibold text-white">Your Tasks</h1>
                    <div className="text-sm text-black">
                        Completed: {completedTasks} / {totalTasks}
                    </div>
                </div>

                <div className="relative w-full bg-gray-300 rounded-full h-2 mb-6">
                    <div
                        className="absolute bg-green-500 h-2 rounded-full"
                        style={{ width: `${(completedTasks / totalTasks) * 100 || 0}%` }}
                    ></div>
                </div>

                {filteredEntries.map(entry => (
                    <div
                        key={entry._id}
                        className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center mb-4"
                    >
                        <div className="flex items-center gap-4">
                            <input
                                type="checkbox"
                                className="h-5 w-5 text-indigo-500 rounded focus:ring-2 focus:ring-indigo-500"
                                onChange={() => toggleCompletion(entry._id)}
                                checked={entry.completed}
                            />
                            <h1
                                className={`text-lg ${entry.completed ? "line-through text-gray-400" : "text-gray-800"}`}
                            >
                                {entry.todo}
                            </h1>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => handleEdit(entry._id, entry)}
                                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(entry._id)}
                                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}

                {filteredEntries.length === 0 && (
                    <p className="text-center text-black mt-4">No tasks found. Add a new one!</p>
                )}
            </div>
        </div>
    );
};

export default List;