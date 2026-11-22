import { useState } from "react";
import { Check, GraduationCap, Search, UserRound } from "lucide-react";

import Button from "@/shared/ui/button/Button";
import Input from "@/shared/ui/form/Input";
import Modal from "@/shared/ui/overlay/Modal";
import Table from "@/shared/ui/data-display/Table";
import useActiveAcademicYear from "@/features/academic-year/hooks/useActiveAcademicYear";
import useStudents from "@/features/students/hooks/useStudents";
import useTeachers from "@/features/teachers/hooks/useTeachers";
import {
  useExtracurricularStudents,
  useExtracurricularTeachers,
} from "../hooks/useExtracurricularMemberQueries";
import useSaveExtracurricularMembers from "../hooks/useSaveExtracurricularMembers";

const modalTitle = "Atur anggota ekstrakurikuler";
const modalDescription = (name) =>
  `Kelola guru pembina dan siswa peserta ${name}.`;

const getAssignedIds = (assignments, relation, foreignKey) => [
  ...new Set(
    (assignments ?? [])
      .map((assignment) => assignment[foreignKey] ?? assignment[relation]?.id)
      .filter((id) => id !== undefined && id !== null)
      .map(String),
  ),
];

const ExtracurricularMembersModal = ({ extracurricular, onClose }) => {
  const [teacherSearch, setTeacherSearch] = useState("");
  const [studentSearch, setStudentSearch] = useState("");

  const {
    data: academicYear,
    isLoading: isYearLoading,
    isError: isYearError,
  } = useActiveAcademicYear();
  const academicYearId = academicYear?.id;
  const extracurricularId = extracurricular.id;

  const teachersQuery = useExtracurricularTeachers(
    extracurricularId,
    academicYearId,
  );
  const studentsQuery = useExtracurricularStudents(
    extracurricularId,
    academicYearId,
  );
  const teacherListQuery = useTeachers(teacherSearch);
  const studentListQuery = useStudents(studentSearch);

  if (isYearLoading || teachersQuery.isLoading || studentsQuery.isLoading) {
    return (
      <Modal
        open
        onClose={onClose}
        title={modalTitle}
        description={modalDescription(extracurricular.name)}
        size="L"
      >
        <p className="py-6 text-center text-sm text-muted">
          Memuat anggota ekstrakurikuler...
        </p>
      </Modal>
    );
  }

  if (isYearError || teachersQuery.isError || studentsQuery.isError) {
    return (
      <Modal
        open
        onClose={onClose}
        title={modalTitle}
        description={modalDescription(extracurricular.name)}
        size="L"
      >
        <p className="py-6 text-center text-sm text-danger">
          Gagal memuat anggota ekstrakurikuler.
        </p>
      </Modal>
    );
  }

  if (!academicYearId) {
    return (
      <Modal
        open
        onClose={onClose}
        title={modalTitle}
        description={modalDescription(extracurricular.name)}
        size="L"
      >
        <p className="py-6 text-center text-sm text-muted">
          Belum ada tahun ajaran aktif. Aktifkan tahun ajaran terlebih dahulu.
        </p>
      </Modal>
    );
  }

  return (
    <ExtracurricularMembersForm
      key={`${extracurricularId}-${academicYearId}`}
      extracurricular={extracurricular}
      extracurricularId={extracurricularId}
      academicYearId={academicYearId}
      initialTeacherIds={getAssignedIds(
        teachersQuery.data,
        "teacher",
        "teacher_id",
      )}
      initialStudentIds={getAssignedIds(
        studentsQuery.data,
        "student",
        "student_id",
      )}
      teacherList={{
        items: teacherListQuery.data?.data ?? [],
        isLoading: teacherListQuery.isLoading,
        isError: teacherListQuery.isError,
        isFetching: teacherListQuery.isFetching,
      }}
      studentList={{
        items: studentListQuery.data?.data ?? [],
        isLoading: studentListQuery.isLoading,
        isError: studentListQuery.isError,
        isFetching: studentListQuery.isFetching,
      }}
      teacherSearch={teacherSearch}
      studentSearch={studentSearch}
      onTeacherSearchChange={setTeacherSearch}
      onStudentSearchChange={setStudentSearch}
      onClose={onClose}
    />
  );
};

const ExtracurricularMembersForm = ({
  extracurricular,
  extracurricularId,
  academicYearId,
  initialTeacherIds,
  initialStudentIds,
  teacherList,
  studentList,
  teacherSearch,
  studentSearch,
  onTeacherSearchChange,
  onStudentSearchChange,
  onClose,
}) => {
  const [selectedTeacherIds, setSelectedTeacherIds] =
    useState(() => initialTeacherIds);
  const [selectedStudentIds, setSelectedStudentIds] =
    useState(() => initialStudentIds);

  const saveMutation = useSaveExtracurricularMembers(
    extracurricularId,
    academicYearId,
  );

  const toggleId = (setSelectedIds) => (id) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((selectedId) => selectedId !== id)
        : [...current, id],
    );
  };

  const toggleTeacher = toggleId(setSelectedTeacherIds);
  const toggleStudent = toggleId(setSelectedStudentIds);

  const addedTeacherIds = selectedTeacherIds.filter(
    (id) => !initialTeacherIds.includes(id),
  );
  const removedTeacherIds = initialTeacherIds.filter(
    (id) => !selectedTeacherIds.includes(id),
  );
  const addedStudentIds = selectedStudentIds.filter(
    (id) => !initialStudentIds.includes(id),
  );
  const removedStudentIds = initialStudentIds.filter(
    (id) => !selectedStudentIds.includes(id),
  );

  const hasChanges =
    addedTeacherIds.length > 0 ||
    removedTeacherIds.length > 0 ||
    addedStudentIds.length > 0 ||
    removedStudentIds.length > 0;

  const handleSave = () => {
    saveMutation.mutate(
      {
        addedTeacherIds,
        removedTeacherIds,
        addedStudentIds,
        removedStudentIds,
      },
      { onSuccess: onClose },
    );
  };

  return (
    <Modal
      open
      onClose={onClose}
      title={modalTitle}
      description={modalDescription(extracurricular.name)}
      size="L"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button
            icon={Check}
            onClick={handleSave}
            isLoading={saveMutation.isPending}
            disabled={!hasChanges || teacherList.isLoading || studentList.isLoading}
          >
            Simpan anggota
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        {saveMutation.isError && (
          <p className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
            Gagal menyimpan perubahan anggota. Silakan coba lagi.
          </p>
        )}

        <section className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <UserRound className="size-4 text-primary" />
              Guru pembina
            </h3>
            <span className="text-xs text-muted">
              {teacherList.isFetching
                ? "Mencari guru..."
                : `${selectedTeacherIds.length} guru dipilih`}
            </span>
          </div>

          <Input
            icon={Search}
            size="S"
            value={teacherSearch}
            onChange={(event) => onTeacherSearchChange(event.target.value)}
            placeholder="Cari nama atau NIP guru..."
          />

          {teacherList.isLoading ? (
            <p className="py-6 text-center text-sm text-muted">Memuat guru...</p>
          ) : teacherList.isError ? (
            <p className="py-6 text-center text-sm text-danger">
              Gagal memuat daftar guru.
            </p>
          ) : (
            <Table className="max-h-56 overflow-y-auto">
              <Table.Header>
                <Table.Row>
                  <Table.Head className="w-12">
                    <span className="sr-only">Pilih guru</span>
                  </Table.Head>
                  <Table.Head>Nama guru</Table.Head>
                  <Table.Head>NIP</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {teacherList.items.map((teacher) => {
                  const id = String(teacher.id);

                  return (
                    <Table.Row key={id}>
                      <Table.Cell className="w-12">
                        <input
                          type="checkbox"
                          checked={selectedTeacherIds.includes(id)}
                          onChange={() => toggleTeacher(id)}
                          aria-label={`Pilih guru ${teacher.full_name}`}
                          className="size-4 cursor-pointer accent-primary"
                        />
                      </Table.Cell>
                      <Table.Cell>
                        <span className="font-semibold text-foreground">
                          {teacher.full_name}
                        </span>
                      </Table.Cell>
                      <Table.Cell className="text-muted">
                        {teacher.nip ?? "-"}
                      </Table.Cell>
                    </Table.Row>
                  );
                })}

                {!teacherList.items.length && (
                  <Table.Row>
                    <Table.Cell
                      colSpan={3}
                      className="py-8 text-center text-muted"
                    >
                      Tidak ada guru ditemukan.
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table>
          )}
        </section>

        <section className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <GraduationCap className="size-4 text-primary" />
              Siswa peserta
            </h3>
            <span className="text-xs text-muted">
              {studentList.isFetching
                ? "Mencari siswa..."
                : `${selectedStudentIds.length} siswa dipilih`}
            </span>
          </div>

          <Input
            icon={Search}
            size="S"
            value={studentSearch}
            onChange={(event) => onStudentSearchChange(event.target.value)}
            placeholder="Cari nama atau NISN siswa..."
          />

          {studentList.isLoading ? (
            <p className="py-6 text-center text-sm text-muted">Memuat siswa...</p>
          ) : studentList.isError ? (
            <p className="py-6 text-center text-sm text-danger">
              Gagal memuat daftar siswa.
            </p>
          ) : (
            <Table className="max-h-56 overflow-y-auto">
              <Table.Header>
                <Table.Row>
                  <Table.Head className="w-12">
                    <span className="sr-only">Pilih siswa</span>
                  </Table.Head>
                  <Table.Head>Nama siswa</Table.Head>
                  <Table.Head>NISN</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {studentList.items.map((student) => {
                  const id = String(student.id);

                  return (
                    <Table.Row key={id}>
                      <Table.Cell className="w-12">
                        <input
                          type="checkbox"
                          checked={selectedStudentIds.includes(id)}
                          onChange={() => toggleStudent(id)}
                          aria-label={`Pilih siswa ${student.full_name}`}
                          className="size-4 cursor-pointer accent-primary"
                        />
                      </Table.Cell>
                      <Table.Cell>
                        <span className="font-semibold text-foreground">
                          {student.full_name}
                        </span>
                      </Table.Cell>
                      <Table.Cell className="text-muted">
                        {student.nisn ?? "-"}
                      </Table.Cell>
                    </Table.Row>
                  );
                })}

                {!studentList.items.length && (
                  <Table.Row>
                    <Table.Cell
                      colSpan={3}
                      className="py-8 text-center text-muted"
                    >
                      Tidak ada siswa ditemukan.
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table>
          )}
        </section>
      </div>
    </Modal>
  );
};

export default ExtracurricularMembersModal;
