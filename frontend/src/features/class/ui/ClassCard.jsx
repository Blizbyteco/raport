import Button from "@/shared/ui/button/Button";
import { Pencil, Trash2, Users } from "lucide-react";

const ClassCard = ({ item }) => {
  return (
    <div className="group rounded-xl border border-border bg-card p-4 transition-all duration-200 hover:ring-1 ring-primary">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Users className="size-5" />
          </div>

          <h2 className="truncate text-md font-semibold text-dark">
            {item.name}
          </h2>
        </div>

        <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
          <Button variant="ghost" size="S" icon={Pencil} iconOnly />
          <Button variant="ghost" size="S" icon={Trash2} iconOnly />
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
        <span className="text-xs sm:text-sm text-muted">Jumlah siswa</span>
        <span className="text-sm font-semibold text-dark">
          {item.students} siswa
        </span>
      </div>
    </div>
  );
};

export default ClassCard;
