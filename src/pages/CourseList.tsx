import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Pencil, Trash2 } from 'lucide-react';

export default function CourseList() {
  const [courses, setCourses] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const { toast } = useToast();

  const load = async () => {
    try {
      const res = await api.get('/courses');
      setCourses(res.data);
    } catch (err) {
      toast({ title: 'Erro', description: 'Não foi possível carregar os cursos.', variant: 'destructive' });
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const isDuplicate = courses.some(
      (c) => c.name.toLowerCase() === name.trim().toLowerCase() && c.id !== editingId
    );

    if (isDuplicate) {
      toast({ title: 'Aviso', description: 'Já existe um curso com este nome.', variant: 'destructive' });
      return;
    }

    try {
      if (editingId) {
        await api.put(`/courses/${editingId}`, { name });
        toast({ title: 'Sucesso', description: 'Curso atualizado!' });
      } else {
        await api.post('/courses', { name });
        toast({ title: 'Sucesso', description: 'Curso cadastrado!' });
      }
      setName('');
      setEditingId(null);
      load();
    } catch (err) {
      toast({ title: 'Erro', description: 'Ocorreu um erro ao salvar.', variant: 'destructive' });
    }
  };

  const handleEdit = (course: any) => {
    setName(course.name);
    setEditingId(course.id);
  };

  const handleCancelEdit = () => {
    setName('');
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/courses/${id}`);
      toast({ title: 'Excluído', description: 'O curso foi removido.' });
      load();
    } catch (err) {
      toast({ title: 'Erro', description: 'Ocorreu um erro ao excluir.', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Cursos</h1>
        <p className="text-slate-500">Gerencie os cursos oferecidos pela universidade.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{editingId ? 'Editar Curso' : 'Novo Curso'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="name">Nome do Curso</Label>
              <Input 
                id="name" 
                placeholder="Ex: Engenharia de Software" 
                value={name} 
                onChange={(e: any) => setName(e.target.value)} 
              />
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
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.id}</TableCell>
                <TableCell>{c.name}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(c)} title="Editar">
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
                            Esta ação não pode ser desfeita. O curso será removido permanentemente.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(c.id)} className="bg-red-600 hover:bg-red-700">
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {courses.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  Nenhum curso cadastrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
