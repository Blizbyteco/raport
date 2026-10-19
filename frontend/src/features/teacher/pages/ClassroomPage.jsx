import Select from "@/shared/ui/form/Select";
import LearningCard from "../ui/LearningCard";
import ClassBanner from "../ui/ClassBanner";
import Button from "@/shared/ui/button/Button";
import { ClipboardCheck, FileText } from "lucide-react";
import { useParams } from "react-router";
import useDailyLessons from "../hooks/useDailyLessons";

const ClassroomPage = () => {
  const { classSubjectId } = useParams();
  const { isLoading, data } = useDailyLessons(classSubjectId);
  const meta = data?.meta ?? [];
  const histories = data?.data ?? [];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <ClassBanner data={meta} />
      <section className="space-y-6">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-dark">
            Riwayat Pembelajaran
          </h2>

          <p className="mt-1 text-sm font-normal text-muted">
            Catatan pembelajaran dan perkembangan siswa.
          </p>
        </div>
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center">
          <Button icon={ClipboardCheck}>Absensi Siswa</Button>
          <div className="flex w-full gap-2">
            <Select>
              <option>Juli</option>
              <option>Agustus</option>
              <option>September</option>
            </Select>

            <Button variant="outline" icon={FileText}>
              Evaluasi
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {histories.map((history) => (
            <LearningCard
              key={history.id}
              {...history}
              onClick={() => console.log(history.id)}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default ClassroomPage;
