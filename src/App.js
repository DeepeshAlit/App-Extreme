import 'devextreme/dist/css/dx.light.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './components/Login';
import Navigation from './components/Navigation';
import Home from './components/Home';
import DoctorList from './components/DoctorList';
import SpecialtyList from './components/SpecialtyList';
import ItemList from './components/ItemList';
// import AppointmentList from './components/AppointmentList';
// import ReceiptList from './components/ReceiptList';
// import { useState } from 'react';
// import { Button } from 'react-bootstrap';


function App() {
  

  return (
    <div className='d-flex' >
        <BrowserRouter>
          <Navigation />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/doctor" element={<DoctorList/>} />
            <Route path="/item" element={<ItemList/>} />
            <Route path="/specialty" element={<SpecialtyList />} />
            {/* <Route path="/appointment" element={<AppointmentList darkMode={darkMode}/>} />
            <Route path="/receipt" element={<ReceiptList darkMode={darkMode}/>} /> */}
          </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;