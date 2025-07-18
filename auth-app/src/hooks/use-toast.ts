import { useCallback } from "react";
import { toast as sonnerToast } from "sonner";

export function useToast() {
  // Toast padrão usando sonner/shadcn
  const success = useCallback((message: string) => {
    sonnerToast.success(message);
  }, []);

  const error = useCallback((message: string) => {
    sonnerToast.error(message);
  }, []);

  const info = useCallback((message: string) => {
    sonnerToast(message);
  }, []);

  return { success, error, info };
}
