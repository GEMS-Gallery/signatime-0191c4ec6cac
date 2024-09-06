import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, CircularProgress } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { backend } from 'declarations/backend';

type SignatureRequest = {
  id: bigint;
  name: string;
  notes: string | null;
  link: string | null;
  createdAt: bigint;
  signed: boolean;
};

function App() {
  const [requests, setRequests] = useState<SignatureRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { control, handleSubmit, reset } = useForm();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const result = await backend.getSignatureRequests();
      setRequests(result);
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
    setLoading(false);
  };

  const onSubmit = async (data: { name: string; notes: string; link: string }) => {
    setLoading(true);
    try {
      await backend.addSignatureRequest(data.name, data.notes || null, data.link || null);
      reset();
      await fetchRequests();
    } catch (error) {
      console.error('Error adding request:', error);
    }
    setLoading(false);
  };

  const handleSignedChange = async (id: bigint) => {
    setLoading(true);
    try {
      await backend.markAsSigned(id);
      await fetchRequests();
    } catch (error) {
      console.error('Error marking as signed:', error);
    }
    setLoading(false);
  };

  const calculateDaysPending = (createdAt: bigint) => {
    const now = BigInt(Date.now()) * BigInt(1000000);
    const diff = now - createdAt;
    return Number(diff / BigInt(86400000000000));
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h2" component="h1" gutterBottom>
        Signature Tracker
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="name"
          control={control}
          defaultValue=""
          rules={{ required: 'Name is required' }}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Name"
              variant="outlined"
              fullWidth
              margin="normal"
              error={!!error}
              helperText={error?.message}
            />
          )}
        />
        <Controller
          name="notes"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              label="Notes"
              variant="outlined"
              fullWidth
              margin="normal"
            />
          )}
        />
        <Controller
          name="link"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              label="Link"
              variant="outlined"
              fullWidth
              margin="normal"
            />
          )}
        />
        <Button type="submit" variant="contained" color="primary">
          Add Signature Request
        </Button>
      </form>
      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper} style={{ marginTop: '2rem' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Notes</TableCell>
                <TableCell>Link</TableCell>
                <TableCell>Days Pending</TableCell>
                <TableCell>Signed</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests.map((request) => {
                const daysPending = calculateDaysPending(request.createdAt);
                const isOverdue = daysPending > 7;
                return (
                  <TableRow
                    key={request.id.toString()}
                    style={{
                      backgroundColor: request.signed
                        ? '#e8f5e9'
                        : isOverdue
                        ? '#ffcdd2'
                        : 'inherit',
                    }}
                  >
                    <TableCell>{request.name}</TableCell>
                    <TableCell>{request.notes || ''}</TableCell>
                    <TableCell>
                      {request.link ? (
                        <a href={request.link} target="_blank" rel="noopener noreferrer">
                          {request.link}
                        </a>
                      ) : (
                        ''
                      )}
                    </TableCell>
                    <TableCell>{request.signed ? 'Signed' : daysPending}</TableCell>
                    <TableCell>
                      <Checkbox
                        checked={request.signed}
                        onChange={() => handleSignedChange(request.id)}
                        color="primary"
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}

export default App;
