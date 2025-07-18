import { Button } from '@/components/ui/button';

interface DeleteUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
  onConfirm: () => void;
}

export function DeleteUserModal({ open, onOpenChange, email, onConfirm }: DeleteUserModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-card rounded-lg p-6 shadow-lg w-full max-w-sm flex flex-col gap-4">
        <h2 className="text-lg font-bold text-destructive">Confirmar exclusão</h2>
        <p className="text-sm">Tem certeza que deseja excluir o usuário <span className="font-semibold">{email}</span>? Esta ação não pode ser desfeita.</p>
        <div className="flex gap-2 mt-4">
          <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button variant="destructive" className="flex-1" onClick={onConfirm}>Excluir</Button>
        </div>
      </div>
    </div>
  );
}
