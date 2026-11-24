import { useNavigate, useParams } from "react-router";
import { Eye, FileText } from "lucide-react";

import Button from "@/shared/ui/button/Button";
import Tooltip from "@/shared/ui/feedback/Tooltip";
import PageHeader from "@/shared/layout/PageHeader";

// Static data: to be filled from the real schedule data later
const CLASS_SCHEDULE = [
  {
    id: 1,
    classSubjectId: "1",
    name: "Kelas IPA 1",
    day: "Senin",
    start: "08.00 AM",
    end: "09.40 AM",
    subject: "Matematika",
    class: "XII-B",
    status: "upcoming",
  },
  {
    id: 2,
    classSubjectId: "2",
    name: "Kelas IPA 1",
    day: "Senin",
    start: "10.00 AM",
    end: "11.40 AM",
    subject: "Matematika",
    class: "XII-B",
    status: "ongoing",
  },
  {
    id: 3,
    classSubjectId: "3",
    name: "Kelas Bahasa 1",
    day: "Selasa",
    start: "01.00 PM",
    end: "02.40 PM",
    subject: "Bahasa Indonesia",
    class: "XII-B",
    status: "finished",
  },
  {
    id: 4,
    classSubjectId: "4",
    name: "Kelas Fisika",
    day: "Rabu",
    start: "08.00 AM",
    end: "09.40 AM",
    subject: "Fisika",
    class: "XII-A",
    status: "upcoming",
  },
  {
    id: 5,
    classSubjectId: "5",
    name: "Kelas Matematika",
    day: "Kamis",
    start: "01.00 PM",
    end: "02.40 PM",
    subject: "Matematika",
    class: "XII-A",
    status: "ongoing",
  },
  {
    id: 6,
    classSubjectId: "6",
    name: "Kelas Bahasa 2",
    day: "Jumat",
    start: "08.00 AM",
    end: "09.40 AM",
    subject: "Bahasa Indonesia",
    class: "XII-C",
    status: "closed",
  },
];

const ClassSchedule = ({ onPrintReport, isPrintLoading = false }) => {
  const navigate = useNavigate();
  const { classSubjectId } = useParams();

  const handleDetail = () => {
    const target = classSubjectId || CLASS_SCHEDULE[0]?.classSubjectId;
    if (!target) return;

    navigate(`/teacher/class/${target}`);
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <PageHeader
          title="Jadwal Kelas"
          description="Jadwal pertemuan tiap mata pelajaran yang Anda ajar."
        />

        {onPrintReport && (
          <Button
            variant="outline"
            icon={FileText}
            isLoading={isPrintLoading}
            onClick={onPrintReport}
          >
            Cetak Laporan
          </Button>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="relative w-full min-w-[640px] text-left text-sm">
            <thead className="bg-background/70 text-xs uppercase text-muted">
              <tr>
                <th className="px-5 py-3.5 font-medium">Hari</th>
                <th className="px-5 py-3.5 font-medium">Jam</th>
                <th className="px-5 py-3.5 font-medium">Nama</th>
                <th className="px-5 py-3.5 font-medium">Mata Pelajaran</th>
                <th className="px-5 py-3.5 font-medium">Kelas</th>
                <th className="px-5 py-3.5 text-right font-medium">Status</th>
                <th className="px-5 py-3.5 text-right font-medium">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {CLASS_SCHEDULE.map((item) => (
                <tr key={item.id} className="hover:bg-background/50">
                  <td className="px-5 py-4 font-medium text-foreground">
                    {item.day}
                  </td>
                  <td className="px-5 py-4 text-foreground">
                    {item.start} – {item.end}
                  </td>
                  <td className="px-5 py-4 font-medium text-foreground">
                    {item.name}
                  </td>
                  <td className="px-5 py-4 font-medium text-foreground">
                    {item.subject}
                  </td>
                  <td className="px-5 py-4 font-medium text-foreground">
                    {item.class}
                  </td>

                  <td className="px-5 py-4 text-right">
                    <Button variant="outline" size="S">
                      {item.status}
                    </Button>
                  </td>

                  <td className="relative px-5 py-4 text-right">
                    <Tooltip label="Lihat detail kelas">
                      <Button
                        variant="ghost"
                        size="S"
                        icon={Eye}
                        iconOnly
                        onClick={handleDetail}
                        aria-label="Lihat detail kelas"
                      />
                    </Tooltip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default ClassSchedule;
