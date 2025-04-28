import React, { useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Alert,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import api from '../services/api';
import { API_BASE_URL } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const TabPanel = ({ children, value, index }) => (
  <div role="tabpanel" hidden={value !== index}>
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

const ReportSubmission = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [rows, setRows] = useState([{ id: 1, hours: '', task: '', date: '' }]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [formData, setFormData] = useState({
    projectName: '',
    reportType: '',
    period: '',
    description: '',
    reportTitle: '',
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleAddRow = () => {
    const newRow = {
      id: rows.length + 1,
      hours: '',
      task: '',
      date: '',
    };
    setRows([...rows, newRow]);
  };

  const handleDeleteRow = (id) => {
    setRows(rows.filter(row => row.id !== id));
  };

  const handleRowChange = (id, field, value) => {
    setRows(rows.map(row => 
      row.id === id ? { ...row, [field]: value } : row
    ));
  };

  const handleSubmit = () => {
    setConfirmOpen(true);
  };

  const submitReport = async () => {
    setSubmitting(true);
    setSubmitError('');
    
    try {
      // Format tasks according to the specified structure
      const tasks = rows.map(({ id, task, ...rest }) => ({
        date: rest.date || "Not specified",
        hours: rest.hours ? `${rest.hours} hours` : "Not specified",
        description: task || "No description provided"
      }));
      
      // Prepare data according to the specified JSON structure
      const reportData = {
        // RA Information (using current user if available)
        ra_firstname: user?.firstName || "John",
        ra_lastname: user?.lastName || "Doe",
        ra_email: user?.email || "john.doe@example.com",
        
        // PA Information (placeholder as requested)
        pa_firstname: user?.PA_firstname || "prof",
        pa_lastname: user?.PA_lastname || "prof",
        pa_email: user?.PA_email || "prof@example.com",
        
        // Project details
        project_name: formData.projectName,
        report_title: formData.reportTitle,
        
        // Report details
        report_type: formData.reportType,
        reporting_period: formData.period,
        description: formData.description,
        
        // Tasks list
        tasks: tasks
      };
      
      console.log("Submitting report data:", reportData);
      
      // Send to API
      // const response = await api.post('/generate/report', reportData)

      // const response = await api.request('/generate/report', "POST", reportData, true);
      // const blob = await response.blob();                                // :contentReference[oaicite:7]{index=7}
      // const blobUrl = URL.createObjectURL(blob);                         // :contentReference[oaicite:8]{index=8}
  
      // // Инициируем скачивание
      // const link = document.createElement('a');                          // :contentReference[oaicite:9]{index=9}
      // link.href = blobUrl;
      // link.download = 'report.pdf';
      // document.body.appendChild(link);
      // link.click();
      // link.remove();
      // URL.revokeObjectURL(blobUrl); 
      const response = await fetch(`${API_BASE_URL}/generate/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(reportData),
      });

      if (!response.ok) {
        throw new Error('Failed to generate report');
      }

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'report.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);



      // Handle success
      setSubmitSuccess(true);
      setConfirmOpen(false);
      
      // Reset form if desired
      resetForm();
      
    } catch (error) {
      console.error('Error submitting report:', error);
      setSubmitError(error.message || 'Failed to submit report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  
  const resetForm = () => {
    setFormData({
      projectName: '',
      reportType: '',
      period: '',
      description: '',
      reportTitle: '',
    });
    setRows([{ id: 1, hours: '', task: '', date: '' }]);
  };

  const handleCloseSnackbar = () => {
    setSubmitSuccess(false);
  };

  const approvalSteps = [
    'Submitted',
    'Department Head Review',
    'Research Office Review',
    'Final Approval',
  ];

  // Preview of the JSON that will be sent

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Report Submission
      </Typography>

      {submitError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {submitError}
        </Alert>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Report Form" />
          <Tab label="Approval Route" />
        </Tabs>
      </Box>

      {/* Report Form Tab */}
      <TabPanel value={tabValue} index={0}>
        <Paper sx={{ p: 3 }}>
          <Box component="form">
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Project Name"
                  value={formData.projectName}
                  onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Report Title"
                  value={formData.reportTitle}
                  onChange={(e) => setFormData({ ...formData, reportTitle: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Report Type"
                  value={formData.reportType}
                  onChange={(e) => setFormData({ ...formData, reportType: e.target.value })}
                  required
                  helperText=""
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Reporting Period"
                  value={formData.period}
                  onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                  required
                  helperText=""
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  helperText=""
                />
              </Grid>
            </Grid>

            <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
              Time and Task Details
            </Typography>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Hours</TableCell>
                    <TableCell>Task Description</TableCell>
                    <TableCell width={50}></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>
                        <TextField
                          type="text"
                          value={row.date}
                          onChange={(e) => handleRowChange(row.id, 'date', e.target.value)}
                          size="small"
                          required
                          helperText="Format as needed (e.g., '2023 2023 50 28')"
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="text"
                          value={row.hours}
                          onChange={(e) => handleRowChange(row.id, 'hours', e.target.value)}
                          size="small"
                          required
                          helperText=""
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          fullWidth
                          value={row.task}
                          onChange={(e) => handleRowChange(row.id, 'task', e.target.value)}
                          size="small"
                          required
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteRow(row.id)}
                          disabled={rows.length === 1}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Button
              startIcon={<AddIcon />}
              onClick={handleAddRow}
              sx={{ mt: 2 }}
            >
              Add Task
            </Button>

            <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSubmit}
                disabled={!formData.projectName || !formData.reportType || !formData.period}
              >
                Submit Report
              </Button>
            </Box>
          </Box>
        </Paper>
      </TabPanel>

      {/* Approval Route Tab */}
      <TabPanel value={tabValue} index={1}>
        <Paper sx={{ p: 3 }}>
          <Stepper orientation="vertical">
            {approvalSteps.map((label, index) => (
              <Step key={label} active={index === 0}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>
      </TabPanel>

      {/* Confirmation Dialog */}
      <Dialog open={confirmOpen} onClose={() => !submitting && setConfirmOpen(false)}>
        <DialogTitle>Submit Report</DialogTitle>
        <DialogContent>
          {submitting ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Typography>
              Are you sure you want to submit this report? Once submitted, it will be sent for approval.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} disabled={submitting}>Cancel</Button>
          <Button
            variant="contained"
            onClick={submitReport}
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success message */}
      <Snackbar
        open={submitSuccess}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Report submitted successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ReportSubmission; 