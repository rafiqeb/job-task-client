import { Outlet } from "react-router-dom";
import Login from "../authentication/Login";


const MainLayout = () => {
    return (
        <div>
            navber
            <Outlet></Outlet>
            footer
        </div>
    );
};

export default MainLayout;