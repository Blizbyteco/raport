import { ArrowRight, BookOpen, Clock3, Users } from "lucide-react";
import { useNavigate } from "react-router";

const statusConfig = {
  ongoing: {
    label: "Sedang berlangsung",
    dot: "bg-green-500",
    text: "text-green-600 dark:text-green-500",
  },
  upcoming: {
    label: "Belum dimulai",
    dot: "bg-zinc-400",
    text: "text-muted",
  },
  finished: {
    label: "Selesai",
    dot: "bg-zinc-400",
    text: "text-muted",
  },
};

function ClassCard({ id, subject, classroom, status = "upcoming" }) {
  const navigate = useNavigate();
  const currentStatus = statusConfig[status] ?? statusConfig.upcoming;

  return (
    <div
      onClick={() => navigate(`class/${id}`)}
      className="group w-full overflow-hidden rounded-xl border border-border bg-card text-left transition hover:ring-1 ring-primary"
    >
      <div className="flex items-start justify-between gap-4 p-6 border-b border-border">
        <div>
          <p className="text-xs text-muted">Kelas</p>
          <h3 className="mt-1 text-lg font-bold text-card-foreground">
            {classroom.name}
          </h3>
        </div>
      </div>

      <div className="space-y-3 p-6">
        <div className="flex items-center gap-3 text-xs text-card-foreground">
          <BookOpen className="h-4 w-4 text-muted" />
          <span>{subject.name}</span>
        </div>

        <div className="flex items-center gap-3 text-xs text-card-foreground">
          <Users className="h-4 w-4 text-muted" />
          <span>{classroom.student_count} siswa</span>
        </div>
      </div>

      {/* <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${currentStatus.dot}`} />
            <span className={`text-xs font-medium ${currentStatus.text}`}>
              {currentStatus.label}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <ArrowRight className="h-5 w-5 text-muted transition group-hover:translate-x-1 group-hover:text-primary" />
          </div>
        </div> */}
    </div>
  );
}

export default ClassCard;
