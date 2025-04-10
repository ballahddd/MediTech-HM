import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import PatientList from './components/PatientList';
import PatientRegistration from './components/PatientRegistration';
import PatientSearch from './components/PatientSearch';
import PrescriptionForm from './components/PrescriptionForm';
import UserRegistration from './components/UserRegistration';
import AppointmentList from './components/AppointmentList';
import PrescriptionList from './components/PrescriptionList';
import Login from './components/Login';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="patients" element={<PatientList />} />
            <Route path="register" element={<PatientRegistration />} />
            <Route path="search" element={<PatientSearch />} />
            <Route path="prescribe" element={<PrescriptionForm />} />
            <Route path="users" element={<UserRegistration />} />
            <Route path="appointments" element={<AppointmentList />} />
            <Route path="prescriptions" element={<PrescriptionList />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App; 