import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TablePagination, CircularProgress,
  Box, Alert, Chip, Button
} from '@mui/material';
import Headingv2 from '../../components/Headingv2/Headingv2';
import { useAuth } from '../../AuthContext';
import './MyRegistrations.css';

const MyRegistrations = () => {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
    if (user) {
        fetchRegistrations();
    }
    }, [user]);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/v3/evregister/', {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) throw new Error('No registrations found');
      const data = await response.json();
      setRegistrations(data.regs || []);
      console.log('Registrations:', data.regs);  // DEBUG
    } catch (err) {
      setError('No registrations yet');
      setRegistrations([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-IN');

  if (loading) return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Headingv2 title="MY REGISTRATIONS" />
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 12 }}>
        <CircularProgress size={60} />
      </Box>
    </Container>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Headingv2 title="MY REGISTRATIONS" />
      
      {error && (
        <Alert severity="info" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {registrations.length === 0 ? (
        <Paper sx={{ p: 8, textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" color="text.secondary">No Registrations</Typography>
          <Typography variant="body2" color="text.secondary">Register for events!</Typography>
        </Paper>
      ) : (
        <Paper sx={{ mt: 4 }}>
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow sx={{ bgcolor: 'primary.main' }}>
                  <TableCell sx={{ color: 'white', fontWeight: 700 }}>Event</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 700 }}>Date</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 700 }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {registrations.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((reg) => (
                  <TableRow key={reg._id} hover>
                    <TableCell sx={{ fontWeight: 500 }}>{reg.event || 'Event'}</TableCell>
                    <TableCell>{formatDate(reg.createdAt)}</TableCell>
                    <TableCell>
                      <Chip label={reg.status || 'Confirmed'} color="primary" size="small" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10]}
            count={registrations.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
          />
        </Paper>
      )}
    </Container>
  );
};

export default MyRegistrations;
