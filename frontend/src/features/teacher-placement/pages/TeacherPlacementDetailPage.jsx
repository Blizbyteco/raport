import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  BookOpen,
  Check,
  GraduationCap,
  Pencil,
  Plus,
  School,
  Search,
  Trash2,
  UserRound,
  Users,
  X,
} from "lucide-react";

import Button from "@/shared/ui/button/Button";
import Input from "@/shared/ui/form/Input";
import Modal from "@/shared/ui/overlay/Modal";
import Select from "@/shared/ui/form/Select";
import Tooltip from "@/shared/ui/feedback/Tooltip";
import useClasses from "@/features/class/hooks/useClasses";
import useActiveAcademicYear from "@/features/academic-year/hooks/useActiveAcademicYear";
import useTeachers from "@/features/teachers/hooks/useTeachers";
import useSubjects from "@/features/subjects/hooks/useSubjects";
import {
  useClassSubjects,
  useHomeroomTeacher,
} from "../hooks/useTeacherPlacementQueries";
import {
  useCreateClassSubject,
  useDeleteClassSubject,
  useRemoveHomeroomTeacher,
  useSetHomeroomTeacher,
  useUpdateClassSubject,
} from "../hooks/useTeacherPlacementMutations";

const TeacherPlacementDetailPage = () => {
  const navigate = useNavigate();
  const { classId } = useParams();

  const [homeroomTeacherId, setHomeroomTeacherId] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [subjectId, setSubjectId] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [search, setSearch] = useState("");
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [editSubjectId, setEditSubjectId] = useState("");
  const [editTeacherId, setEditTeacherId] = useState("");
  const [assignmentToDelete, setAssignmentToDelete] = useState(null);

  const { data: classes } = useClasses();
  const { data: academicYear } = useActiveAcademicYear();
  const academicYearId = academicYear?.id;

  const { data: teachersData } = useTeachers();
  const { data: subjects } = useSubjects();

  const { data: homeroom } = useHomeroomTeacher(classId, academicYearId);
  const { data: assignments, isLoading } = useClassSubjects(
    classId,
    academicYearId,
  );

  const setHomeroomMutation = useSetHomeroomTeacher();
  const removeHomeroomMutation = useRemoveHomeroomTeacher();
  const createAssignmentMutation = useCreateClassSubject();
  const updateAssignmentMutation = useUpdateClassSubject();
  const deleteAssignmentMutation = useDeleteClassSubject();

  const classItem = (classes ?? []).find(
    (item) => String(item.id) === String(classId),
  );
  const teachers = teachersData?.data ?? [];
  const subjectList = subjects ?? [];

  const yearLabel = academicYear
    ? `${academicYear.start_year}/${academicYear.end_year}`
    : "-";

  const assignedSubjectIds = new Set(
    (assignments ?? []).map((item) => item.subject_id),
  );

  const availableSubjects = subjectList.filter(
    (subject) => !assignedSubjectIds.has(subject.id),
  );

  const editableSubjects = subjectList.filter(
    (subject) =>
      !assignedSubjectIds.has(subject.id) ||
      String(subject.id) === String(editingAssignment?.subject_id),
  );

  const filteredAssignments = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    return (assignments ?? []).filter((item) => {
      if (!keyword) return true;

      return (
        item.subject?.name?.toLowerCase().includes(keyword) ||
        item.teacher?.full_name?.toLowerCase().includes(keyword)
      );
    });
  }, [assignments, search]);

  const resetAssignmentForm = () => {
    setSubjectId("");
    setTeacherId("");
    setShowAddForm(false);
  };

  const handleSetHomeroom = (event) => {
    event.preventDefault();

    if (!homeroomTeacherId || !academicYearId) return;

    setHomeroomMutation.mutate(
      {
        classId,
        data: {
          academic_year_id: academicYearId,
          teacher_id: Number(homeroomTeacherId),
        },
      },
      { onSuccess: () => setHomeroomTeacherId("") },
    );
  };

  const handleRemoveHomeroom = () => {
    if (!academicYearId) return;

    removeHomeroomMutation.mutate({ classId, academicYearId });
  };

  const handleCreateAssignment = (event) => {
    event.preventDefault();

    if (!subjectId || !teacherId || !academicYearId) return;

    createAssignmentMutation.mutate(
      {
        classId,
        data: {
          academic_year_id: academicYearId,
          subject_id: Number(subjectId),
          teacher_id: Number(teacherId),
        },
      },
      { onSuccess: resetAssignmentForm },
    );
  };

  const closeEditForm = () => {
    setEditingAssignment(null);
    setEditSubjectId("");
    setEditTeacherId("");
  };

  const handleOpenEditForm = (assignment) => {
    setEditingAssignment(assignment);
    setEditSubjectId(String(assignment.subject_id ?? ""));
    setEditTeacherId(String(assignment.teacher_id ?? ""));
  };

  const handleUpdateAssignment = () => {
    if (!editingAssignment || !editSubjectId || !editTeacherId) return;

    updateAssignmentMutation.mutate(
      {
        classId,
        classSubjectId: editingAssignment.id,
        data: {
          subject_id: Number(editSubjectId),
          teacher_id: Number(editTeacherId),
        },
      },
      { onSuccess: closeEditForm },
    );
  };

  const handleDeleteAssignment = () => {
    if (!assignmentToDelete) return;

    deleteAssignmentMutation.mutate(
      { classId, classSubjectId: assignmentToDelete.id },
      { onSuccess: () => setAssignmentToDelete(null) },
    );
  };

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        size="S"
        icon={ArrowLeft}
        onClick={() => navigate("/dashboard/teacher-placement")}
        className="-ml-2"
      >
        Kembali ke Penempatan Guru
      </Button>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-muted">
            <span>Penempatan Guru</span>
            <span>/</span>
            <span>Kelas {classItem?.name ?? ""}</span>
          </div>

          <h1 className="text-2xl font-bold text-foreground">
            Penempatan Guru Kelas {classItem?.name ?? ""}
          </h1>

          <p className="mt-1 text-sm text-muted">
            Tambahkan dan kelola penugasan guru pada kelas ini.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3">
          <GraduationCap size={20} className="text-primary" />
          <div>
            <p className="text-xs text-muted">Tahun Ajaran</p>
            <p className="text-sm font-semibold text-foreground">{yearLabel}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InfoCard
          icon={School}
          label="Kelas"
          value={`Tingkat ${classItem?.grade_level ?? "-"} ${classItem?.name ?? ""}`}
        />
        <InfoCard
          icon={Users}
          label="Jumlah Siswa"
          value={`${classItem?.students_count ?? 0} siswa`}
        />
      </div>

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
          {homeroom?.teacher ? (
            <div className="mb-4 flex items-center gap-3 rounded-xl border border-border bg-background p-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                {homeroom.teacher.full_name?.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-foreground">
                  {homeroom.teacher.full_name}
                </p>
                <p className="mt-1 text-xs text-muted">
                  NIP. {homeroom.teacher.nip}
                </p>
              </div>
              <Tooltip label="Hapus wali kelas">
                <Button
                  variant="ghost"
                  size="S"
                  icon={Trash2}
                  iconOnly
                  onClick={handleRemoveHomeroom}
                  isLoading={removeHomeroomMutation.isPending}
                  aria-label="Hapus wali kelas"
                />
              </Tooltip>
            </div>
          ) : (
            <p className="mb-4 rounded-xl border border-dashed border-border bg-background p-4 text-sm text-muted">
              Belum ada guru wali kelas yang ditentukan.
            </p>
          )}

          <form
            onSubmit={handleSetHomeroom}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <Select
              value={homeroomTeacherId}
              onChange={(event) => setHomeroomTeacherId(event.target.value)}
              disabled={!academicYearId}
              className="flex-1"
            >
              <option value="">Pilih guru wali kelas</option>
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.full_name} — {teacher.nip}
                </option>
              ))}
            </Select>

            <Button
              type="submit"
              icon={Check}
              disabled={!homeroomTeacherId || !academicYearId}
              isLoading={setHomeroomMutation.isPending}
            >
              Simpan Wali Kelas
            </Button>
          </form>
        </div>
      </section>

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
                {assignments?.length ?? 0} penugasan guru pada kelas ini.
              </p>
            </div>
          </div>

          <Button
            icon={Plus}
            onClick={() => setShowAddForm((current) => !current)}
            disabled={!availableSubjects.length || !academicYearId}
          >
            Tambah Penugasan
          </Button>
        </div>

        {showAddForm && (
          <form
            onSubmit={handleCreateAssignment}
            className="space-y-4 border-b border-border bg-background/50 p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold text-foreground">
                  Tambah Guru Mata Pelajaran
                </h3>
                <p className="mt-1 text-sm text-muted">
                  Pilih mata pelajaran dan guru pengampunya.
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="S"
                icon={X}
                iconOnly
                onClick={resetAssignmentForm}
                aria-label="Tutup form"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <Select
                label="Mata Pelajaran"
                value={subjectId}
                onChange={(event) => setSubjectId(event.target.value)}
                required
              >
                <option value="">Pilih mata pelajaran</option>
                {availableSubjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </Select>

              <Select
                label="Guru Pengampu"
                value={teacherId}
                onChange={(event) => setTeacherId(event.target.value)}
                required
              >
                <option value="">Pilih guru</option>
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.full_name} — {teacher.nip}
                  </option>
                ))}
              </Select>
            </div>

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" onClick={resetAssignmentForm}>
                Batal
              </Button>
              <Button
                type="submit"
                icon={Check}
                disabled={!subjectId || !teacherId || !academicYearId}
                isLoading={createAssignmentMutation.isPending}
              >
                Simpan Penugasan
              </Button>
            </div>
          </form>
        )}

        <div className="border-b border-border p-4">
          <div className="w-full sm:max-w-sm">
            <Input
              icon={Search}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari mapel atau nama guru..."
            />
          </div>
        </div>

        {isLoading ? (
          <p className="p-5 text-sm text-muted">Memuat penugasan...</p>
        ) : filteredAssignments.length > 0 ? (
          <div className="divide-y divide-border">
            {filteredAssignments.map((assignment) => (
              <div
                key={assignment.id}
                className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground">
                    {assignment.subject?.name ?? "Mata pelajaran"}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted">
                    <UserRound size={14} />
                    <span>
                      {assignment.teacher?.full_name ?? "Guru tidak ditemukan"}
                    </span>
                    {assignment.teacher?.nip && (
                      <span className="text-xs">· NIP. {assignment.teacher.nip}</span>
                    )}
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  <Tooltip label="Ubah data penugasan">
                    <Button
                      variant="ghost"
                      size="S"
                      icon={Pencil}
                      iconOnly
                      onClick={() => handleOpenEditForm(assignment)}
                      aria-label="Ubah data penugasan"
                    />
                  </Tooltip>

                  <Tooltip label="Hapus data penugasan">
                    <Button
                      variant="ghost"
                      size="S"
                      icon={Trash2}
                      iconOnly
                      onClick={() => setAssignmentToDelete(assignment)}
                      className="hover:text-danger"
                      aria-label="Hapus data penugasan"
                    />
                  </Tooltip>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-5 py-12 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-background text-muted">
              <BookOpen size={23} />
            </div>
            <p className="font-medium text-foreground">
              {search ? "Penugasan tidak ditemukan" : "Belum ada penugasan guru"}
            </p>
            <p className="mt-1 text-sm text-muted">
              {search
                ? "Coba gunakan kata kunci lain."
                : "Klik Tambah Penugasan untuk menambahkan guru mapel."}
            </p>
          </div>
        )}

        <div className="border-t border-border bg-background/50 px-5 py-3">
          <p className="text-xs text-muted">
            Penugasan guru berlaku untuk kelas dan tahun ajaran yang dipilih.
          </p>
        </div>
      </section>

      <Modal
        open={Boolean(editingAssignment)}
        onClose={closeEditForm}
        title="Ubah data penugasan"
        description={
          editingAssignment?.subject?.name
            ? `${editingAssignment.subject.name} — Kelas ${classItem?.name ?? ""}`
            : undefined
        }
        footer={
          <>
            <Button variant="outline" onClick={closeEditForm}>
              Batal
            </Button>
            <Button
              icon={Check}
              onClick={handleUpdateAssignment}
              disabled={!editSubjectId || !editTeacherId}
              isLoading={updateAssignmentMutation.isPending}
            >
              Simpan Perubahan
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select
            label="Mata Pelajaran"
            value={editSubjectId}
            onChange={(event) => setEditSubjectId(event.target.value)}
            required
          >
            <option value="">Pilih mata pelajaran</option>
            {editableSubjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </Select>

          <Select
            label="Guru Pengampu"
            value={editTeacherId}
            onChange={(event) => setEditTeacherId(event.target.value)}
            required
          >
            <option value="">Pilih guru</option>
            {teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.full_name} — {teacher.nip}
              </option>
            ))}
          </Select>
        </div>
      </Modal>

      <Modal
        open={Boolean(assignmentToDelete)}
        onClose={() => setAssignmentToDelete(null)}
        title="Hapus data penugasan"
        description={
          assignmentToDelete
            ? `${assignmentToDelete.subject?.name ?? "Mata pelajaran"} — ${
                assignmentToDelete.teacher?.full_name ?? "Guru tidak ditemukan"
              }`
            : undefined
        }
        size="S"
        footer={
          <>
            <Button variant="outline" onClick={() => setAssignmentToDelete(null)}>
              Batal
            </Button>
            <Button
              variant="danger"
              icon={Trash2}
              onClick={handleDeleteAssignment}
              isLoading={deleteAssignmentMutation.isPending}
            >
              Hapus
            </Button>
          </>
        }
      >
        <p className="text-sm text-muted">
          Penugasan ini akan dihapus dari Kelas {classItem?.name ?? ""}.
        </p>
      </Modal>
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
