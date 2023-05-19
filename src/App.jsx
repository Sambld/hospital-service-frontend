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
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Staff from "./pages/Staff";
import Patients from "./pages/Patients";
import Patient from "./pages/Patient";
import NotFound from "./pages/NotFound";
import Medicines from "./pages/Medicines";
import Prescriptions from "./pages/Prescriptions";
import Medicine from "./pages/Medicine";
import MedicalRecords from "./pages/MedicalRecords";
import Statistics from "./pages/Statistics";
import About from "./pages/About";

// translation
import './i18n';




const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<Dashboard />} />
      <Route path='profile' element={<Profile />} />
      <Route path='staff' element={<Staff />} />
      <Route path='Patients' element={<Patients />}>
        <Route path=':id' element={<Patient />} />
      </Route>
      <Route path='prescriptions' element={<Prescriptions />}/>
      <Route path='medicines' element={<Medicines />} >
        <Route path=':id' element={<Medicine />} />
      </Route>
      <Route path='medical-records' element={<MedicalRecords />} />
      <Route path='statistics' element={<Statistics />} />
      <Route path='about' element={<About />} />
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