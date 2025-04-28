import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  MenuItem,
  Grid,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import {
  GetApp as GetAppIcon,
} from '@mui/icons-material';
import api from '../services/api';
import { API_BASE_URL } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const AllReports = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [downloadError, setDownloadError] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    startDate: null,
    endDate: null,
    search: '',
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
        const response = await api.post('/file/report/all', { email: user.email });
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
    setPage(0);
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

  // Handle report download
  const handleDownloadReport = async (reportTitle) => {
    if (!user?.email) {
      setDownloadError('User information not available. Please log in again.');
      return;
    }

    try {
      setDownloading(true);
      setDownloadError(null);
      
      // const response = await api.post('/file/report/pdf', {
      //   email: user.email,
      //   reportTitle: reportTitle
      // }, { responseType: 'blob' });

      const response = await fetch(`${API_BASE_URL}/file/report/pdf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: user.email,
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
      link.download = 'report.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);

      
      setDownloadSuccess(true);
    } catch (err) {
      console.error('Error downloading report:', err);
      setDownloadError('Failed to download report. Please try again later.');
    } finally {
      setDownloading(false);
    }
  };

  // Filter reports based on current filters
  const filteredReports = reports.filter(report => {
    if (filters.status && report.status?.toUpperCase() !== filters.status.toUpperCase()) return false;
    if (filters.search && !report.report_title?.toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.startDate && new Date(report.creationDate) < filters.startDate) return false;
    if (filters.endDate && new Date(report.creationDate) > filters.endDate) return false;
    return true;
  });

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        All Reports
      </Typography>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Search Reports"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              select
              label="Status"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              size="small"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="APPROVED">Approved</MenuItem>
              <MenuItem value="PENDING">Pending</MenuItem>
              <MenuItem value="REJECTED">Rejected</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={3}>
            <DatePicker
              label="Start Date"
              value={filters.startDate}
              onChange={(date) => handleFilterChange('startDate', date)}
              slotProps={{ textField: { size: 'small' } }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <DatePicker
              label="End Date"
              value={filters.endDate}
              onChange={(date) => handleFilterChange('endDate', date)}
              slotProps={{ textField: { size: 'small' } }}
            />
          </Grid>
        </Grid>
      </Paper>

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
                  <TableCell>Report Title</TableCell>
                  <TableCell>Submission Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>File ID</TableCell>
                  <TableCell>Submitted By</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredReports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No reports found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReports
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((report) => (
                      <TableRow key={report.fileId}>
                        <TableCell>{report.report_title}</TableCell>
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
                        <TableCell>
                          <Chip
                            label={`File #${report.fileId}`}
                            variant="outlined"
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {report.user ? `${report.user.firstName} ${report.user.lastName}` : 'Unknown'}
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Download Report">
                            <IconButton 
                              size="small"
                              onClick={() => handleDownloadReport(report.report_title)}
                              disabled={downloading}
                            >
                              <GetAppIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredReports.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}

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
    </Box>
  );
};

export default AllReports; 