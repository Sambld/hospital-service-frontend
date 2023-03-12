import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from "react-router-dom";

//css
import './index.css'
//layouts
import RootLayout from "./layouts/RootLayout";
//pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Staff from "./pages/Staff";
import Patients from "./pages/Patients";
import Patient,{RecordLoader} from "./pages/Patient";
import NotFound from "./pages/NotFound";





const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<Dashboard />} />
      <Route path='profile' element={<Profile />} />
      <Route path='staff' element={<Staff />} />
      <Route path='Patients' element={<Patients />}>
        <Route path=':id' element={<Patient />} loader={RecordLoader} />
      </Route>
      <Route path='*' element={<NotFound />} />
    </Route>
    
  )
);


function App() {
  
  return (
      <RouterProvider router={router}/>
  );
}

export default App;