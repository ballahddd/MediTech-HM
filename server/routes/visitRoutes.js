const express = require('express');
const router = express.Router();
const Visit = require('../models/Visit');
const Patient = require('../models/Patient');

// Validation middleware
const validateVisit = async (req, res, next) => {
  const { patient_id, screening_notes } = req.body;
  const errors = {};

  if (!patient_id) {
    errors.patient_id = 'Patient ID is required';
  } else {
    // Check if patient exists
    const patient = await Patient.findById(patient_id);
    if (!patient) {
      errors.patient_id = 'Patient not found';
    }
  }

  if (!screening_notes || screening_notes.trim().length < 10) {
    errors.screening_notes = 'Screening notes are required and must be at least 10 characters long';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      message: 'Validation failed',
      errors
    });
  }

  next();
};

// POST /api/visits - Log new visit
router.post('/', validateVisit, async (req, res) => {
  try {
    const { patient_id, screening_notes } = req.body;

    // Create new visit
    const visit = new Visit({
      patient_id,
      screening_notes: screening_notes.trim(),
      date: new Date()
    });

    // Save to database
    await visit.save();

    // Populate patient details in response
    await visit.populate('patient_id', 'name unique_id');

    res.status(201).json({
      message: 'Visit logged successfully',
      visit: {
        id: visit._id,
        patient: {
          id: visit.patient_id._id,
          name: visit.patient_id.name,
          unique_id: visit.patient_id.unique_id
        },
        date: visit.date,
        screening_notes: visit.screening_notes
      }
    });

  } catch (error) {
    console.error('Error logging visit:', error);
    res.status(500).json({
      message: 'Error logging visit',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/visits - Get all visits
router.get('/', async (req, res) => {
  try {
    const visits = await Visit.find()
      .populate('patient_id', 'name unique_id')
      .sort({ date: -1 });

    res.json({
      message: 'Visits retrieved successfully',
      count: visits.length,
      visits: visits.map(visit => ({
        id: visit._id,
        patient: {
          id: visit.patient_id._id,
          name: visit.patient_id.name,
          unique_id: visit.patient_id.unique_id
        },
        date: visit.date,
        screening_notes: visit.screening_notes
      }))
    });
  } catch (error) {
    console.error('Error fetching visits:', error);
    res.status(500).json({
      message: 'Error fetching visits',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/visits/:id - Get single visit
router.get('/:id', async (req, res) => {
  try {
    const visit = await Visit.findById(req.params.id)
      .populate('patient_id', 'name unique_id');

    if (!visit) {
      return res.status(404).json({
        message: 'Visit not found'
      });
    }

    res.json({
      message: 'Visit retrieved successfully',
      visit: {
        id: visit._id,
        patient: {
          id: visit.patient_id._id,
          name: visit.patient_id.name,
          unique_id: visit.patient_id.unique_id
        },
        date: visit.date,
        screening_notes: visit.screening_notes
      }
    });
  } catch (error) {
    console.error('Error fetching visit:', error);
    res.status(500).json({
      message: 'Error fetching visit',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/visits/patient/:patientId - Get all visits for a specific patient
router.get('/patient/:patientId', async (req, res) => {
  try {
    const visits = await Visit.find({ patient_id: req.params.patientId })
      .populate('patient_id', 'name unique_id')
      .sort({ date: -1 });

    res.json({
      message: 'Patient visits retrieved successfully',
      count: visits.length,
      visits: visits.map(visit => ({
        id: visit._id,
        patient: {
          id: visit.patient_id._id,
          name: visit.patient_id.name,
          unique_id: visit.patient_id.unique_id
        },
        date: visit.date,
        screening_notes: visit.screening_notes
      }))
    });
  } catch (error) {
    console.error('Error fetching patient visits:', error);
    res.status(500).json({
      message: 'Error fetching patient visits',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router; 