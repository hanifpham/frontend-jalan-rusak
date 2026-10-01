import React, { useEffect } from "react";
import { X, Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { useDeleteAvatar } from "@/hooks/useProfile";

export interface DeleteAvatarDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessNotification: (msg: string) => void;
}

export function DeleteAvatarDialog({
  isOpen,
  onClose,
  onSuccessNotification,
}: DeleteAvatarDialogProps): React.JSX.Element | null {
  const deleteAvatarMutation = useDeleteAvatar();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleDelete = async () => {
    try {
      await deleteAvatarMutation.mutateAsync();
      onSuccessNotification("Foto profil berhasil dihapus.");
      onClose();
    } catch {
      // Error handled by mutation
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-deepest/40 dark:bg-black/70 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-avatar-title"
    >
      <div className="bg-white dark:bg-[#0D1A2D] rounded-3xl border border-blue-pale/50 dark:border-white/10 shadow-2xl max-w-sm w-full p-6 relative overflow-hidden animate-in zoom-in-95 duration-150">
        <button
          type="button"
          onClick={onClose}
          disabled={deleteAvatarMutation.isPending}
          className="absolute right-4 top-4 p-1.5 rounded-full hover:bg-canvas dark:hover:bg-white/10 text-muted dark:text-[#8FA4BA] hover:text-navy-deepest transition-colors cursor-pointer disabled:opacity-50"
          aria-label="Tutup Dialog"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        <div className="flex items-start gap-3.5 mb-4">
          <div className="w-11 h-11 rounded-full bg-red-100/70 dark:bg-red-950/40 text-severity-berat flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h3
              id="delete-avatar-title"
              className="text-base font-bold text-navy-deepest"
            >
              Hapus foto profil?
            </h3>
            <p className="text-xs text-muted dark:text-[#8FA4BA] mt-1 leading-relaxed">
              Foto profil akan dihapus dan akun akan kembali menggunakan avatar
              inisial nama Anda.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-blue-pale/30 dark:border-white/10">
          <button
            type="button"
            onClick={onClose}
            disabled={deleteAvatarMutation.isPending}
            className="px-4 py-2 rounded-full text-xs font-semibold border border-blue-pale/50 dark:border-white/10 text-muted dark:text-[#AFC0D4] hover:text-navy-deepest dark:hover:text-white hover:bg-canvas dark:hover:bg-white/5 transition-colors cursor-pointer disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleteAvatarMutation.isPending}
            className="px-5 py-2 rounded-full text-xs font-semibold bg-severity-berat hover:bg-red-700 text-white shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
          >
            {deleteAvatarMutation.isPending ? (
              <Loader2
                className="w-3.5 h-3.5 animate-spin"
                aria-hidden="true"
              />
            ) : (
              <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
            )}
            <span>Hapus Foto</span>
          </button>
        </div>
      </div>
    </div>
  );
}
