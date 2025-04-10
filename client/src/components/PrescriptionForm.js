import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Alert,
  Snackbar,
  Autocomplete,
  TextareaAutosize
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';

const medications = [
  'Paracetamol',
  'Ibuprofen',
  'Amoxicillin',
  'Azithromycin',
  'Omeprazole',
  'Atorvastatin',
  'Metformin',
  'Losartan',
  'Amlodipine',
  'Levothyroxine'
];

const PrescriptionForm = () => {
  const [searchId, setSearchId] = useState('');
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedMedications, setSelectedMedications] = useState([]);
  const [notes, setNotes] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleSearch = async () => {
    if (!searchId.trim()) {
      setError('Please enter a patient ID');
      return;
    }

    setLoading(true);
    setError('');
    setPatient(null);

    try {
      const response = await axios.get(`http://localhost:5000/api/patients/${searchId}`);
      setPatient(response.data.patient);
    } catch (error) {
      setError(error.response?.data?.message || 'Patient not found');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!patient) {
      setError('Please search for a patient first');
      return;
    }

    if (selectedMedications.length === 0) {
      setError('Please select at least one medication');
      return;
    }

    try {
      const prescriptionData = {
        patient_id: patient._id,
        medications: selectedMedications,
        notes: notes.trim(),
        status: 'pending'
      };

      await axios.post('http://localhost:5000/api/prescriptions', prescriptionData);
      
      setSnackbar({
        open: true,
        message: 'Prescription created successfully!',
        severity: 'success'
      });

      // Reset form
      setSelectedMedications([]);
      setNotes('');
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Error creating prescription',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, p: 2 }}>
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Create Prescription
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Search Patient by ID"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              onKeyPress={handleKeyPress}
              error={!!error}
              helperText={error}
              InputProps={{
                endAdornment: (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSearch}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : <SearchIcon />}
                  >
                    Search
                  </Button>
                )
              }}
            />
          </Grid>

          {patient && (
            <>
              <Grid item xs={12}>
                <Paper elevation={1} sx={{ p: 2, bgcolor: 'background.default' }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Patient Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography><strong>Name:</strong> {patient.name}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography><strong>ID:</strong> {patient.unique_id}</Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  options={medications}
                  value={selectedMedications}
                  onChange={(event, newValue) => {
                    setSelectedMedications(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Medications"
                      placeholder="Choose medications"
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notes"
                  multiline
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  onClick={handleSubmit}
                >
                  Create Prescription
                </Button>
              </Grid>
            </>
          )}
        </Grid>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PrescriptionForm; 