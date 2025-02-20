import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'


import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from './components/Home';
import AuthProvider from './authentication/AuthProvider';
import MainLayout from './components/MainLayout';
import Login from './authentication/Login';
import AddTask from './components/AddTask';
import toast, { Toaster } from 'react-hot-toast';
import ManageTask from './components/ManageTask';


import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import UpdateTask from './components/UpdateTask';

const queryClient = new QueryClient()


const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout></MainLayout>,
    children: [
      {
        path: '/',
        element: <Login></Login>
      }
    ]
  },
  {
    path: 'home',
    element: <Home></Home>,
    children: [
      {
        path: 'addTask',
        element: <AddTask></AddTask>
      },
      {
        path: 'manageTask',
        element: <ManageTask></ManageTask>
      },
      {
        path: 'update/:id',
        element: <UpdateTask></UpdateTask>,
        loader: ({params})=> fetch(`${import.meta.env.VITE_API_URL}/addTasks/${params.id}`)
      }
    ]
  }
]);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
)
