import { useState, useEffect } from 'react';
import { Container, Typography, Button, Table, TableBody, TableCell, TableHead, TableRow, Paper, Box, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { api } from '../services/api';

const DAYS_OF_WEEK = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

export default function AllocationList() {
  const [allocations, setAllocations] = useState<any[]>([]);
  const [professors, setProfessors] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);

  const [professorId, setProfessorId] = useState('');
  const [courseId, setCourseId] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState('');
  const [startHour, setStartHour] = useState('');
  const [endHour, setEndHour] = useState('');

  const load = async () => {
    const resA = await api.get('allocations');
    setAllocations(resA.data);
    const resP = await api.get('professors');
    setProfessors(resP.data);
    const resC = await api.get('courses');
    setCourses(resC.data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!professorId || !courseId || !dayOfWeek || !startHour || !endHour) return;
    await api.post('allocations', { professorId, courseId, dayOfWeek, startHour, endHour });
    setProfessorId('');
    setCourseId('');
    setDayOfWeek('');
    setStartHour('');
    setEndHour('');
    load();
  };

  const handleDelete = async (id: string) => {
    await api.delete('allocations', id);
    load();
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Allocations</Typography>
      <Box component="form" onSubmit={handleSave} sx={{ mb: 4, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Professor</InputLabel>
          <Select value={professorId} label="Professor" onChange={e => setProfessorId(e.target.value)}>
            {professors.map(p => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Course</InputLabel>
          <Select value={courseId} label="Course" onChange={e => setCourseId(e.target.value)}>
            {courses.map(c => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Day</InputLabel>
          <Select value={dayOfWeek} label="Day" onChange={e => setDayOfWeek(e.target.value)}>
            {DAYS_OF_WEEK.map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Start Hour</InputLabel>
          <Select value={startHour} label="Start Hour" onChange={e => setStartHour(e.target.value)}>
            {Array.from({ length: 24 }).map((_, i) => {
              const val = i.toString().padStart(2, '0') + ':00';
              return <MenuItem key={val} value={val}>{val}</MenuItem>;
            })}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>End Hour</InputLabel>
          <Select value={endHour} label="End Hour" onChange={e => setEndHour(e.target.value)}>
            {Array.from({ length: 24 }).map((_, i) => {
              const val = i.toString().padStart(2, '0') + ':00';
              return <MenuItem key={val} value={val}>{val}</MenuItem>;
            })}
          </Select>
        </FormControl>
        <Button variant="contained" type="submit">Add</Button>
      </Box>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Professor</TableCell>
              <TableCell>Course</TableCell>
              <TableCell>Day</TableCell>
              <TableCell>Time</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allocations.map((a) => {
              const prof = professors.find(p => p.id === a.professorId);
              const crs = courses.find(c => c.id === a.courseId);
              return (
                <TableRow key={a.id}>
                  <TableCell>{prof ? prof.name : '-'}</TableCell>
                  <TableCell>{crs ? crs.name : '-'}</TableCell>
                  <TableCell>{a.dayOfWeek}</TableCell>
                  <TableCell>{a.startHour} - {a.endHour}</TableCell>
                  <TableCell align="right">
                    <Button color="error" onClick={() => handleDelete(a.id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              );
            })}
            {allocations.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">No allocations found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}
