import { Link } from 'react-router-dom';
import { Building2, GraduationCap, Users, CalendarCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function Landing() {
  return (
    <div className="space-y-12 pb-8">
      <section className="bg-blue-600 text-white rounded-2xl p-8 md:p-16 text-center shadow-lg">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
          Sistema de Alocação de Professores
        </h1>
        <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto mb-8 leading-relaxed">
          Uma solução moderna para a gestão de recursos universitários.
          Organize departamentos, cursos, professores e monte as grades de horários com eficiência e praticidade.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button size="lg" variant="secondary" className="font-semibold" asChild>
            <Link to="/allocations">Acessar Alocações</Link>
          </Button>
          <Button size="lg" variant="outline" className="bg-transparent border-blue-200 text-white hover:bg-white/10 hover:text-white" asChild>
            <Link to="/professors">Ver Professores</Link>
          </Button>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-center text-slate-800">Módulos do Sistema</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Building2 size={32} className="text-blue-600" />
              </div>
              <CardTitle>Departamentos</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-slate-500 text-sm">
              <p>Organize as estruturas acadêmicas e centros da universidade.</p>
            </CardContent>
            <CardFooter className="justify-center">
              <Button variant="outline" asChild><Link to="/departments">Gerenciar</Link></Button>
            </CardFooter>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <GraduationCap size={32} className="text-blue-600" />
              </div>
              <CardTitle>Cursos</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-slate-500 text-sm">
              <p>Cadastre e administre as disciplinas ofertadas pelas graduações.</p>
            </CardContent>
            <CardFooter className="justify-center">
              <Button variant="outline" asChild><Link to="/courses">Gerenciar</Link></Button>
            </CardFooter>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Users size={32} className="text-blue-600" />
              </div>
              <CardTitle>Professores</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-slate-500 text-sm">
              <p>Mantenha o registro do corpo docente atualizado e vinculado.</p>
            </CardContent>
            <CardFooter className="justify-center">
              <Button variant="outline" asChild><Link to="/professors">Gerenciar</Link></Button>
            </CardFooter>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <CalendarCheck size={32} className="text-blue-600" />
              </div>
              <CardTitle>Alocações</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-slate-500 text-sm">
              <p>Defina os horários e dias da semana para cada aula e professor.</p>
            </CardContent>
            <CardFooter className="justify-center">
              <Button variant="outline" asChild><Link to="/allocations">Gerenciar</Link></Button>
            </CardFooter>
          </Card>
        </div>
      </section>
    </div>
  );
}
