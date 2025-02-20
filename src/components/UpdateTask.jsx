import axios from "axios";
import { useLoaderData, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";


const UpdateTask = () => {
    const data = useLoaderData()
    const navigate = useNavigate()
    
    const handleUpdate = async(e)=> {
        e.preventDefault();
        const form = e.target;
        const title = form.title.value;
        const description = form.description.value;
        const category = form.category.value;
        const formData = {title, description, category}

        const updated = await axios.patch(`${import.meta.env.VITE_API_URL}/updateTask/${data._id}`, formData)

        if (updated.data.modifiedCount > 0) {
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: `${data.name} is updated`,
                showConfirmButton: false,
                timer: 2000
            });
            form.reset()
            navigate('/home/manageTask')
        }
    }
    return (
        <div>
            <div className="py-10">
                <h2 className="text-3xl font-bold text-center mt-16">Update Your Task</h2>
            </div>
            <div className="p-10 max-w-4xl mx-auto bg-slate-200 shadow-xl rounded-lg">
                <form onSubmit={handleUpdate}>
                    <div className="grid grid-cols-1 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold">Title:</h3>
                            <input type="text" name="title" placeholder="title" defaultValue={data.title}
                                className="px-4 py-2 rounded-lg w-full border border-blue-300" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Description:</h3>
                            <textarea type="text" name="description" defaultValue={data.description} className="textarea textarea-bordered h-24 w-full" placeholder="description"></textarea>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Category:</h3>
                            <select className="px-4 py-2 rounded-lg w-full border border-blue-300" name="category" defaultValue={data.category}>
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

export default UpdateTask;