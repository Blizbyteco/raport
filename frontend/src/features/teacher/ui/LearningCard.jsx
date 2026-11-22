import { formatDate } from "@/shared/lib/formatDate";
import { BookOpen, ChevronRight, Trash2 } from "lucide-react";
import { useNavigate } from "react-router";

import Button from "@/shared/ui/button/Button";
import Tooltip from "@/shared/ui/feedback/Tooltip";

const LearningCard = ({
  id,
  material,
  date,
  average,
  assessed,
  totalStudents,
  onClick,
  onDelete,
  isDeleting = false,
}) => {
  const navigate = useNavigate();

  const handleOpen = () => {
    if (onClick) onClick();
    else navigate(`progress/${id}`);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleOpen}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") handleOpen();
      }}
      className="w-full text-left rounded-xl border border-border bg-card p-5 transition hover:ring-1 ring-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <BookOpen className="h-5 w-5" />
          </div>

          <div>
            <h4 className="text-md font-semibold text-dark">{material}</h4>
            <p className="text-xs text-muted font-normal">{formatDate(date)}</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div>
            <p className="text-xs text-muted">Rata-rata</p>
            <p className="mt-1 font-bold text-success">{average}</p>
          </div>

          <div>
            <p className="text-xs text-muted">Dinilai</p>
            <p className="mt-1 font-bold text-dark">
              {assessed} / {totalStudents}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {onDelete && (
              <Tooltip label="Hapus data pembelajaran">
                <Button
                  variant="ghost"
                  size="S"
                  icon={Trash2}
                  iconOnly
                  isLoading={isDeleting}
                  disabled={isDeleting}
                  aria-label={`Hapus data pembelajaran ${material ?? ""}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    onDelete();
                  }}
                  onKeyDown={(event) => event.stopPropagation()}
                />
              </Tooltip>
            )}

            <ChevronRight className="h-5 w-5 text-muted" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningCard;
