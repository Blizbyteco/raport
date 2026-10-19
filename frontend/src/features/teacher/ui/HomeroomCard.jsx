import Button from "@/shared/ui/button/Button";
import { ArrowRight, GraduationCap, Users } from "lucide-react";
import { useNavigate } from "react-router";

function HomeroomCard({ nameClass, studentCount, academicYear }) {
  const navigate = useNavigate();
  return (
    <div className="group w-full rounded-xl border border-border bg-card p-5 text-left transition">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <GraduationCap className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <h3 className="font-semibold text-card-foreground">{nameClass}</h3>

            <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
              <span className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" />
                {studentCount} siswaku
              </span>

              <span>{academicYear}</span>
            </div>
          </div>
        </div>

        <Button
          onClick={() => navigate("monitoring")}
          variant="outline"
          size="S"
        >
          Monitoring
        </Button>
      </div>
    </div>
  );
}

export default HomeroomCard;
