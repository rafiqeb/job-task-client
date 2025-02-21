import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../authentication/AuthProvider";


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
    console.log(tasks);

    const handleDragstart = (e, task, category) => {
        dragItem.current = task;
        dragCategory.current = category;
        e.target.style.opacity = '0.5'
    }

    const handleDragEnd = (e) => {
        e.target.style.opacity = '1'
    }

    const handleDragOver = (e)=> {
        e.preventDefault()
    }

    const handleDrop = (e, targetCategory)=> {
        const item = dragItem.current;
        const sourchCategory = dragCategory.current;
        setTasks((prev)=> {
            const newTask = {...prev};
            newTask[sourchCategory] = newTask[sourchCategory].filter((i)=> i !== item)
            newTask[targetCategory] = [...newTask[targetCategory], item]
            return newTask
        })
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-5">
            {Object.entries(tasks).map(([category, taskList]) => (
                <div
                    key={category}
                    onDrop={(e)=> handleDrop(e, category)}
                    onDragOver={handleDragOver}
                    className="border p-4 rounded shadow-lg bg-base-300">
                    <h2 className="text-xl text-center font-bold mb-2">{category}</h2>
                    {taskList.length > 0 ? (
                        taskList.map(task => (
                            <div
                                key={task._id}
                                onDragStart={(e) => handleDragstart(e, task, category)}
                                onDragEnd={handleDragEnd}
                                draggable
                                className="bg-gray-100 p-2 my-2 rounded cursor-move">
                                <p>{task.title}</p>
                                <p>{task.description}</p>
                                <p>{task.date}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-400">No tasks available</p>
                    )}
                </div>
            ))}
        </div>
    );
};

export default DragAndDrop;