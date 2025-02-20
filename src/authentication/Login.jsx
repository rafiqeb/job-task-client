import { useContext } from "react";
import { FcGoogle } from "react-icons/fc";
import { AuthContext } from "./AuthProvider";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const Login = () => {
    const { signInWithGoogle } = useContext(AuthContext)
    const navigate = useNavigate()

    const handleGoogleLogin = () => {
        signInWithGoogle()
            .then(result => {
                const userInfo = {
                    name: result.user?.displayName,
                    email: result.user?.email,
                    image: result.user?.photoURL,
                }
                axios.post(`${import.meta.env.VITE_API_URL}/users`, userInfo)
                    .then(res => {
                        toast.success('Signin Successful')
                        navigate('/home')
                    })
            })
            .catch(error => {
                toast.error(error?.message)
            })
    }

    return (
        <div>
            <div className="max-w-lg mx-auto bg-base-200 p-10 shadow-xl rounded-xl">
                <form>
                    <button type="button"
                        onClick={handleGoogleLogin}
                        className="px-4 py-2 rounded-lg w-full border border-blue-300 flex justify-center items-center gap-6">
                        <p className="text-2xl"><FcGoogle /></p>
                        <h4 className="font-semibold">Login with Google</h4>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;