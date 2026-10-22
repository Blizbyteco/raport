import { Eye, Pencil, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router";

import Button from "@/shared/ui/button/Button";
import Table from "@/shared/ui/data-display/Table";
import Tooltip from "@/shared/ui/feedback/Tooltip";
import slugify from "@/shared/lib/slugify";

const TeacherTable = ({ teachers, onDelete }) => {
  const navigate = useNavigate();

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
        {teachers.map((teacher) => {
          const slug = slugify(teacher.name);

          return (
            <Table.Row key={teacher.nip}>
              <Table.Cell>
                <Link
                  to={slug}
                  className="block max-w-56 truncate font-semibold text-text-body transition-colors hover:text-primary hover:underline"
                >
                  {teacher.name}
                </Link>
              </Table.Cell>
              <Table.Cell>{teacher.nip}</Table.Cell>
              <Table.Cell>{teacher.gender}</Table.Cell>
              <Table.Cell>{teacher.phone}</Table.Cell>
              <Table.Cell>
                <div className="flex items-center gap-2">
                  <Tooltip label="Lihat detail guru">
                    <Button
                      variant="ghost"
                      size="S"
                      icon={Eye}
                      iconOnly
                      onClick={() => navigate(slug)}
                      aria-label={`Lihat detail ${teacher.name}`}
                    />
                  </Tooltip>
                  <Tooltip label="Ubah data Guru">
                    <Button
                      variant="ghost"
                      size="S"
                      icon={Pencil}
                      iconOnly
                      aria-label={`Ubah data ${teacher.name}`}
                    />
                  </Tooltip>
                  <Tooltip label="Hapus data guru">
                    <Button
                      variant="ghost"
                      size="S"
                      icon={Trash2}
                      iconOnly
                      onClick={() => onDelete?.(teacher)}
                      aria-label={`Hapus data ${teacher.name}`}
                    />
                  </Tooltip>
                </div>
              </Table.Cell>
            </Table.Row>
          );
        })}

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
