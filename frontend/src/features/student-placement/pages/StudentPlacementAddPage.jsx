import { useMemo, useState } from "react";
import { ArrowLeft, Search, UserPlus, Users } from "lucide-react";
import { useNavigate, useParams } from "react-router";

import Button from "@/shared/ui/button/Button";
import Input from "@/shared/ui/form/Input";
import Table from "@/shared/ui/data-display/Table";
import { students } from "@/shared/data/students.json";

const classData = {
  1: "X IPA 1",
  2: "X IPA 2",
  3: "XI IPA 1",
  4: "XI IPS 1",
  5: "XII IPA 1",
  6: "XII IPS 1",
};

const unassignedStudents = students;

const StudentPlacementAddPage = () => {
  const navigate = useNavigate();
  const { classId } = useParams();

  const [search, setSearch] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);

  const className = classData[classId] ?? "Kelas";

  const filteredStudents = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    if (!keyword) return unassignedStudents;

    return unassignedStudents.filter(
      (student) =>
        student.name.toLowerCase().includes(keyword) ||
        student.nis.toLowerCase().includes(keyword),
    );
  }, [search]);

  const toggleStudent = (studentId) => {
    setSelectedStudents((current) =>
      current.includes(studentId)
        ? current.filter((id) => id !== studentId)
        : [...current, studentId],
    );
  };

  const toggleAll = () => {
    const visibleIds = filteredStudents.map((student) => student.id);

    const allSelected =
      visibleIds.length > 0 &&
      visibleIds.every((id) => selectedStudents.includes(id));

    if (allSelected) {
      setSelectedStudents((current) =>
        current.filter((id) => !visibleIds.includes(id)),
      );
    } else {
      setSelectedStudents((current) => [
        ...new Set([...current, ...visibleIds]),
      ]);
    }
  };

  const allVisibleSelected =
    filteredStudents.length > 0 &&
    filteredStudents.every((student) => selectedStudents.includes(student.id));

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
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              {className}
            </h1>
            <p className="mt-2 text-sm text-muted">
              Pilih siswa yang belum memiliki kelas.
            </p>
          </div>
        </div>

        <Button icon={UserPlus} disabled={selectedStudents.length === 0}>
          Tambahkan{" "}
          {selectedStudents.length > 0
            ? `${selectedStudents.length} siswa`
            : "siswa"}
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:max-w-sm">
          <Input
            icon={Search}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Cari nama atau NIS..."
          />
        </div>

        {selectedStudents.length > 0 && (
          <p className="text-sm font-semibold text-primary">
            {selectedStudents.length} siswa dipilih
          </p>
        )}
      </div>

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
            <Table.Head>NIS</Table.Head>
            <Table.Head>Jenis Kelamin</Table.Head>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {filteredStudents.map((student) => (
            <Table.Row key={student.id}>
              <Table.Cell>
                <input
                  type="checkbox"
                  checked={selectedStudents.includes(student.id)}
                  onChange={() => toggleStudent(student.id)}
                  aria-label={`Pilih ${student.name}`}
                  className="size-4 cursor-pointer accent-primary"
                />
              </Table.Cell>

              <Table.Cell>
                <span className="font-semibold">{student.name}</span>
              </Table.Cell>

              <Table.Cell>{student.nis}</Table.Cell>

              <Table.Cell>{student.gender}</Table.Cell>
            </Table.Row>
          ))}

          {!filteredStudents.length && (
            <Table.Row>
              <Table.Cell colSpan={4} className="py-14 text-center">
                <p className="font-semibold text-foreground">Tidak ada siswa</p>

                <p className="mt-1 text-sm text-muted">
                  Tidak ada siswa yang belum memiliki kelas.
                </p>
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </div>
  );
};

export default StudentPlacementAddPage;
