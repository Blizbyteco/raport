import { Pencil, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router";

import Button from "@/shared/ui/button/Button";
import Table from "@/shared/ui/data-display/Table";
import Tooltip from "@/shared/ui/feedback/Tooltip";
import usePermissions from "@/features/auth/hooks/usePermissions";

const genderLabel = (gender) =>
  gender === "L" ? "Laki-laki" : gender === "P" ? "Perempuan" : "-";

const StudentTable = ({ students, onDelete }) => {
  const navigate = useNavigate();
  const { canManage } = usePermissions();

  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.Head>Siswa</Table.Head>
          <Table.Head>NISN</Table.Head>
          <Table.Head>Jenis kelamin</Table.Head>
          <Table.Head>Wali</Table.Head>
          {canManage && <Table.Head>Aksi</Table.Head>}
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {students.map((student) => (
          <Table.Row key={student.id}>
            <Table.Cell>
              <Link
                to={String(student.id)}
                className="block max-w-56 truncate font-semibold text-text-body transition-colors hover:text-primary hover:underline"
              >
                {student.full_name}
              </Link>
            </Table.Cell>
            <Table.Cell>{student.nisn}</Table.Cell>
            <Table.Cell>{genderLabel(student.gender)}</Table.Cell>
            <Table.Cell>{student.parent_name || "-"}</Table.Cell>
            {canManage && (
              <Table.Cell>
                <div className="flex items-center gap-2">
                  <Tooltip label="Ubah data siswa">
                    <Button
                      variant="ghost"
                      size="S"
                      icon={Pencil}
                      iconOnly
                      onClick={() => navigate(String(student.id))}
                      aria-label={`Ubah data ${student.full_name}`}
                    />
                  </Tooltip>
                  <Tooltip label="Hapus data siswa">
                    <Button
                      variant="ghost"
                      size="S"
                      icon={Trash2}
                      iconOnly
                      onClick={() => onDelete?.(student)}
                      aria-label={`Hapus data ${student.full_name}`}
                    />
                  </Tooltip>
                </div>
              </Table.Cell>
            )}
          </Table.Row>
        ))}

        {!students.length && (
          <Table.Row>
            <Table.Cell
              colSpan={canManage ? 5 : 4}
              className="py-14 text-center"
            >
              <p className="mt-3 font-semibold text-text-body">
                Siswa tidak ditemukan
              </p>

              <p className="mt-1 text-sm text-text-muted">
                Coba ubah kata kunci pencarian.
              </p>
            </Table.Cell>
          </Table.Row>
        )}
      </Table.Body>
    </Table>
  );
};

export default StudentTable;
