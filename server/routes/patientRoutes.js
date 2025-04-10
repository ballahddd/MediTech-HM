const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');

// Helper function to generate unique ID
const generatePatientId = () => {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000); // Generates 4-digit number
  return `HMS-${year}-${randomNum}`;
};

// Validation middleware
const validatePatient = (req, res, next) => {
  const { name, contact } = req.body;
  const errors = {};

  if (!name || name.trim().length < 2) {
    errors.name = 'Name is required and must be at least 2 characters long';
  }

  if (!contact || !/^[0-9+\-\s()]{10,15}$/.test(contact)) {
    errors.contact = 'Valid contact number is required (10-15 digits)';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      message: 'Validation failed',
      errors
    });
  }

  next();
};

// GET /api/patients - Get all patients
router.get('/', async (req, res) => {
  try {
    const patients = await Patient.find()
      .select('name contact unique_id registration_date')
      .sort({ registration_date: -1 });

    res.json({
      message: 'Patients retrieved successfully',
      count: patients.length,
      patients
    });
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({
      message: 'Error fetching patients',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/patients/:id - Get single patient
router.get('/:id', async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id)
      .select('name contact unique_id registration_date');

    if (!patient) {
      return res.status(404).json({
        message: 'Patient not found'
      });
    }

    res.json({
      message: 'Patient retrieved successfully',
      patient
    });
  } catch (error) {
    console.error('Error fetching patient:', error);
    res.status(500).json({
      message: 'Error fetching patient',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// POST /api/patients - Register new patient
router.post('/', validatePatient, async (req, res) => {
  try {
    const { name, contact } = req.body;

    // Generate unique ID
    const unique_id = generatePatientId();

    // Create new patient
    const patient = new Patient({
      name: name.trim(),
      contact: contact.trim(),
      unique_id
    });

    // Save to database
    await patient.save();

    res.status(201).json({
      message: 'Patient registered successfully',
      patient: {
        id: patient._id,
        name: patient.name,
        contact: patient.contact,
        unique_id: patient.unique_id,
        registration_date: patient.registration_date
      }
    });

  } catch (error) {
    console.error('Error registering patient:', error);
    res.status(500).json({
      message: 'Error registering patient',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// PUT /api/patients/:id - Update patient
router.put('/:id', validatePatient, async (req, res) => {
  try {
    const { name, contact } = req.body;
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        message: 'Patient not found'
      });
    }

    patient.name = name.trim();
    patient.contact = contact.trim();
    await patient.save();

    res.json({
      message: 'Patient updated successfully',
      patient: {
        id: patient._id,
        name: patient.name,
        contact: patient.contact,
        unique_id: patient.unique_id,
        registration_date: patient.registration_date
      }
    });
  } catch (error) {
    console.error('Error updating patient:', error);
    res.status(500).json({
      message: 'Error updating patient',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// DELETE /api/patients/:id - Delete patient
router.delete('/:id', async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);

    if (!patient) {
      return res.status(404).json({
        message: 'Patient not found'
      });
    }

    res.json({
      message: 'Patient deleted successfully',
      patient: {
        id: patient._id,
        name: patient.name,
        unique_id: patient.unique_id
      }
    });
  } catch (error) {
    console.error('Error deleting patient:', error);
    res.status(500).json({
      message: 'Error deleting patient',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router; 