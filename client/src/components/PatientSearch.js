import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Grid
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';

const PatientSearch = () => {
  const [searchId, setSearchId] = useState('');
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 4, p: 2 }}>
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Search Patient
        </Typography>
        
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              label="Enter Patient ID"
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
        </Grid>
      </Paper>

      {patient && (
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h6" gutterBottom>
            Patient Information
          </Typography>
          
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6}>
              <Typography><strong>Name:</strong> {patient.name}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography><strong>Contact:</strong> {patient.contact}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography><strong>ID:</strong> {patient.unique_id}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography><strong>Registration Date:</strong> {new Date(patient.createdAt).toLocaleDateString()}</Typography>
            </Grid>
          </Grid>

          <Typography variant="h6" gutterBottom>
            Visit History
          </Typography>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Doctor</TableCell>
                  <TableCell>Diagnosis</TableCell>
                  <TableCell>Prescription</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {patient.visits && patient.visits.length > 0 ? (
                  patient.visits.map((visit, index) => (
                    <TableRow key={index}>
                      <TableCell>{new Date(visit.date).toLocaleDateString()}</TableCell>
                      <TableCell>{visit.doctor}</TableCell>
                      <TableCell>{visit.diagnosis}</TableCell>
                      <TableCell>{visit.prescription}</TableCell>
                      <TableCell>
                        <Typography
                          sx={{
                            color: visit.status === 'completed' ? 'success.main' : 
                                  visit.status === 'pending' ? 'warning.main' : 'error.main'
                          }}
                        >
                          {visit.status}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No visit history found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Box>
  );
};

export default PatientSearch; 