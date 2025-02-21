import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../authentication/AuthProvider";
import { MdDeleteForever } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";


const DragAndDrop = () => {
    const { user } = useContext(AuthContext)

    const { data = [], isPending: loading, refetch } = useQuery({
        queryKey: ['dropTask'],
        queryFn: async () => {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/addTask/${user?.email}`);
            return res.data
        }
    })

    const [tasks, setTasks] = useState({
        "To-Do": [],
        "In Progress": [],
        "Done": []
    });
    const dragItem = useRef()
    const dragCategory = useRef()

    useEffect(() => {
        setTasks({
            "To-Do": data.filter(task => task.category === "To-Do"),
            "In Progress": data.filter(task => task.category === "In Progress"),
            "Done": data.filter(task => task.category === "Done")
        });
    }, [data]);

    // drag start
    const handleDragstart = (e, task, category) => {
        dragItem.current = task;
        dragCategory.current = category;
        e.target.style.opacity = '0.5'
    }

    // drag end
    const handleDragEnd = (e) => {
        e.target.style.opacity = '1'
    }

    // drag over
    const handleDragOver = (e) => {
        e.preventDefault()
    }

    // drag and drop
    const handleDrop = (e, targetCategory) => {
        const item = dragItem.current;
        const sourchCategory = dragCategory.current;
        setTasks((prev) => {
            const newTask = { ...prev };
            newTask[sourchCategory] = newTask[sourchCategory].filter((i) => i !== item)
            newTask[targetCategory] = [...newTask[targetCategory], item]
            return newTask
        })
    }

    // delate task
    const handleDelete = (task) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        })
            .then((result) => {
                if (result.isConfirmed) {
                    axios.delete(`${import.meta.env.VITE_API_URL}/addTask/${task._id}`)
                        .then(res => {
                            if (res.data.deletedCount) {
                                Swal.fire({
                                    title: "Deleted!",
                                    text: `${task.title} has been deleted`,
                                    icon: "success"
                                });
                                refetch()
                            }
                        })
                }
            });
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-5">
            {Object.entries(tasks).map(([category, taskList]) => (
                <div
                    key={category}
                    onDrop={(e) => handleDrop(e, category)}
                    onDragOver={handleDragOver}
                    className="p-4 rounded shadow-lg bg-base-300">
                    <h2 className="text-xl text-center font-bold mb-2">{category}</h2>
                    {taskList.length > 0 ? (
                        taskList.map(task => (
                            <div
                                key={task._id}
                                onDragStart={(e) => handleDragstart(e, task, category)}
                                onDragEnd={handleDragEnd}
                                draggable
                                className="bg-base-100 p-4 my-6 rounded-lg cursor-move space-y-3">
                                <h3 className="text-xl font-semibold">{task.title}</h3>
                                <p>{task.description}</p>
                                <div className="flex justify-between items-center">
                                    <p>Date: {task.date}</p>
                                    <div className="space-x-2">
                                        <Link to={`/home/update/${task._id}`}>
                                            <button className="btn text-2xl text-gray-500"><FaRegEdit /></button>
                                        </Link>
                                        <button onClick={() => handleDelete(task)} className="btn text-2xl text-gray-500"><MdDeleteForever /></button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-400 text-xl">No tasks available</p>
                    )}
                </div>
            ))}
        </div>
    );
};

export default DragAndDrop;