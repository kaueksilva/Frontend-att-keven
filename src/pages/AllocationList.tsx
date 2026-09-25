import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Pencil, Trash2 } from 'lucide-react';

const DAYS_OF_WEEK = [
  { value: 'MONDAY', label: 'Segunda-feira' },
  { value: 'TUESDAY', label: 'Terça-feira' },
  { value: 'WEDNESDAY', label: 'Quarta-feira' },
  { value: 'THURSDAY', label: 'Quinta-feira' },
  { value: 'FRIDAY', label: 'Sexta-feira' },
  { value: 'SATURDAY', label: 'Sábado' },
  { value: 'SUNDAY', label: 'Domingo' }
];

export default function AllocationList() {
  const [allocations, setAllocations] = useState<any[]>([]);
  const [professors, setProfessors] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);

  const [professorId, setProfessorId] = useState('');
  const [courseId, setCourseId] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState('');
  const [startHour, setStartHour] = useState('');
  const [endHour, setEndHour] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const { toast } = useToast();

  const load = async () => {
    try {
      const [resA, resP, resC] = await Promise.all([
        api.get('/allocations'),
        api.get('/professors'),
        api.get('/courses')
      ]);
      setAllocations(resA.data);
      setProfessors(resP.data);
      setCourses(resC.data);
    } catch (err) {
      toast({ title: 'Erro', description: 'Não foi possível carregar os dados.', variant: 'destructive' });
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!professorId || !courseId || !dayOfWeek || !startHour || !endHour) return;

    // Horários em formato Date para comparar (exemplo: '19:00+00:00' -> '19:00')
    const parseTime = (timeStr: string) => {
      const [hour, min] = timeStr.split('+')[0].split(':').map(Number);
      return hour * 60 + min;
    };

    const newStart = parseTime(startHour);
    const newEnd = parseTime(endHour);

    if (newStart >= newEnd) {
      toast({ title: 'Aviso', description: 'O horário de término deve ser após o início.', variant: 'destructive' });
      return;
    }

    const hasConflict = allocations.some((a) => {
      if (a.id === editingId) return false;
      if (a.professorId === professorId && a.dayOfWeek === dayOfWeek) {
        const existStart = parseTime(a.startHour);
        const existEnd = parseTime(a.endHour);
        return newStart < existEnd && newEnd > existStart;
      }
      return false;
    });

    if (hasConflict) {
      toast({ title: 'Aviso', description: 'O professor já possui uma alocação neste dia e horário.', variant: 'destructive' });
      return;
    }

    try {
      if (editingId) {
        await api.put(`/allocations/${editingId}`, { professorId, courseId, dayOfWeek, startHour, endHour });
        toast({ title: 'Sucesso', description: 'Alocação atualizada!' });
      } else {
        await api.post('/allocations', { professorId, courseId, dayOfWeek, startHour, endHour });
        toast({ title: 'Sucesso', description: 'Alocação cadastrada!' });
      }
      handleCancelEdit();
      load();
    } catch (err) {
      toast({ title: 'Erro', description: 'Ocorreu um erro ao salvar.', variant: 'destructive' });
    }
  };

  const handleEdit = (alloc: any) => {
    setProfessorId(alloc.professorId || '');
    setCourseId(alloc.courseId || '');
    setDayOfWeek(alloc.dayOfWeek || '');
    setStartHour(alloc.startHour || '');
    setEndHour(alloc.endHour || '');
    setEditingId(alloc.id);
  };

  const handleCancelEdit = () => {
    setProfessorId('');
    setCourseId('');
    setDayOfWeek('');
    setStartHour('');
    setEndHour('');
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/allocations/${id}`);
      toast({ title: 'Excluído', description: 'A alocação foi removida.' });
      load();
    } catch (err) {
      toast({ title: 'Erro', description: 'Ocorreu um erro ao excluir.', variant: 'destructive' });
    }
  };

  const hours = Array.from({ length: 24 }).map((_, i) => i.toString().padStart(2, '0') + ':00');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Alocações</h1>
        <p className="text-slate-500">Defina os horários e dias da semana das aulas.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{editingId ? 'Editar Alocação' : 'Nova Alocação'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="flex flex-col sm:flex-row gap-4 items-end flex-wrap">
            <div className="grid w-full max-w-[200px] items-center gap-1.5">
              <Label>Professor</Label>
              <Select value={professorId} onValueChange={setProfessorId}>
                <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                <SelectContent>
                  {professors.map((p) => <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid w-full max-w-[200px] items-center gap-1.5">
              <Label>Curso</Label>
              <Select value={courseId} onValueChange={setCourseId}>
                <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                <SelectContent>
                  {courses.map((c) => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid w-full max-w-[150px] items-center gap-1.5">
              <Label>Dia da Semana</Label>
              <Select value={dayOfWeek} onValueChange={setDayOfWeek}>
                <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                <SelectContent>
                  {DAYS_OF_WEEK.map((d) => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid w-full max-w-[120px] items-center gap-1.5">
              <Label>Início</Label>
              <Select value={startHour} onValueChange={setStartHour}>
                <SelectTrigger><SelectValue placeholder="Hora" /></SelectTrigger>
                <SelectContent>
                  {hours.map((h) => <SelectItem key={h} value={h}>{h}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid w-full max-w-[120px] items-center gap-1.5">
              <Label>Fim</Label>
              <Select value={endHour} onValueChange={setEndHour}>
                <SelectTrigger><SelectValue placeholder="Hora" /></SelectTrigger>
                <SelectContent>
                  {hours.map((h) => <SelectItem key={h} value={h}>{h}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button type="submit">{editingId ? 'Atualizar' : 'Adicionar'}</Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={handleCancelEdit}>Cancelar</Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Professor</TableHead>
              <TableHead>Curso</TableHead>
              <TableHead>Dia</TableHead>
              <TableHead>Horário</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allocations.map((a) => {
              const prof = professors.find(p => String(p.id) === String(a.professorId));
              const crs = courses.find(c => String(c.id) === String(a.courseId));
              const dayLabel = DAYS_OF_WEEK.find(d => d.value === a.dayOfWeek)?.label || a.dayOfWeek;
              return (
                <TableRow key={a.id}>
                  <TableCell>{prof ? prof.name : '-'}</TableCell>
                  <TableCell>{crs ? crs.name : '-'}</TableCell>
                  <TableCell>{dayLabel}</TableCell>
                  <TableCell>{a.startHour} - {a.endHour}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(a)} title="Editar">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" title="Excluir" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Tem certeza que deseja excluir?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta ação não pode ser desfeita. A alocação será removida permanentemente.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(a.id)} className="bg-red-600 hover:bg-red-700">
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            {allocations.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Nenhuma alocação cadastrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
