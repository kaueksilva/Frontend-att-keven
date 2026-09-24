import { Container, Typography, Box, Paper, Button } from '@mui/material';
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 6, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom>
          Professor Allocation System
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          A comprehensive solution for managing university resources,
          allowing efficient allocation of professors to courses across different departments.
        </Typography>
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button variant="contained" size="large" component={Link} to="/departments">
            Manage Departments
          </Button>
          <Button variant="outlined" size="large" component={Link} to="/professors">
            Manage Professors
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
