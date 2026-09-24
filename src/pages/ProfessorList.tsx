import { useState, useEffect } from 'react';
import { Container, Typography, Button, Table, TableBody, TableCell, TableHead, TableRow, Paper, TextField, Box, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { api } from '../services/api';

export default function ProfessorList() {
  const [professors, setProfessors] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [departmentId, setDepartmentId] = useState('');

  const load = async () => {
    const resP = await api.get('professors');
    setProfessors(resP.data);
    const resD = await api.get('departments');
    setDepartments(resD.data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !cpf || !departmentId) return;
    await api.post('professors', { name, cpf, departmentId });
    setName('');
    setCpf('');
    setDepartmentId('');
    load();
  };

  const handleDelete = async (id: string) => {
    await api.delete('professors', id);
    load();
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Professors</Typography>
      <Box component="form" onSubmit={handleSave} sx={{ mb: 4, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        <TextField label="Professor Name" value={name} onChange={e => setName(e.target.value)} size="small" />
        <TextField label="CPF" value={cpf} onChange={e => setCpf(e.target.value)} size="small" />
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Department</InputLabel>
          <Select value={departmentId} label="Department" onChange={e => setDepartmentId(e.target.value)}>
            {departments.map(d => (
              <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" type="submit">Add</Button>
      </Box>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>CPF</TableCell>
              <TableCell>Department</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {professors.map((p) => {
              const dept = departments.find(d => d.id === p.departmentId);
              return (
                <TableRow key={p.id}>
                  <TableCell>{p.id}</TableCell>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>{p.cpf}</TableCell>
                  <TableCell>{dept ? dept.name : 'Unknown'}</TableCell>
                  <TableCell align="right">
                    <Button color="error" onClick={() => handleDelete(p.id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              );
            })}
            {professors.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">No professors found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}
