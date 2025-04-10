const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Patient name is required'],
    trim: true
  },
  contact: {
    type: String,
    required: [true, 'Contact information is required'],
    trim: true
  },
  unique_id: {
    type: String,
    required: [true, 'Unique ID is required'],
    unique: true,
    trim: true
  },
  registration_date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create index for faster queries
patientSchema.index({ unique_id: 1 });
patientSchema.index({ name: 1 });

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient; 