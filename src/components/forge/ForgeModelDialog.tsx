import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import ModelViewer from "./ModelViewer";
import type { ForgeText } from "./forgeI18n";

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  src: string;
  t: ForgeText;
}

/** "View in 3D" dialog for a catalog piece. */
const ForgeModelDialog = ({ open, onClose, title, src, t }: Props) => (
  <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{t.rotateHint}</DialogDescription>
      </DialogHeader>
      <div className="h-[55vh] min-h-[320px] rounded-2xl bg-muted/60 overflow-hidden">
        {open && <ModelViewer src={src} alt={title} />}
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">{t.conceptNote}</p>
    </DialogContent>
  </Dialog>
);

export default ForgeModelDialog;
