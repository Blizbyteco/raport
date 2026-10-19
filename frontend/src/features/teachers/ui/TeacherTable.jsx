import Button from "@/shared/ui/button/Button";
import Table from "@/shared/ui/data-display/Table";
import { Pencil, Trash2 } from "lucide-react";

const TeacherTable = ({ teachers }) => {
  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.Head>Guru</Table.Head>
          <Table.Head>NIP</Table.Head>
          <Table.Head>Jenis kelamin</Table.Head>
          <Table.Head>No Telepon</Table.Head>
          <Table.Head>Aksi</Table.Head>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {teachers.map((teacher) => (
          <Table.Row key={teacher.nip}>
            <Table.Cell>
              <p className="truncate font-semibold text-text-body">
                {teacher.name}
              </p>
            </Table.Cell>
            <Table.Cell>{teacher.nip}</Table.Cell>
            <Table.Cell>{teacher.gender}</Table.Cell>
            <Table.Cell>{teacher.phone}</Table.Cell>
            <Table.Cell>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="S"
                  icon={Pencil}
                  iconOnly
                  title={`Edit ${teacher.name}`}
                  aria-label={`Edit ${teacher.name}`}
                />
                <Button
                  variant="ghost"
                  size="S"
                  icon={Trash2}
                  iconOnly
                  title={`Hapus ${teacher.name}`}
                  aria-label={`Hapus ${teacher.name}`}
                />
              </div>
            </Table.Cell>
          </Table.Row>
        ))}

        {!teachers.length && (
          <Table.Row>
            <Table.Cell colSpan={5} className="py-14 text-center">
              <p className="mt-3 font-semibold text-text-body">
                Guru tidak ditemukan
              </p>

              <p className="mt-1 text-sm text-text-muted">
                Coba ubah kata kunci atau filter mata pelajaran.
              </p>
            </Table.Cell>
          </Table.Row>
        )}
      </Table.Body>
    </Table>
  );
};

export default TeacherTable;
