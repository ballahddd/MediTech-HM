const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
  patient_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: [true, 'Patient ID is required']
  },
  date: {
    type: Date,
    required: [true, 'Visit date is required'],
    default: Date.now
  },
  screening_notes: {
    type: String,
    required: [true, 'Screening notes are required'],
    trim: true
  }
}, {
  timestamps: true
});

// Create index for faster queries
visitSchema.index({ patient_id: 1 });
visitSchema.index({ date: 1 });

const Visit = mongoose.model('Visit', visitSchema);

module.exports = Visit; 