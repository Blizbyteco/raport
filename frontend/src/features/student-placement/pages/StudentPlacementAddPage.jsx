import { useMemo, useState } from "react";
import { ArrowLeft, Search, UserPlus, Users } from "lucide-react";
import { useNavigate, useParams } from "react-router";

import Button from "@/shared/ui/button/Button";
import Input from "@/shared/ui/form/Input";
import Table from "@/shared/ui/data-display/Table";
import useClasses from "@/features/class/hooks/useClasses";
import useActiveAcademicYear from "@/features/academic-year/hooks/useActiveAcademicYear";
import useStudents from "@/features/students/hooks/useStudents";
import useClassStudents from "../hooks/useClassStudents";
import { useAddStudentsToClass } from "../hooks/useStudentPlacementMutations";

const genderLabel = (gender) =>
  gender === "L" ? "Laki-laki" : gender === "P" ? "Perempuan" : "-";

const StudentPlacementAddPage = () => {
  const navigate = useNavigate();
  const { classId } = useParams();

  const [search, setSearch] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);

  const { data: classes } = useClasses();
  const { data: academicYear } = useActiveAcademicYear();
  const academicYearId = academicYear?.id;

  const { data: studentsData, isLoading, isError } = useStudents(search);
  const { data: currentPlacements } = useClassStudents(
    classId,
    academicYearId,
  );
  const addMutation = useAddStudentsToClass();

  const classItem = (classes ?? []).find(
    (item) => String(item.id) === String(classId),
  );
  const className = classItem?.name ?? "Kelas";

  const placedIds = new Set(
    (currentPlacements ?? []).map((placement) => placement.student_id),
  );

  const availableStudents = useMemo(() => {
    const students = studentsData?.data ?? [];

    return students.filter((student) => !placedIds.has(student.id));
  }, [studentsData, placedIds]);

  const allVisibleSelected =
    availableStudents.length > 0 &&
    availableStudents.every((student) => selectedStudents.includes(student.id));

  const toggleStudent = (studentId) => {
    setSelectedStudents((current) =>
      current.includes(studentId)
        ? current.filter((id) => id !== studentId)
        : [...current, studentId],
    );
  };

  const toggleAll = () => {
    if (allVisibleSelected) {
      setSelectedStudents((current) =>
        current.filter(
          (id) => !availableStudents.some((student) => student.id === id),
        ),
      );
      return;
    }

    setSelectedStudents((current) => [
      ...new Set([...current, ...availableStudents.map((student) => student.id)]),
    ]);
  };

  const handleSubmit = () => {
    if (!selectedStudents.length || !academicYearId) return;

    addMutation.mutate(
      {
        classId,
        data: {
          academic_year_id: academicYearId,
          student_ids: selectedStudents,
        },
      },
      {
        onSuccess: () =>
          navigate(`/dashboard/student-placement/${classId}`),
      },
    );
  };

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        size="S"
        icon={ArrowLeft}
        onClick={() => navigate(`/dashboard/student-placement/${classId}`)}
        className="-ml-2"
      >
        Kembali
      </Button>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Users className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              {className}
            </h1>
            <p className="mt-1 text-sm text-muted">
              Pilih siswa yang belum ditempatkan di kelas ini.
            </p>
          </div>
        </div>

        <Button
          icon={UserPlus}
          onClick={handleSubmit}
          disabled={selectedStudents.length === 0 || !academicYearId}
          isLoading={addMutation.isPending}
        >
          Tambahkan{" "}
          {selectedStudents.length > 0
            ? `${selectedStudents.length} siswa`
            : "siswa"}
        </Button>
      </div>

      <div className="w-full sm:max-w-sm">
        <Input
          icon={Search}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Cari nama atau NISN..."
        />
      </div>

      {isLoading ? (
        <p className="text-sm text-muted">Memuat data siswa...</p>
      ) : isError ? (
        <p className="text-sm text-danger">Gagal memuat data siswa.</p>
      ) : (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.Head className="w-12">
                <input
                  type="checkbox"
                  checked={allVisibleSelected}
                  onChange={toggleAll}
                  aria-label="Pilih semua siswa"
                  className="size-4 cursor-pointer accent-primary"
                />
              </Table.Head>
              <Table.Head>Siswa</Table.Head>
              <Table.Head>NISN</Table.Head>
              <Table.Head>Jenis kelamin</Table.Head>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {availableStudents.map((student) => (
              <Table.Row key={student.id}>
                <Table.Cell>
                  <input
                    type="checkbox"
                    checked={selectedStudents.includes(student.id)}
                    onChange={() => toggleStudent(student.id)}
                    aria-label={`Pilih ${student.full_name}`}
                    className="size-4 cursor-pointer accent-primary"
                  />
                </Table.Cell>
                <Table.Cell>
                  <span className="font-semibold">{student.full_name}</span>
                </Table.Cell>
                <Table.Cell>{student.nisn}</Table.Cell>
                <Table.Cell>{genderLabel(student.gender)}</Table.Cell>
              </Table.Row>
            ))}

            {!availableStudents.length && (
              <Table.Row>
                <Table.Cell colSpan={4} className="py-14 text-center">
                  <p className="font-semibold text-foreground">
                    Tidak ada siswa
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    Coba kata kunci lain atau tambahkan siswa baru.
                  </p>
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      )}
    </div>
  );
};

export default StudentPlacementAddPage;
