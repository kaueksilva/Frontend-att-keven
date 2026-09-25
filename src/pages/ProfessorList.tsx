import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Pencil, Trash2 } from 'lucide-react';

export default function ProfessorList() {
  const [professors, setProfessors] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const { toast } = useToast();

  const load = async () => {
    try {
      const [resP, resD] = await Promise.all([
        api.get('/professors'),
        api.get('/departments')
      ]);
      setProfessors(resP.data);
      setDepartments(resD.data);
    } catch (err) {
      toast({ title: 'Erro', description: 'Não foi possível carregar os dados.', variant: 'destructive' });
    }
  };

  useEffect(() => {
    load();
  }, []);

  const formatCpf = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCpf(formatCpf(e.target.value));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !cpf.trim() || !departmentId) return;

    if (cpf.length !== 14) {
      toast({ title: 'Aviso', description: 'CPF deve estar completo (11 dígitos).', variant: 'destructive' });
      return;
    }

    const isDuplicate = professors.some(
      (p) => p.cpf === cpf && p.id !== editingId
    );

    if (isDuplicate) {
      toast({ title: 'Aviso', description: 'Já existe um professor cadastrado com este CPF.', variant: 'destructive' });
      return;
    }

    try {
      if (editingId) {
        await api.put(`/professors/${editingId}`, { name, cpf, departmentId });
        toast({ title: 'Sucesso', description: 'Professor atualizado!' });
      } else {
        await api.post('/professors', { name, cpf, departmentId });
        toast({ title: 'Sucesso', description: 'Professor cadastrado!' });
      }
      setName('');
      setCpf('');
      setDepartmentId('');
      setEditingId(null);
      load();
    } catch (err) {
      toast({ title: 'Erro', description: 'Ocorreu um erro ao salvar.', variant: 'destructive' });
    }
  };

  const handleEdit = (prof: any) => {
    setName(prof.name);
    setCpf(prof.cpf);
    setDepartmentId(prof.departmentId || '');
    setEditingId(prof.id);
  };

  const handleCancelEdit = () => {
    setName('');
    setCpf('');
    setDepartmentId('');
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/professors/${id}`);
      toast({ title: 'Excluído', description: 'O professor foi removido.' });
      load();
    } catch (err) {
      toast({ title: 'Erro', description: 'Ocorreu um erro ao excluir.', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Professores</h1>
        <p className="text-slate-500">Mantenha o registro do corpo docente.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{editingId ? 'Editar Professor' : 'Novo Professor'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="flex flex-col sm:flex-row gap-4 items-end flex-wrap">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="name">Nome do Professor</Label>
              <Input id="name" value={name} onChange={(e: any) => setName(e.target.value)} />
            </div>
            <div className="grid w-full max-w-[200px] items-center gap-1.5">
              <Label htmlFor="cpf">CPF</Label>
              <Input id="cpf" value={cpf} onChange={handleCpfChange} maxLength={14} placeholder="000.000.000-00" required />
            </div>
            <div className="grid w-full max-w-[250px] items-center gap-1.5">
              <Label>Departamento</Label>
              <Select value={departmentId} onValueChange={setDepartmentId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((d) => (
                    <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                  ))}
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
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>CPF</TableHead>
              <TableHead>Departamento</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {professors.map((p) => {
              const dept = departments.find(d => String(d.id) === String(p.departmentId));
              return (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.id}</TableCell>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>{p.cpf}</TableCell>
                  <TableCell>{dept ? dept.name : 'Não Encontrado'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(p)} title="Editar">
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
                              Esta ação não pode ser desfeita. O professor será removido permanentemente.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(p.id)} className="bg-red-600 hover:bg-red-700">
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
            {professors.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Nenhum professor cadastrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
