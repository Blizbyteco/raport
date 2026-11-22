import { Pencil, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router";

import Button from "@/shared/ui/button/Button";
import Badge from "@/shared/ui/data-display/Badge";
import Table from "@/shared/ui/data-display/Table";
import Tooltip from "@/shared/ui/feedback/Tooltip";

const TeacherTable = ({ teachers, onDelete }) => {
  const navigate = useNavigate();

  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.Head>Guru</Table.Head>
          <Table.Head>NIP</Table.Head>
          <Table.Head>Username</Table.Head>
          <Table.Head>Status</Table.Head>
          <Table.Head>Aksi</Table.Head>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {teachers.map((teacher) => (
          <Table.Row key={teacher.id}>
            <Table.Cell>
              <Link
                to={String(teacher.id)}
                className="block max-w-56 truncate font-semibold text-text-body transition-colors hover:text-primary hover:underline"
              >
                {teacher.full_name}
              </Link>
            </Table.Cell>
            <Table.Cell>{teacher.nip}</Table.Cell>
            <Table.Cell>{teacher.username}</Table.Cell>
            <Table.Cell>
              <Badge variant={teacher.is_active ? "success" : "muted"}>
                {teacher.is_active ? "Aktif" : "Tidak aktif"}
              </Badge>
            </Table.Cell>
            <Table.Cell>
              <div className="flex items-center gap-2">
                <Tooltip label="Ubah data guru">
                  <Button
                    variant="ghost"
                    size="S"
                    icon={Pencil}
                    iconOnly
                    onClick={() => navigate(String(teacher.id))}
                    aria-label={`Ubah data ${teacher.full_name}`}
                  />
                </Tooltip>
                <Tooltip label="Hapus data guru">
                  <Button
                    variant="ghost"
                    size="S"
                    icon={Trash2}
                    iconOnly
                    onClick={() => onDelete?.(teacher)}
                    aria-label={`Hapus data ${teacher.full_name}`}
                  />
                </Tooltip>
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
                Coba ubah kata kunci pencarian.
              </p>
            </Table.Cell>
          </Table.Row>
        )}
      </Table.Body>
    </Table>
  );
};

export default TeacherTable;
