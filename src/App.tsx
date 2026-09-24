import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import DepartmentList from './pages/DepartmentList';
import CourseList from './pages/CourseList';
import ProfessorList from './pages/ProfessorList';
import AllocationList from './pages/AllocationList';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/departments" element={<DepartmentList />} />
          <Route path="/courses" element={<CourseList />} />
          <Route path="/professors" element={<ProfessorList />} />
          <Route path="/allocations" element={<AllocationList />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
