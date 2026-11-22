import { ArrowRight, GraduationCap, Users } from "lucide-react";
import { useNavigate } from "react-router";

import Button from "@/shared/ui/button/Button";

function HomeroomCard({ classroomId, nameClass, studentCount, academicYear }) {
  const navigate = useNavigate();
  const yearLabel = academicYear
    ? `${academicYear.start_year}/${academicYear.end_year}`
    : "-";

  return (
    <div className="group w-full rounded-xl border border-border bg-card p-5 text-left transition">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <GraduationCap className="size-5" />
          </div>

          <div className="min-w-0">
            <h3 className="font-semibold text-foreground">{nameClass}</h3>

            <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
              <span className="flex items-center gap-1.5">
                <Users className="size-3.5" />
                {studentCount ?? 0} siswa
              </span>
              <span>{yearLabel}</span>
            </div>
          </div>
        </div>

        <Button
          onClick={() =>
            navigate(`/teacher/class/monitoring/${classroomId}`)
          }
          variant="outline"
          size="S"
          icon={ArrowRight}
          disabled={!classroomId}
        >
          Monitoring
        </Button>
      </div>
    </div>
  );
}

export default HomeroomCard;
