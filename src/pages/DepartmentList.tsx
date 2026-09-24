import { useState, useEffect } from 'react';
import { Container, Typography, Button, Table, TableBody, TableCell, TableHead, TableRow, Paper, TextField, Box } from '@mui/material';
import { api } from '../services/api';

export default function DepartmentList() {
  const [departments, setDepartments] = useState<any[]>([]);
  const [name, setName] = useState('');

  const load = async () => {
    const res = await api.get('departments');
    setDepartments(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    await api.post('departments', { name });
    setName('');
    load();
  };

  const handleDelete = async (id: string) => {
    await api.delete('departments', id);
    load();
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Departments</Typography>
      <Box component="form" onSubmit={handleSave} sx={{ mb: 4, display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField label="Department Name" value={name} onChange={e => setName(e.target.value)} size="small" />
        <Button variant="contained" type="submit">Add</Button>
      </Box>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {departments.map((d) => (
              <TableRow key={d.id}>
                <TableCell>{d.id}</TableCell>
                <TableCell>{d.name}</TableCell>
                <TableCell align="right">
                  <Button color="error" onClick={() => handleDelete(d.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
            {departments.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} align="center">No departments found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}
