import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import {
  Search,
  BookOpen,
  GraduationCap,
  ArrowUpRight,
  School,
  Users,
} from "lucide-react";

const mockClasses = [
  {
    id: 1,
    name: "7A",
    department: "SMP",
    studentCount: 32,
    assignedSubjects: 8,
    homeroomTeacher: "Siti Aminah, S.Pd.",
  },
  {
    id: 2,
    name: "7B",
    department: "SMP",
    studentCount: 30,
    assignedSubjects: 10,
    homeroomTeacher: "Budi Santoso, S.Pd.",
  },
  {
    id: 3,
    name: "8A",
    department: "SMP",
    studentCount: 31,
    assignedSubjects: 6,
    homeroomTeacher: null,
  },
  {
    id: 4,
    name: "8B",
    department: "SMP",
    studentCount: 29,
    assignedSubjects: 10,
    homeroomTeacher: "Dewi Lestari, S.Pd.",
  },
];

const TeacherPlacementPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filteredClasses = useMemo(() => {
    return mockClasses.filter((schoolClass) =>
      schoolClass.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search]);

  const totalClasses = mockClasses.length;

  const totalAssignments = mockClasses.reduce(
    (total, schoolClass) => total + schoolClass.assignedSubjects,
    0,
  );

  const totalStudents = mockClasses.reduce(
    (total, schoolClass) => total + schoolClass.studentCount,
    0,
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-muted">
            <School size={16} />
            <span>Akademik</span>
            <span>/</span>
            <span>Penempatan Guru</span>
          </div>

          <h1 className="text-2xl font-bold text-foreground">
            Penempatan Guru
          </h1>

          <p className="mt-1 text-sm text-muted">
            Kelola guru wali kelas dan guru mata pelajaran.
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <GraduationCap size={21} />
          </div>

          <div>
            <p className="text-xs text-muted">Tahun Ajaran Aktif</p>
            <p className="text-sm font-semibold text-foreground">2026/2027</p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard
          title="Total Kelas"
          value={totalClasses}
          description="Kelas pada tahun ajaran aktif"
          icon={School}
        />

        <SummaryCard
          title="Penugasan Guru Mapel"
          value={totalAssignments}
          description="Total penugasan mata pelajaran"
          icon={BookOpen}
        />

        <SummaryCard
          title="Total Siswa"
          value={totalStudents}
          description="Siswa dari seluruh kelas"
          icon={Users}
        />
      </div>

      {/* Class List */}
      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Daftar Kelas
            </h2>
            <p className="text-sm text-muted">
              Pilih kelas untuk mengelola penempatan guru.
            </p>
          </div>

          <div className="relative w-full sm:max-w-xs">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama kelas..."
              className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-4 text-sm text-foreground outline-none transition focus:border-primary"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredClasses.map((schoolClass) => (
            <button
              key={schoolClass.id}
              type="button"
              onClick={() => navigate(`/teacher-placement/${schoolClass.id}`)}
              className="group rounded-2xl border border-border bg-card p-5 text-left transition hover:ring-1 hover:ring-primary"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <School size={23} />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-foreground">
                      {schoolClass.name}
                    </h3>

                    <p className="text-xs text-muted">
                      {schoolClass.department} · {schoolClass.studentCount}{" "}
                      siswa
                    </p>
                  </div>
                </div>
              </div>

              {/* Card Information */}
              <div className="my-5 space-y-3">
                <div className="flex items-start justify-between gap-3 text-sm">
                  <span className="shrink-0 text-muted">Guru wali kelas</span>

                  <span className="text-right font-medium text-foreground">
                    {schoolClass.homeroomTeacher || (
                      <span className="text-muted">Belum ditentukan</span>
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">Guru mata pelajaran</span>

                  <span className="font-medium text-foreground">
                    {schoolClass.assignedSubjects} penugasan
                  </span>
                </div>
              </div>

              {/* Card Footer */}
              <div className="flex justify-end border-t border-border pt-4">
                <span className="flex items-center gap-1 text-sm font-medium text-primary">
                  Kelola Penempatan
                  <ArrowUpRight size={15} />
                </span>
              </div>
            </button>
          ))}
        </div>

        {filteredClasses.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border py-12 text-center">
            <School size={28} className="mx-auto mb-3 text-muted" />

            <p className="font-medium text-foreground">Kelas tidak ditemukan</p>

            <p className="mt-1 text-sm text-muted">
              Coba gunakan kata kunci lain.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

const SummaryCard = ({ title, value, description, icon: Icon }) => (
  <div className="rounded-2xl border border-border bg-card p-5">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-muted">{title}</p>
        <h3 className="mt-2 text-2xl font-bold text-foreground">{value}</h3>
      </div>

      <div className="rounded-xl bg-primary/10 p-3 text-primary">
        <Icon size={21} />
      </div>
    </div>

    <p className="mt-3 text-xs text-muted">{description}</p>
  </div>
);

export default TeacherPlacementPage;
