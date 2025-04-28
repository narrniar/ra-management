import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Card, 
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  IconButton,
  Alert
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import GetAppIcon from '@mui/icons-material/GetApp';
import { useTranslation } from 'react-i18next';
import { API_BASE_URL } from '../../services/api';

const ApprovalHistory = () => {
  const { t } = useTranslation();
  const [approvals, setApprovals] = useState([]);
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch reports from localStorage on component mount
  useEffect(() => {
    try {
      // Get reports from localStorage
      const savedReports = JSON.parse(localStorage.getItem('professorReviewedReports') || '[]');
      setApprovals(savedReports);
    } catch (err) {
      console.error('Error fetching reports from localStorage:', err);
      setError('Failed to load reports from history');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleViewApproval = (approval) => {
    setSelectedApproval(approval);
  };

  const handleDownloadReport = async (reportTitle) => {
    try {
      // Implementation would go here - similar to the one in AssignedReports
      console.log('Downloading report:', reportTitle);
    } catch (err) {
      console.error('Error downloading report:', err);
    }
  };

  // Map status to display format
  const getStatusLabel = (status) => {
    switch (status?.toUpperCase()) {
      case 'APPROVED':
        return 'Approved';
      case 'REJECTED':
        return 'Rejected';
      case 'REWRITE_REQUESTED':
        return 'Rewrite Requested';
      default:
        return status || 'Unknown';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'APPROVED':
        return 'success';
      case 'REJECTED':
        return 'error';
      case 'REWRITE_REQUESTED':
        return 'info';
      default:
        return 'default';
    }
  };

  // Format dates to locale string
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t('approvalHistory.title', 'Approval History')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('approvalHistory.description', 'View history of reports you have reviewed')}
        </Typography>
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <Typography>Loading approval history...</Typography>
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && approvals.length === 0 && (
        <Alert severity="info" sx={{ mb: 3 }}>
          No approval history found. Review reports to see them here.
        </Alert>
      )}

      {!loading && !error && approvals.length > 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={selectedApproval ? 7 : 12}>
            <TableContainer component={Paper} sx={{ mb: 4 }}>
              <Table sx={{ minWidth: 650 }} aria-label="approval history table">
                <TableHead>
                  <TableRow>
                    <TableCell>{t('common.title')}</TableCell>
                    <TableCell>{t('common.student')}</TableCell>
                    <TableCell>{t('common.reviewedDate')}</TableCell>
                    <TableCell>{t('common.status')}</TableCell>
                    <TableCell align="right">{t('common.actions')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {approvals.map((approval, index) => (
                    <TableRow key={index}>
                      <TableCell component="th" scope="row">
                        {approval.reportTitle}
                      </TableCell>
                      <TableCell>
                        {`${approval.raFirstName || ''} ${approval.raLastName || ''}`}
                      </TableCell>
                      <TableCell>{formatDate(approval.reviewedDate)}</TableCell>
                      <TableCell>
                        <Chip 
                          label={getStatusLabel(approval.status)} 
                          color={getStatusColor(approval.status)} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          aria-label={t('common.view')}
                          onClick={() => handleViewApproval(approval)}
                          size="small"
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          aria-label={t('common.download')}
                          size="small"
                          onClick={() => handleDownloadReport(approval.reportTitle)}
                        >
                          <GetAppIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          {selectedApproval && (
            <Grid item xs={12} md={5}>
              <Card sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  {selectedApproval.reportTitle}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {t('common.student')}: {`${selectedApproval.raFirstName || ''} ${selectedApproval.raLastName || ''}`}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {t('common.reviewedOn')}: {formatDate(selectedApproval.reviewedDate)}
                </Typography>
                
                <Box sx={{ my: 2 }}>
                  <Chip 
                    label={getStatusLabel(selectedApproval.status)} 
                    color={getStatusColor(selectedApproval.status)}
                    sx={{ my: 1 }}
                  />
                </Box>
                
                <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                  {t('common.comments')}:
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.paper' }}>
                  <Typography variant="body2">
                    {selectedApproval.comments || 'No comments provided.'}
                  </Typography>
                </Paper>
                
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                  <Button
                    variant="outlined"
                    startIcon={<GetAppIcon />}
                    onClick={() => handleDownloadReport(selectedApproval.reportTitle)}
                  >
                    {t('common.downloadReport')}
                  </Button>
                </Box>
              </Card>
            </Grid>
          )}
        </Grid>
      )}
    </Container>
  );
};

export default ApprovalHistory; 