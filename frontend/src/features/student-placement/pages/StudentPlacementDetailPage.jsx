import { useMemo, useState } from "react";
import { ArrowLeft, Search, Trash2, UserPlus, Users } from "lucide-react";
import { useNavigate, useParams } from "react-router";

import Button from "@/shared/ui/button/Button";
import Input from "@/shared/ui/form/Input";
import Modal from "@/shared/ui/overlay/Modal";
import Table from "@/shared/ui/data-display/Table";
import Tooltip from "@/shared/ui/feedback/Tooltip";
import useClasses from "@/features/class/hooks/useClasses";
import useActiveAcademicYear from "@/features/academic-year/hooks/useActiveAcademicYear";
import useClassStudents from "../hooks/useClassStudents";
import { useRemoveStudentFromClass } from "../hooks/useStudentPlacementMutations";

const genderLabel = (gender) =>
  gender === "L" ? "Laki-laki" : gender === "P" ? "Perempuan" : "-";

const StudentPlacementDetailPage = () => {
  const navigate = useNavigate();
  const { classId } = useParams();

  const [search, setSearch] = useState("");
  const [studentToRemove, setStudentToRemove] = useState(null);

  const { data: classes } = useClasses();
  const { data: academicYear } = useActiveAcademicYear();
  const academicYearId = academicYear?.id;

  const { data, isLoading, isError } = useClassStudents(
    classId,
    academicYearId,
  );
  const removeMutation = useRemoveStudentFromClass();

  const classItem = (classes ?? []).find(
    (item) => String(item.id) === String(classId),
  );
  const className = classItem?.name ?? "Kelas";

  const placements = data ?? [];
  const students = useMemo(
    () =>
      placements
        .map((placement) => placement.student)
        .filter(Boolean)
        .filter((student) => {
          const keyword = search.toLowerCase().trim();

          return (
            !keyword ||
            student.full_name?.toLowerCase().includes(keyword) ||
            student.nisn?.toLowerCase().includes(keyword)
          );
        }),
    [placements, search],
  );

  const handleRemove = () => {
    if (!studentToRemove) return;

    removeMutation.mutate(
      {
        classId,
        studentId: studentToRemove.id,
        academicYearId,
      },
      {
        onSuccess: () => setStudentToRemove(null),
      },
    );
  };

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        size="S"
        icon={ArrowLeft}
        onClick={() => navigate("/dashboard/student-placement")}
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
              {placements.length} siswa dalam kelas
            </p>
          </div>
        </div>

        <Button
          icon={UserPlus}
          onClick={() =>
            navigate(`/dashboard/student-placement/${classId}/add`)
          }
        >
          Tambah siswa
        </Button>
      </div>

      <div className="w-full sm:max-w-xs">
        <Input
          icon={Search}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Cari nama atau NISN..."
        />
      </div>

      {isLoading ? (
        <p className="text-sm text-muted">Memuat siswa kelas...</p>
      ) : isError ? (
        <p className="text-sm text-danger">Gagal memuat siswa kelas.</p>
      ) : (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.Head>Siswa</Table.Head>
              <Table.Head>NISN</Table.Head>
              <Table.Head>Jenis kelamin</Table.Head>
              <Table.Head>Aksi</Table.Head>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {students.map((student) => (
              <Table.Row key={student.id}>
                <Table.Cell>
                  <span className="font-semibold">{student.full_name}</span>
                </Table.Cell>
                <Table.Cell>{student.nisn}</Table.Cell>
                <Table.Cell>{genderLabel(student.gender)}</Table.Cell>
                <Table.Cell>
                  <Tooltip label="Keluarkan siswa dari kelas">
                    <Button
                      variant="ghost"
                      size="S"
                      icon={Trash2}
                      iconOnly
                      onClick={() => setStudentToRemove(student)}
                      aria-label={`Keluarkan ${student.full_name}`}
                      className="hover:text-danger"
                    />
                  </Tooltip>
                </Table.Cell>
              </Table.Row>
            ))}

            {!students.length && (
              <Table.Row>
                <Table.Cell colSpan={4} className="py-14 text-center">
                  <p className="font-semibold text-foreground">
                    Siswa tidak ditemukan
                  </p>

                  <p className="mt-1 text-sm text-muted">
                    Coba gunakan nama atau NISN yang berbeda.
                  </p>
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      )}

      <Modal
        open={Boolean(studentToRemove)}
        onClose={() => setStudentToRemove(null)}
        title="Keluarkan siswa dari kelas"
        description={
          studentToRemove
            ? `${studentToRemove.full_name} akan dikeluarkan dari ${className}.`
            : undefined
        }
        size="S"
        footer={
          <>
            <Button variant="outline" onClick={() => setStudentToRemove(null)}>
              Batal
            </Button>
            <Button
              variant="danger"
              icon={Trash2}
              onClick={handleRemove}
              isLoading={removeMutation.isPending}
            >
              Keluarkan
            </Button>
          </>
        }
      >
        <p className="text-sm text-muted">
          Siswa dapat ditempatkan kembali di kelas lain.
        </p>
      </Modal>
    </div>
  );
};

export default StudentPlacementDetailPage;
