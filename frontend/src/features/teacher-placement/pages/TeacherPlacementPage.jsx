import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Search,
  BookOpen,
  GraduationCap,
  ArrowUpRight,
  School,
  Users,
} from "lucide-react";

import Input from "@/shared/ui/form/Input";
import useClasses from "@/features/class/hooks/useClasses";
import useActiveAcademicYear from "@/features/academic-year/hooks/useActiveAcademicYear";

const TeacherPlacementPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const { data, isLoading, isError } = useClasses(search);
  const { data: academicYear } = useActiveAcademicYear();

  const classes = data ?? [];
  const yearLabel = academicYear
    ? `${academicYear.start_year}/${academicYear.end_year}`
    : "-";

  const totalAssignments = classes.reduce(
    (total, schoolClass) => total + (schoolClass.subjects_count ?? 0),
    0,
  );

  const totalStudents = classes.reduce(
    (total, schoolClass) => total + (schoolClass.students_count ?? 0),
    0,
  );

  return (
    <div className="space-y-6">
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
            <p className="text-sm font-semibold text-foreground">{yearLabel}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard
          title="Total Kelas"
          value={classes.length}
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

          <div className="w-full sm:max-w-xs">
            <Input
              icon={Search}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari nama kelas..."
            />
          </div>
        </div>

        {isLoading ? (
          <p className="text-sm text-muted">Memuat daftar kelas...</p>
        ) : isError ? (
          <p className="text-sm text-danger">Gagal memuat daftar kelas.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {classes.map((schoolClass) => {
              const homeroom =
                schoolClass.homeroomTeachers?.[0]?.teacher?.full_name;

              return (
                <button
                  key={schoolClass.id}
                  type="button"
                  onClick={() =>
                    navigate(`/dashboard/teacher-placement/${schoolClass.id}`)
                  }
                  className="group rounded-2xl border border-border bg-card p-5 text-left transition hover:ring-1 hover:ring-primary"
                >
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
                          Tingkat {schoolClass.grade_level} ·{" "}
                          {schoolClass.students_count ?? 0} siswa
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="my-5 space-y-3">
                    <div className="flex items-start justify-between gap-3 text-sm">
                      <span className="shrink-0 text-muted">Guru wali kelas</span>
                      <span className="text-right font-medium text-foreground">
                        {homeroom || (
                          <span className="text-muted">Belum ditentukan</span>
                        )}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted">Guru mata pelajaran</span>
                      <span className="font-medium text-foreground">
                        {schoolClass.subjects_count ?? 0} penugasan
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-end border-t border-border pt-4">
                    <span className="flex items-center gap-1 text-sm font-medium text-primary">
                      Kelola Penempatan
                      <ArrowUpRight size={15} />
                    </span>
                  </div>
                </button>
              );
            })}

            {!classes.length && (
              <div className="rounded-2xl border border-dashed border-border py-12 text-center md:col-span-2 xl:col-span-3">
                <School size={28} className="mx-auto mb-3 text-muted" />
                <p className="font-medium text-foreground">
                  Kelas tidak ditemukan
                </p>
                <p className="mt-1 text-sm text-muted">
                  Coba gunakan kata kunci lain.
                </p>
              </div>
            )}
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
