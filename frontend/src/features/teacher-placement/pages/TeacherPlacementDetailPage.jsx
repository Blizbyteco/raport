import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useForm } from "react-hook-form";

import Button from "@/shared/ui/button/Button";
import Tooltip from "@/shared/ui/feedback/Tooltip";
import {
  ArrowLeft,
  BookOpen,
  Check,
  GraduationCap,
  Search,
  UserRound,
  Users,
  Trash2,
  UserPlus,
  Plus,
  School,
  X,
} from "lucide-react";

// TODO: Ganti dengan data API berdasarkan classId
const mockClass = {
  id: 1,
  name: "7A",
  department: "SMP",
  academicYear: "2026/2027",
  studentCount: 32,
  homeroomTeacherId: 1,
};

// TODO: Ganti dengan data guru dari API
const mockTeachers = [
  { id: 1, name: "Siti Aminah, S.Pd.", nip: "198701012010012001" },
  { id: 2, name: "Budi Santoso, S.Pd.", nip: "198805052012011002" },
  { id: 3, name: "Dewi Lestari, S.Pd.", nip: "199001102015022003" },
  { id: 4, name: "Ahmad Fauzi, S.Pd.", nip: "198912122014031004" },
  { id: 5, name: "Rina Kartika, S.Pd.", nip: "199205202016042005" },
];

// TODO: Ganti dengan daftar mapel yang tersedia dari API
const mockSubjects = [
  { id: 1, name: "Matematika" },
  { id: 2, name: "Bahasa Indonesia" },
  { id: 3, name: "Bahasa Inggris" },
  { id: 4, name: "IPA" },
  { id: 5, name: "IPS" },
  { id: 6, name: "Pendidikan Pancasila" },
  { id: 7, name: "Informatika" },
  { id: 8, name: "PJOK" },
];

// TODO: Ganti dengan response GET /classes/{schoolClass}/subjects
const initialAssignments = [
  { id: 1, subjectId: 1, teacherId: 2 },
  { id: 2, subjectId: 2, teacherId: 1 },
  { id: 3, subjectId: 3, teacherId: 3 },
];

const TeacherPlacementDetailPage = () => {
  const navigate = useNavigate();
  const { classId } = useParams();

  const [homeroomTeacherId, setHomeroomTeacherId] = useState(
    mockClass.homeroomTeacherId,
  );

  const [assignments, setAssignments] = useState(initialAssignments);
  const [showAddForm, setShowAddForm] = useState(false);
  const [search, setSearch] = useState("");

  const {
    register: registerHomeroom,
    handleSubmit: handleHomeroomSubmit,
    reset: resetHomeroom,
  } = useForm({
    defaultValues: {
      teacherId: String(mockClass.homeroomTeacherId ?? ""),
    },
  });

  const {
    register: registerAssignment,
    handleSubmit: handleAssignmentSubmit,
    reset: resetAssignment,
    formState: { errors },
  } = useForm({
    defaultValues: {
      subjectId: "",
      teacherId: "",
    },
  });

  const getTeacher = (teacherId) =>
    mockTeachers.find((teacher) => teacher.id === Number(teacherId));

  const getSubject = (subjectId) =>
    mockSubjects.find((subject) => subject.id === Number(subjectId));

  const assignedSubjectIds = assignments.map(
    (assignment) => assignment.subjectId,
  );

  const availableSubjects = mockSubjects.filter(
    (subject) => !assignedSubjectIds.includes(subject.id),
  );

  const filteredAssignments = assignments.filter((assignment) => {
    const subject = getSubject(assignment.subjectId);
    const teacher = getTeacher(assignment.teacherId);

    const keyword = search.toLowerCase();

    return (
      subject?.name.toLowerCase().includes(keyword) ||
      teacher?.name.toLowerCase().includes(keyword)
    );
  });

  const homeroomTeacher = getTeacher(homeroomTeacherId);

  // UI DEMO: Simpan wali kelas ke state lokal.
  const saveHomeroomTeacher = (data) => {
    const teacherId = data.teacherId ? Number(data.teacherId) : null;

    setHomeroomTeacherId(teacherId);

    // TODO: PUT /api/classes/{schoolClass}/homeroom-teacher
    // Kirim teacher_id ke backend.
  };

  // UI DEMO: Tambah penugasan ke state lokal.
  const saveAssignment = (data) => {
    const subjectId = Number(data.subjectId);
    const teacherId = Number(data.teacherId);

    // Cegah penugasan mapel yang sama lebih dari sekali.
    if (assignments.some((assignment) => assignment.subjectId === subjectId)) {
      return;
    }

    setAssignments((current) => [
      ...current,
      {
        id: Date.now(),
        subjectId,
        teacherId,
      },
    ]);

    resetAssignment();
    setShowAddForm(false);

    // TODO: POST /api/classes/{schoolClass}/subjects
    // Kirim subject_id dan teacher_id ke backend.
  };

  // UI DEMO: Hapus penugasan dari state lokal.
  const deleteAssignment = (assignmentId) => {
    setAssignments((current) =>
      current.filter((assignment) => assignment.id !== assignmentId),
    );

    // TODO: DELETE /api/classes/{schoolClass}/subjects/{classSubject}
  };

  const openAddForm = () => {
    resetAssignment();
    setShowAddForm(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <button
          type="button"
          onClick={() => navigate("/teacher-placement")}
          className="mb-4 inline-flex items-center gap-2 text-sm text-muted transition hover:text-primary"
        >
          <ArrowLeft size={17} />
          Kembali ke Penempatan Guru
        </button>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-muted">
              <span>Penempatan Guru</span>
              <span>/</span>
              <span>Kelas {mockClass.name}</span>
            </div>

            <h1 className="text-2xl font-bold text-foreground">
              Penempatan Guru Kelas {mockClass.name}
            </h1>

            <p className="mt-1 text-sm text-muted">
              Tambahkan dan kelola penugasan guru pada kelas ini.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3">
            <GraduationCap size={20} className="text-primary" />
            <div>
              <p className="text-xs text-muted">Tahun Ajaran</p>
              <p className="text-sm font-semibold text-foreground">
                {mockClass.academicYear}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Class Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InfoCard
          icon={School}
          label="Kelas"
          value={`${mockClass.department} ${mockClass.name}`}
        />

        <InfoCard
          icon={Users}
          label="Jumlah Siswa"
          value={`${mockClass.studentCount} siswa`}
        />
      </div>

      {/* Homeroom Teacher */}
      <section className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="flex items-center gap-3 border-b border-border p-5">
          <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
            <UserRound size={21} />
          </div>

          <div>
            <h2 className="font-semibold text-foreground">Guru Wali Kelas</h2>
            <p className="text-sm text-muted">
              Tentukan guru yang bertanggung jawab sebagai wali kelas.
            </p>
          </div>
        </div>

        <div className="p-5">
          {homeroomTeacher ? (
            <div className="mb-4 flex items-center gap-3 rounded-xl border border-border bg-background p-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                {homeroomTeacher.name.charAt(0)}
              </div>

              <div className="min-w-0 flex-1">
                <p className="font-medium text-foreground">
                  {homeroomTeacher.name}
                </p>
                <p className="mt-1 text-xs text-muted">
                  NIP. {homeroomTeacher.nip}
                </p>
              </div>
            </div>
          ) : (
            <div className="mb-4 rounded-xl border border-dashed border-border bg-background p-4 text-sm text-muted">
              Belum ada guru wali kelas yang ditentukan.
            </div>
          )}

          <form
            onSubmit={handleHomeroomSubmit(saveHomeroomTeacher)}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <select
              {...registerHomeroom("teacherId")}
              className="min-h-11 flex-1 rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
            >
              <option value="">Pilih guru wali kelas</option>

              {mockTeachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name} — {teacher.nip}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-white transition hover:opacity-90"
            >
              <Check size={16} />
              Simpan Wali Kelas
            </button>
          </form>
        </div>
      </section>

      {/* Subject Assignment List */}
      <section className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="flex flex-col gap-4 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
              <BookOpen size={21} />
            </div>

            <div>
              <h2 className="font-semibold text-foreground">
                Penugasan Guru Mata Pelajaran
              </h2>
              <p className="text-sm text-muted">
                {assignments.length} penugasan guru pada kelas ini.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={openAddForm}
            disabled={availableSubjects.length === 0}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus size={17} />
            Tambah Penugasan
          </button>
        </div>

        {/* Add Assignment Form */}
        {showAddForm && (
          <div className="border-b border-border bg-background/50 p-5">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold text-foreground">
                  Tambah Guru Mata Pelajaran
                </h3>
                <p className="mt-1 text-sm text-muted">
                  Pilih mata pelajaran dan guru pengampunya.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="rounded-lg p-1.5 text-muted transition hover:bg-background hover:text-foreground"
                aria-label="Tutup form"
              >
                <X size={18} />
              </button>
            </div>

            {availableSubjects.length === 0 ? (
              <p className="text-sm text-muted">
                Semua mata pelajaran yang tersedia sudah ditambahkan.
              </p>
            ) : (
              <form
                onSubmit={handleAssignmentSubmit(saveAssignment)}
                className="grid grid-cols-1 gap-4 lg:grid-cols-2"
              >
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Mata Pelajaran
                  </label>

                  <select
                    {...registerAssignment("subjectId", {
                      required: "Pilih mata pelajaran.",
                    })}
                    className="min-h-11 w-full rounded-xl border border-border bg-card px-3 text-sm text-foreground outline-none focus:border-primary"
                  >
                    <option value="">Pilih mata pelajaran</option>

                    {availableSubjects.map((subject) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name}
                      </option>
                    ))}
                  </select>

                  {errors.subjectId && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.subjectId.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Guru Pengampu
                  </label>

                  <select
                    {...registerAssignment("teacherId", {
                      required: "Pilih guru pengampu.",
                    })}
                    className="min-h-11 w-full rounded-xl border border-border bg-card px-3 text-sm text-foreground outline-none focus:border-primary"
                  >
                    <option value="">Pilih guru</option>

                    {mockTeachers.map((teacher) => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.name} — {teacher.nip}
                      </option>
                    ))}
                  </select>

                  {errors.teacherId && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.teacherId.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2 sm:flex-row lg:col-span-2 lg:justify-end">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="min-h-10 rounded-xl border border-border px-4 text-sm font-medium text-foreground transition hover:bg-card"
                  >
                    Batal
                  </button>

                  <button
                    type="submit"
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-white transition hover:opacity-90"
                  >
                    <Check size={16} />
                    Simpan Penugasan
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Search */}
        <div className="border-b border-border p-4">
          <div className="relative w-full sm:max-w-sm">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari mapel atau nama guru..."
              className="w-full rounded-xl border border-border bg-background py-2.5 pl-9 pr-3 text-sm text-foreground outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Assignment Rows */}
        {filteredAssignments.length > 0 ? (
          <div className="divide-y divide-border">
            {filteredAssignments.map((assignment, index) => {
              const subject = getSubject(assignment.subjectId);
              const teacher = getTeacher(assignment.teacherId);

              return (
                <div
                  key={assignment.id}
                  className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground">
                      {subject?.name ?? "Mata pelajaran"}
                    </p>

                    <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted">
                      <UserRound size={14} />
                      <span>{teacher?.name ?? "Guru tidak ditemukan"}</span>
                      {teacher?.nip && (
                        <span className="text-xs">· NIP. {teacher.nip}</span>
                      )}
                    </div>
                  </div>

                  <Tooltip label="Hapus penugasan">
                    <Button
                      variant="ghost"
                      size="S"
                      icon={Trash2}
                      iconOnly
                      onClick={() => deleteAssignment(assignment.id)}
                      aria-label="Hapus penugasan"
                      className="hover:text-danger"
                    />
                  </Tooltip>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="px-5 py-12 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-background text-muted">
              <BookOpen size={23} />
            </div>

            <p className="font-medium text-foreground">
              {search
                ? "Penugasan tidak ditemukan"
                : "Belum ada penugasan guru"}
            </p>

            <p className="mt-1 text-sm text-muted">
              {search
                ? "Coba gunakan kata kunci lain."
                : "Klik Tambah Penugasan untuk menambahkan guru mapel."}
            </p>

            {!search && (
              <button
                type="button"
                onClick={openAddForm}
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                <UserPlus size={16} />
                Tambah Penugasan
              </button>
            )}
          </div>
        )}

        <div className="border-t border-border bg-background/50 px-5 py-3">
          <p className="text-xs text-muted">
            Penugasan guru berlaku untuk kelas dan tahun ajaran yang dipilih.
          </p>
        </div>
      </section>
    </div>
  );
};

const InfoCard = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
    <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
      <Icon size={20} />
    </div>

    <div>
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 font-semibold text-foreground">{value}</p>
    </div>
  </div>
);

export default TeacherPlacementDetailPage;
