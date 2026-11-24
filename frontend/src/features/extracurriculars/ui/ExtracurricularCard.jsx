import Button from "@/shared/ui/button/Button";
import Tooltip from "@/shared/ui/feedback/Tooltip";
import {
  GraduationCap,
  Pencil,
  SportShoe,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";

const ExtracurricularCard = ({ excul, onEdit, onDelete, onManage }) => {
  return (
    <div className="group flex items-start justify-between gap-4 rounded-xl border border-border bg-card px-4 py-3 transition-all duration-200 hover:ring-1 ring-primary">
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <SportShoe className="size-4" />
        </div>

        <div className="min-w-0">
          <h2 className="truncate text-sm font-semibold text-foreground">
            {excul.name}
          </h2>
          {excul.description && (
            <p className="mt-1 line-clamp-2 text-xs text-muted">
              {excul.description}
            </p>
          )}
          {excul.is_active === false && (
            <p className="mt-1 text-xs font-medium text-danger">Tidak aktif</p>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
            <span className="inline-flex items-center gap-1.5">
              <GraduationCap className="size-3.5" aria-hidden="true" />
              {excul.teachers_count ?? 0} pembina
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Users className="size-3.5" aria-hidden="true" />
              {excul.students_count ?? 0} anggota
            </span>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <div className="flex items-center gap-1 transition-opacity max-md:opacity-100 md:opacity-0 md:group-hover:opacity-100 md:focus-within:opacity-100">
          <Tooltip label="Atur anggota ekstrakurikuler">
            <Button
              variant="ghost"
              size="S"
              icon={UserPlus}
              iconOnly
              onClick={onManage}
              aria-label={`Atur anggota ${excul.name}`}
            />
          </Tooltip>

          <Tooltip label="Ubah data ekstrakurikuler">
            <Button
              variant="ghost"
              size="S"
              icon={Pencil}
              iconOnly
              onClick={onEdit}
              aria-label={`Ubah data ${excul.name}`}
            />
          </Tooltip>

          <Tooltip label="Hapus data ekstrakurikuler">
            <Button
              variant="ghost"
              size="S"
              icon={Trash2}
              iconOnly
              onClick={onDelete}
              aria-label={`Hapus data ${excul.name}`}
            />
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default ExtracurricularCard;
