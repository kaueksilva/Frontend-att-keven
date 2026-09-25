import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import DepartmentList from './pages/DepartmentList';
import CourseList from './pages/CourseList';
import ProfessorList from './pages/ProfessorList';
import AllocationList from './pages/AllocationList';
import { Toaster } from "@/components/ui/toaster"

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-slate-50">
        <Navbar />
        <main className="flex-grow p-4 md:p-8 w-full max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/departments" element={<DepartmentList />} />
            <Route path="/courses" element={<CourseList />} />
            <Route path="/professors" element={<ProfessorList />} />
            <Route path="/allocations" element={<AllocationList />} />
          </Routes>
        </main>
        <footer className="py-6 px-4 bg-white border-t border-slate-200 mt-auto">
          <p className="text-sm text-center text-slate-500">
            © {new Date().getFullYear()} Sistema de Alocação de Professores. Todos os direitos reservados.
          </p>
        </footer>
      </div>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
