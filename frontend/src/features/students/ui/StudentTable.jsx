import Button from "@/shared/ui/button/Button";
import Table from "@/shared/ui/data-display/Table";
import { Pencil, Trash2 } from "lucide-react";

const StudentTable = ({ students }) => {
  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.Head>Siswa</Table.Head>
          <Table.Head>NIS</Table.Head>
          <Table.Head>Kelas</Table.Head>
          <Table.Head>Jurusan</Table.Head>
          <Table.Head>Aksi</Table.Head>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {students.map((student) => (
          <Table.Row key={student.nis}>
            <Table.Cell>
              <p className="truncate font-semibold text-text-body">
                {student.name}
              </p>
            </Table.Cell>
            <Table.Cell>{student.nis}</Table.Cell>
            <Table.Cell>{student.className}</Table.Cell>
            <Table.Cell>{student.major}</Table.Cell>
            <Table.Cell>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="S"
                  icon={Pencil}
                  iconOnly
                  title={`Edit ${student.name}`}
                  aria-label={`Edit ${student.name}`}
                />
                <Button
                  variant="ghost"
                  size="S"
                  icon={Trash2}
                  iconOnly
                  title={`Hapus ${student.name}`}
                  aria-label={`Hapus ${student.name}`}
                />
              </div>
            </Table.Cell>
          </Table.Row>
        ))}

        {!students.length && (
          <Table.Row>
            <Table.Cell colSpan={4} className="py-14 text-center">
              <p className="mt-3 font-semibold text-text-body">
                Siswa tidak ditemukan
              </p>

              <p className="mt-1 text-sm text-text-muted">
                Coba ubah kata kunci atau filter kelas.
              </p>
            </Table.Cell>
          </Table.Row>
        )}
      </Table.Body>
    </Table>
  );
};

export default StudentTable;
