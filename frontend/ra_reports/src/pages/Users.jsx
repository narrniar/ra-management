import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Tab,
  Tabs,
  Paper,
  IconButton,
  Select,
  MenuItem,
  Radio,
  RadioGroup,
  FormControlLabel,
  Switch,
  Container,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './UsersForm.css';

const Users = () => {
  console.log('Users component rendering');
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [tabValue, setTabValue] = useState(0);
  const [mainRequisitesExpanded, setMainRequisitesExpanded] = useState(true);
  const [attachmentsExpanded, setAttachmentsExpanded] = useState(true);
  const [counterpartyExpanded, setCounterpartyExpanded] = useState(true);
  const [contractorIdExpanded, setContractorIdExpanded] = useState(true);
  const [counterpartyType, setCounterpartyType] = useState('Physical person');
  const [isResident, setIsResident] = useState('');
  const [foreignBank, setForeignBank] = useState('');
  const [advancePayment, setAdvancePayment] = useState(false);
  const [reimbursableExpenses, setReimbursableExpenses] = useState(false);
  const [extensionAgreed, setExtensionAgreed] = useState('');
  const [formData, setFormData] = useState({
    // Contract Header
    contractNumber: '',
    agreementDate: '',
    contractType: '',
    subcategory: '',
    
    // Parties Involved
    professorName: '',
    professorPosition: '',
    institution: '',
    department: '',
    raName: '',
    raEmail: '',
    raPhone: '',
    studentStatus: '',
    
    // Project Details
    projectTitle: '',
    projectCode: '',
    projectDescription: '',
    startDate: '',
    endDate: '',
    activityType: '',
    costItem: '',
    
    // Scope of Work
    literatureReviews: false,
    dataCollection: false,
    experimentation: false,
    reportWriting: false,
    teamMeetings: false,
    otherResponsibilities: '',
    
    // Working Hours
    weeklyHours: '',
    workLocation: 'on-site',
    specificDays: '',
    
    // Compensation
    compensationType: 'monthly',
    amount: '',
    paymentSchedule: 'monthly',
    currency: '',
    advancePercentage: '26',
    
    // Confidentiality
    confidentialityAgreement: false,
    ipRights: '',
    publicationRights: '',
    
    // Evaluation
    reportFrequency: '',
    evaluationMethod: '',
    performanceMetrics: '',
    
    // Termination
    terminationNotice: '',
    terminationGrounds: '',
  });

  useEffect(() => {
    console.log('Users mounted');
    // Check if user is admin, if not redirect to profile
    if (user && user.role !== 'ADMIN') {
      navigate('/profile');
    }
    return () => {
      console.log('Users unmounted');
    };
  }, [user, navigate]);

  const steps = [
    'Basic Information',
    'Parties Details',
    'Project & Work',
    'Review & Submit'
  ];

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    
    // Download PDF file
    // NOTE: Make sure the file exists at public/downloads/pdf/doc_contract.pdf
    const pdfUrl = '/downloads/pdf/doc_contract.pdf';
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = 'user_contract.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Redirect after submission
    setTimeout(() => {
      navigate('/adminprofile');
    }, 1000);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCounterpartyTypeChange = (event) => {
    setCounterpartyType(event.target.value);
  };

  const handleResidentChange = (event) => {
    setIsResident(event.target.value);
  };

  const handleForeignBankChange = (event) => {
    setForeignBank(event.target.value);
  };

  const handleAdvancePaymentChange = (event) => {
    setAdvancePayment(event.target.checked);
  };

  const handleReimbursableExpensesChange = (event) => {
    setReimbursableExpenses(event.target.checked);
  };

  const handleExtensionAgreedChange = (event) => {
    setExtensionAgreed(event.target.value);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Contract Basic Information
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Contract Number"
                  name="contractNumber"
                  value={formData.contractNumber}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Date of Agreement"
                  name="agreementDate"
                  type="date"
                  value={formData.agreementDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Contract Type"
                  name="contractType"
                  value={formData.contractType}
                  onChange={handleChange}
                  required
                />
              </Grid>
            </Grid>
          </Box>
        );
      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Parties Information
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Professor's Full Name"
                  name="professorName"
                  value={formData.professorName}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Position/Title"
                  name="professorPosition"
                  value={formData.professorPosition}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Institution"
                  name="institution"
                  value={formData.institution}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Research Assistant's Name"
                  name="raName"
                  value={formData.raName}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="RA's Email"
                  name="raEmail"
                  type="email"
                  value={formData.raEmail}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="RA's Phone"
                  name="raPhone"
                  value={formData.raPhone}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Student Status"
                  name="studentStatus"
                  value={formData.studentStatus}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Project Details
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Project Title"
                  name="projectTitle"
                  value={formData.projectTitle}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Project Code/ID"
                  name="projectCode"
                  value={formData.projectCode}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Project Description"
                  name="projectDescription"
                  multiline
                  rows={4}
                  value={formData.projectDescription}
                  onChange={handleChange}
                  //required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Start Date"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="End Date"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              
            </Grid>
            <Divider sx={{ my: 3 }} />
             
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Weekly Hours"
                  name="weeklyHours"
                  type="number"
                  value={formData.weeklyHours}
                  onChange={handleChange}
                  required
                />
              </Grid>
            </Grid>
          </Box>
        );
      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Review Contract Details
            </Typography>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Please review all the information before submitting the contract.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                By submitting this form, you agree to all the terms and conditions outlined in the contract.
              </Typography>
            </Paper>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg" className="contract-form">
      <Box className="title-container">
        <Typography variant="h4" className="page-title">
          Create New Contract
        </Typography>
      </Box>
      
      <Card>
        <CardHeader
          title="Research Assistant Contract Agreement"
          subheader="Fill in the contract details below"
        />
        <CardContent>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {renderStepContent(activeStep)}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button
              variant="outlined"
              onClick={handleBack}
              disabled={activeStep === 0}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleSubmit}
              >
                Submit
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
              >
                Next
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Users; 