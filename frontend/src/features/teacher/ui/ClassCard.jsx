import { BookOpen, Users } from "lucide-react";
import { useNavigate } from "react-router";

function ClassCard({ id, subject, classroom }) {
  const navigate = useNavigate();

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/teacher/class/${id}`)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          navigate(`/teacher/class/${id}`);
        }
      }}
      className="group w-full cursor-pointer overflow-hidden rounded-xl border border-border bg-card text-left transition hover:ring-1 ring-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
    >
      <div className="flex items-start justify-between gap-4 border-b border-border p-6">
        <div>
          <p className="text-xs text-muted">Kelas</p>
          <h3 className="mt-1 text-lg font-bold text-foreground">
            {classroom?.name ?? "-"}
          </h3>
        </div>
      </div>

      <div className="space-y-3 p-6">
        <div className="flex items-center gap-3 text-xs text-foreground">
          <BookOpen className="size-4 text-muted" />
          <span>{subject?.name ?? "-"}</span>
        </div>

        <div className="flex items-center gap-3 text-xs text-foreground">
          <Users className="size-4 text-muted" />
          <span>{classroom?.student_count ?? 0} siswa</span>
        </div>
      </div>
    </div>
  );
}

export default ClassCard;
