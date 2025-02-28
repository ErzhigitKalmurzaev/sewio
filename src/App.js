import AllRoutes from "./routes/AllRoutes";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function App() {

  return (
    <div className="transition-all easy-linear duration-300">
      <AllRoutes/>
      <ToastContainer autoClose={1000}/>
    </div>
  );
}

export default App;
