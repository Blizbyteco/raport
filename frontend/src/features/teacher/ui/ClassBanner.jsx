import Button from "@/shared/ui/button/Button";
import { BookOpen, Plus, Users } from "lucide-react";
import { useNavigate } from "react-router";

const ClassBanner = ({ data }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-card p-6 border border-border rounded-xl">
      <div class="flex items-center gap-2 mb-2">
        <span class="text-sm text-muted"> Kelas </span>
        <span class="text-sm text-muted"> / </span>
        <span class="text-sm text-muted"> {data.subject?.name} </span>
      </div>
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">{data.classroom?.name}</h2>
          <div className="flex items-center gap-4 text-muted mt-2">
            <span className="flex items-center gap-1.5 text-sm font-medium">
              <Users size={15} />
              {data.classroom?.student_count} Siswa
            </span>
            <span className="flex items-center gap-1.5 text-sm font-medium">
              <BookOpen size={15} />
              {data.subject?.name}
            </span>
          </div>
        </div>
        <Button onClick={() => navigate("progress/create")} icon={Plus}>
          Catat Pembelajaran
        </Button>
      </div>
    </div>
  );
};

export default ClassBanner;
