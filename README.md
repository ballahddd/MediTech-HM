# MediTech Hospital Management System

A comprehensive hospital management system built with React and Node.js.

## Features

- Patient Registration
- Patient Search
- Prescription Management
- Appointment Scheduling
- Visit History Tracking

## Setup Instructions

1. **Prerequisites**
   - Node.js (v14 or higher)
   - npm (comes with Node.js)

2. **Installation**
   ```bash
   # Install all dependencies
   npm run install-all
   ```

3. **Running the Application**
   ```bash
   # Start both client and server
   npm start
   ```

4. **Accessing the Application**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

## Project Structure

- `client/` - React frontend application
  - `src/components/` - React components
    - `PatientRegistration.js` - Patient registration form
    - `PatientSearch.js` - Patient search component
    - `PrescriptionForm.js` - Doctor's prescription form
    - `Layout.js` - Main layout component
    - `Login.js` - Authentication component

- `server/` - Node.js backend application
  - `models/` - MongoDB models
  - `routes/` - API routes
  - `server.js` - Main server file

## Troubleshooting

If you encounter issues with Node.js not being recognized:
1. Verify Node.js installation in `C:\Program Files\nodejs`
2. Add Node.js to system PATH:
   - Add `C:\Program Files\nodejs` to system environment variables
3. Restart terminal after making PATH changes 