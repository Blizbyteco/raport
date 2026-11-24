import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  BookOpen,
  CalendarClock,
  GraduationCap,
  Save,
  Users,
} from "lucide-react";

import Button from "@/shared/ui/button/Button";
import Textarea from "@/shared/ui/form/Textarea";
import Breadcrumb from "@/shared/ui/navigation/Breadcrumb";
import SummaryCard from "../ui/SummaryCard";
import PresenceReport from "../ui/PresenceReport";

// Static data for the schedule detail page (to be replaced with real data later)
const CLASS_OVERVIEW = {
  class: "XII-B",
  studyField: "Matematika",
  totalStudents: 26,
  status: "on-going",
};

const STUDENTS = [
  { id: 1, name: "Ahmad Naufal", nisn: "0012116001" },
  { id: 2, name: "Siti Rahayu", nisn: "0012116002" },
  { id: 3, name: "Budi Santoso", nisn: "0012116003" },
];

// Simple djb2-based hash, used to give each detail schedule page a unique id
const generateUniqueId = (value) => {
  const str = String(value ?? "");
  let hash = 5381;

  for (let i = 0; i < str.length; i += 1) {
    hash = (hash * 33 + str.charCodeAt(i)) % 4294967291;
  }

  return hash.toString(16);
};

const ClassScheduleDetailPage = () => {
  const navigate = useNavigate();
  const { classSubjectId } = useParams();

  const uniquePageId = useMemo(
    () => generateUniqueId(classSubjectId ?? "schedule"),
    [classSubjectId],
  );

  const [studentPresence, setStudentPresence] = useState({});
  const [notes, setNotes] = useState("");
  const [isClosed, setIsClosed] = useState(false);

  const togglePresence = (id) => {
    setStudentPresence((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const totalPresent = Object.values(studentPresence).filter(Boolean).length;

  const handleSave = () => {
    // TODO: hubungkan ke API penyimpanan jadwal dan presensi
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <Breadcrumb
        items={[
          { label: "Beranda", path: "/teacher" },
          { label: "Kelas" },
          { label: "Jadwal Kelas" },
        ]}
      />

      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="S"
          icon={ArrowLeft}
          onClick={() => navigate(`/teacher/class/${classSubjectId}`)}
          className="-ml-2"
        >
          Kembali ke Kelas
        </Button>

        <span className="text-xs text-muted">ID Halaman: {uniquePageId}</span>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <SummaryCard
          icon={GraduationCap}
          label="Kelas"
          value={CLASS_OVERVIEW.class}
          description="Kelas pembelajaran"
        />
        <SummaryCard
          icon={Users}
          label="Total Siswa"
          value={CLASS_OVERVIEW.totalStudents}
          description="Siswa yang terdaftar"
        />
        <SummaryCard
          icon={BookOpen}
          label="Mata Pelajaran"
          value={CLASS_OVERVIEW.studyField}
          description="Study field kelas"
        />
        <SummaryCard
          icon={CalendarClock}
          label="Status Kelas"
          value={CLASS_OVERVIEW.status}
          description="Status: finished / on-going / canceled / upcoming"
        />
      </div>

      <PresenceReport />

      <section className="space-y-3">
        <div>
          <h2 className="font-semibold text-foreground">Presensi Siswa</h2>
          <p className="mt-1 text-sm text-muted">
            Tandai siswa yang hadir ({totalPresent} dari {STUDENTS.length}).
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="bg-background/70 text-xs uppercase text-muted">
              <tr>
                <th className="px-5 py-3.5 font-medium">NISN</th>
                <th className="px-5 py-3.5 font-medium">Nama Siswa</th>
                <th className="px-5 py-3.5 text-center font-medium">Hadir</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {STUDENTS.map((student) => (
                <tr key={student.id} className="hover:bg-background/50">
                  <td className="px-5 py-4 font-medium text-foreground">
                    {student.nisn}
                  </td>
                  <td className="px-5 py-4 font-medium text-foreground">
                    {student.name}
                  </td>
                  <td className="px-5 py-4 text-center">
                    <input
                      type="checkbox"
                      checked={Boolean(studentPresence[student.id])}
                      disabled
                      onChange={() => togglePresence(student.id)}
                      className="size-4 accent-primary"
                      aria-label={`Hadir ${student.name}`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="flex justify-end">
        <Button
          variant="outline"
          icon={BookOpen}
          onClick={() =>
            navigate(`/teacher/class/${classSubjectId}/evaluation`)
          }
        >
          Evaluasi
        </Button>
      </div>

      <section className="space-y-2">
        <Textarea
          label="Catatan (opsional)"
          placeholder="Catatan tambahan untuk jadwal kelas..."
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          rows={4}
        />
      </section>

      {isClosed && (
        <div className="rounded-xl border border-warning/30 bg-warning/10 p-4 text-sm text-warning">
          Jadwal ditutup karena guru tidak hadir.
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button variant="danger" onClick={() => setIsClosed(true)}>
          Guru Tidak Hadir
        </Button>
        <Button icon={Save} onClick={handleSave}>
          Simpan
        </Button>
      </div>
    </div>
  );
};

export default ClassScheduleDetailPage;
