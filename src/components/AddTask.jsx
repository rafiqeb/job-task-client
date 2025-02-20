import axios from "axios";
import { useContext } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../authentication/AuthProvider";


const AddTask = () => {
    const {user} = useContext(AuthContext)
    const navigate = useNavigate()

    const handleSubmit = async(e)=> {
        e.preventDefault();
        const form = e.target;
        const title = form.title.value;
        const description = form.description.value;
        const category = form.category.value;
        const date = new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
        const email = user?.email;
        const formData = {title, description, category, date, email}

        const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/addTask`, formData)
        
        if (data.insertedId) {
            toast.success('Your Task added successfully')
            navigate('/home')
        }
        form.reset()
    }
    return (
        <div>
            <div className="py-10">
                <h2 className="text-3xl font-bold text-center mt-16">Add Your Task</h2>
            </div>
            <div className="p-10 max-w-4xl mx-auto bg-slate-200 shadow-xl rounded-lg">
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold">Title:</h3>
                            <input type="text" name="title" placeholder="title"
                                className="px-4 py-2 rounded-lg w-full border border-blue-300" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Description:</h3>
                            <textarea type="text" name="description" className="textarea textarea-bordered h-24 w-full" placeholder="description"></textarea>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Category:</h3>
                            <select className="px-4 py-2 rounded-lg w-full border border-blue-300" name="category">
                                <option disabled selected>category</option>
                                <option>To-Do</option>
                                <option>In Progress</option>
                                <option>Done</option>
                            </select>
                        </div>
                    </div>
                    <input type="submit" value="Submit" className="px-4 py-1 w-full rounded-full bg-orange-400 mt-12 font-bold text-white" />
                </form>
            </div>
        </div>
    );
};

export default AddTask;