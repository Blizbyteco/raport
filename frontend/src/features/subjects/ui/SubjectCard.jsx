import Button from "@/shared/ui/button/Button";
import { BookOpen, Pencil, Trash2 } from "lucide-react";

const SubjectCard = ({ subject, onEdit, onDelete }) => {
  return (
    <div className="group flex min-h-16 items-center justify-between gap-4 rounded-xl border border-border bg-card px-4 py-3 transition-all duration-200 hover:ring-1 ring-primary">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <BookOpen className="size-4" />
        </div>

        <h2 className="min-w-0 truncate text-sm font-medium text-dark">
          {subject.name}
        </h2>
      </div>

      <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
        <Button
          onClick={onEdit}
          variant="ghost"
          size="S"
          icon={Pencil}
          iconOnly
        />
        <Button
          onClick={onDelete}
          variant="ghost"
          size="S"
          icon={Trash2}
          iconOnly
        />
      </div>
    </div>
  );
};

export default SubjectCard;
