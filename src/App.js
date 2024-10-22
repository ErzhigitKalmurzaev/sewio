import { useState } from "react";
import AllRoutes from "./routes/AllRoutes";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function App() {

  const [num, setNum] = useState(0)

  return (
    <div className="transition-all easy-linear duration-300">
      <AllRoutes/>
      <ToastContainer autoClose={1000}/>
    </div>
  );
}

export default App;
