import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Grid,
  Tabs,
  Tab,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Snackbar,
} from '@mui/material';
import {
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Refresh as RewriteIcon,
  GetApp as DownloadIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { API_BASE_URL } from '../../services/api';
import api from '../../services/api';

const AssignedReports = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [downloadError, setDownloadError] = useState(null);
  
  // Dialog states
  const [approveDialog, setApproveDialog] = useState({
    open: false,
    report: null
  });
  const [rejectDialog, setRejectDialog] = useState({
    open: false,
    report: null,
    reason: ''
  });
  const [rewriteDialog, setRewriteDialog] = useState({
    open: false,
    report: null,
    reason: ''
  });

  // Fetch reports from API
  useEffect(() => {
    const fetchReports = async () => {
      if (!user?.email) {
        setError('User information not available. Please log in again.');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const response = await api.post('/file/report/prof/all', { 
          professorEmail: user.email 
        });
        setReports(response);
        setError(null);
      } catch (err) {
        console.error('Error fetching reports:', err);
        setError('Failed to load reports. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [user]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'APPROVED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'REJECTED':
        return 'error';
      default:
        return 'default';
    }
  };

  // Filter reports based on tab value
  const filterReportsByStatus = (status) => {
    return reports.filter(report => {
      if (status === 0) { // Pending
        return report.status?.toUpperCase() === 'PENDING';
      } else if (status === 1) { // Reviewed (Approved or Rejected)
        return report.status?.toUpperCase() === 'APPROVED' || report.status?.toUpperCase() === 'REJECTED';
      } else { // All
        return true;
      }
    });
  };

  const filteredReports = filterReportsByStatus(tabValue);

  // Handle report download
  const handleDownloadReport = async (reportTitle) => {
    if (!user?.email) {
      setDownloadError('User information not available. Please log in again.');
      return;
    }

    try {
      setDownloading(true);
      setDownloadError(null);
      
      // Use fetch directly for better control over binary response
      const response = await fetch(`${API_BASE_URL}/file/report/prof/pdf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          professorEmail: user.email,
          reportTitle: reportTitle
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to download report');
      }
      
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${reportTitle}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
      
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Error downloading report:', err);
      setDownloadError('Failed to download report. Please try again later.');
      setTimeout(() => setDownloadError(null), 5000);
    } finally {
      setDownloading(false);
    }
  };

  // Handle approval
  const handleApprove = async () => {
    try {
      // API call would go here
      console.log('Approving report:', approveDialog.report);
      
      // Save to localStorage
      const reportData = {
        ...approveDialog.report,
        status: 'APPROVED',
        reviewedDate: new Date().toISOString(),
        comments: 'Approved without comments'
      };
      
      // Get existing reports from localStorage or initialize empty array
      const savedReports = JSON.parse(localStorage.getItem('professorReviewedReports') || '[]');
      
      // Check if report already exists and update it, otherwise add new
      const reportIndex = savedReports.findIndex(r => r.reportTitle === reportData.reportTitle);
      if (reportIndex >= 0) {
        savedReports[reportIndex] = reportData;
      } else {
        savedReports.push(reportData);
      }
      
      // Save back to localStorage
      localStorage.setItem('professorReviewedReports', JSON.stringify(savedReports));
      
      // Close dialog and refresh reports
      setApproveDialog({ open: false, report: null });
      
      // Update the status in the local state (in a real app, you'd fetch fresh data)
      setReports(reports.map(report => 
        report.reportTitle === approveDialog.report.reportTitle 
          ? { ...report, status: 'APPROVED' } 
          : report
      ));
      
    } catch (error) {
      console.error('Error approving report:', error);
      setError('Failed to approve report');
    }
  };

  // Handle rejection
  const handleReject = async () => {
    try {
      if (!rejectDialog.reason.trim()) {
        return; // Don't submit if reason is empty
      }
      
      // API call would go here
      console.log('Rejecting report:', rejectDialog.report, 'Reason:', rejectDialog.reason);
      
      // Save to localStorage
      const reportData = {
        ...rejectDialog.report,
        status: 'REJECTED',
        reviewedDate: new Date().toISOString(),
        comments: rejectDialog.reason
      };
      
      // Get existing reports from localStorage or initialize empty array
      const savedReports = JSON.parse(localStorage.getItem('professorReviewedReports') || '[]');
      
      // Check if report already exists and update it, otherwise add new
      const reportIndex = savedReports.findIndex(r => r.reportTitle === reportData.reportTitle);
      if (reportIndex >= 0) {
        savedReports[reportIndex] = reportData;
      } else {
        savedReports.push(reportData);
      }
      
      // Save back to localStorage
      localStorage.setItem('professorReviewedReports', JSON.stringify(savedReports));
      
      // Close dialog and refresh reports
      setRejectDialog({ open: false, report: null, reason: '' });
      
      // Update the status in the local state
      setReports(reports.map(report => 
        report.reportTitle === rejectDialog.report.reportTitle 
          ? { ...report, status: 'REJECTED' } 
          : report
      ));
      
    } catch (error) {
      console.error('Error rejecting report:', error);
      setError('Failed to reject report');
    }
  };

  // Handle rewrite request
  const handleRewrite = async () => {
    try {
      if (!rewriteDialog.reason.trim()) {
        return; // Don't submit if reason is empty
      }
      
      // API call would go here
      console.log('Requesting rewrite for report:', rewriteDialog.report, 'Reason:', rewriteDialog.reason);
      
      // Save to localStorage
      const reportData = {
        ...rewriteDialog.report,
        status: 'REWRITE_REQUESTED',
        reviewedDate: new Date().toISOString(),
        comments: rewriteDialog.reason
      };
      
      // Get existing reports from localStorage or initialize empty array
      const savedReports = JSON.parse(localStorage.getItem('professorReviewedReports') || '[]');
      
      // Check if report already exists and update it, otherwise add new
      const reportIndex = savedReports.findIndex(r => r.reportTitle === reportData.reportTitle);
      if (reportIndex >= 0) {
        savedReports[reportIndex] = reportData;
      } else {
        savedReports.push(reportData);
      }
      
      // Save back to localStorage
      localStorage.setItem('professorReviewedReports', JSON.stringify(savedReports));
      
      // Close dialog and refresh reports
      setRewriteDialog({ open: false, report: null, reason: '' });
      
      // Update the status in the local state (assuming we have a rewrite status to display)
      setReports(reports.map(report => 
        report.reportTitle === rewriteDialog.report.reportTitle 
          ? { ...report, status: 'REWRITE_REQUESTED' } 
          : report
      ));
      
    } catch (error) {
      console.error('Error requesting rewrite:', error);
      setError('Failed to request rewrite');
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t('assignedReports.title', 'Assigned Reports')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('assignedReports.description', 'Review and manage reports assigned to you')}
        </Typography>
      </Box>

      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        sx={{ mb: 3 }}
        aria-label="assigned reports tabs"
      >
        <Tab label={t('assignedReports.pending', 'Pending Review')} />
        <Tab label={t('assignedReports.reviewed', 'Reviewed')} />
        <Tab label={t('assignedReports.all', 'All Reports')} />
      </Tabs>

      {/* Loading and Error States */}
      {loading && (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Reports Table */}
      {!loading && !error && (
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('common.title', 'Report Title')}</TableCell>
                  <TableCell>{t('common.student', 'Research Assistant')}</TableCell>
                  <TableCell>{t('common.submittedDate', 'Submission Date')}</TableCell>
                  <TableCell>{t('common.status', 'Status')}</TableCell>
                  <TableCell align="right">{t('common.actions', 'Actions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredReports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      {t('assignedReports.noReports', 'No reports found')}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReports.map((report, index) => (
                    <TableRow key={index}>
                      <TableCell>{report.reportTitle}</TableCell>
                      <TableCell>
                        {`${report.raFirstName} ${report.raLastName}`}
                      </TableCell>
                      <TableCell>
                        {new Date(report.creationDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={report.status} 
                          color={getStatusColor(report.status)} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                          {report.status?.toUpperCase() === 'PENDING' && (
                            <>
                              <Tooltip title={t('common.approve', 'Approve')}>
                                <IconButton 
                                  color="success" 
                                  size="small"
                                  onClick={() => setApproveDialog({ open: true, report })}
                                >
                                  <ApproveIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title={t('common.reject', 'Reject')}>
                                <IconButton 
                                  color="error" 
                                  size="small"
                                  onClick={() => setRejectDialog({ open: true, report, reason: '' })}
                                >
                                  <RejectIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title={t('common.rewrite', 'Request Rewrite')}>
                                <IconButton 
                                  color="primary" 
                                  size="small"
                                  onClick={() => setRewriteDialog({ open: true, report, reason: '' })}
                                >
                                  <RewriteIcon />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}
                          <Tooltip title={t('common.download', 'Download')}>
                            <IconButton 
                              size="small"
                              onClick={() => handleDownloadReport(report.reportTitle)}
                              disabled={downloading}
                            >
                              <DownloadIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Approve Dialog */}
      <Dialog
        open={approveDialog.open}
        onClose={() => setApproveDialog({ open: false, report: null })}
      >
        <DialogTitle>{t('assignedReports.approveTitle', 'Approve Report')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('assignedReports.approveConfirm', 'Are you sure you want to approve this report?')}
          </DialogContentText>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              {t('common.report', 'Report')}: 
            </Typography>
            <Typography variant="body2">
              {approveDialog.report?.reportTitle}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApproveDialog({ open: false, report: null })}>
            {t('common.cancel', 'Cancel')}
          </Button>
          <Button onClick={handleApprove} variant="contained" color="success">
            {t('common.approve', 'Approve')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog
        open={rejectDialog.open}
        onClose={() => setRejectDialog({ open: false, report: null, reason: '' })}
      >
        <DialogTitle>{t('assignedReports.rejectTitle', 'Reject Report')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('assignedReports.rejectConfirm', 'Please provide a reason for rejecting this report:')}
          </DialogContentText>
          <Box sx={{ mt: 2, mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              {t('common.report', 'Report')}: 
            </Typography>
            <Typography variant="body2">
              {rejectDialog.report?.reportTitle}
            </Typography>
          </Box>
          <TextField
            autoFocus
            margin="dense"
            label={t('common.reason', 'Reason')}
            fullWidth
            multiline
            rows={4}
            value={rejectDialog.reason}
            onChange={(e) => setRejectDialog({ ...rejectDialog, reason: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectDialog({ open: false, report: null, reason: '' })}>
            {t('common.cancel', 'Cancel')}
          </Button>
          <Button 
            onClick={handleReject} 
            variant="contained" 
            color="error"
            disabled={!rejectDialog.reason.trim()}
          >
            {t('common.reject', 'Reject')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Rewrite Dialog */}
      <Dialog
        open={rewriteDialog.open}
        onClose={() => setRewriteDialog({ open: false, report: null, reason: '' })}
      >
        <DialogTitle>{t('assignedReports.rewriteTitle', 'Request Rewrite')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('assignedReports.rewriteConfirm', 'Please provide instructions for rewriting this report:')}
          </DialogContentText>
          <Box sx={{ mt: 2, mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              {t('common.report', 'Report')}: 
            </Typography>
            <Typography variant="body2">
              {rewriteDialog.report?.reportTitle}
            </Typography>
          </Box>
          <TextField
            autoFocus
            margin="dense"
            label={t('common.instructions', 'Instructions')}
            fullWidth
            multiline
            rows={4}
            value={rewriteDialog.reason}
            onChange={(e) => setRewriteDialog({ ...rewriteDialog, reason: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRewriteDialog({ open: false, report: null, reason: '' })}>
            {t('common.cancel', 'Cancel')}
          </Button>
          <Button 
            onClick={handleRewrite} 
            variant="contained" 
            color="primary"
            disabled={!rewriteDialog.reason.trim()}
          >
            {t('common.send', 'Send')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success notification */}
      <Snackbar
        open={downloadSuccess}
        autoHideDuration={3000}
        onClose={() => setDownloadSuccess(false)}
        message="Report downloaded successfully"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      />

      {/* Error notification */}
      <Snackbar
        open={!!downloadError}
        autoHideDuration={5000}
        onClose={() => setDownloadError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setDownloadError(null)} severity="error" sx={{ width: '100%' }}>
          {downloadError}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AssignedReports; 