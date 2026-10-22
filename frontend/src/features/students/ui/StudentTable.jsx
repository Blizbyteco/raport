import { Eye, Pencil, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router";

import Button from "@/shared/ui/button/Button";
import Table from "@/shared/ui/data-display/Table";
import Tooltip from "@/shared/ui/feedback/Tooltip";
import slugify from "@/shared/lib/slugify";

const StudentTable = ({ students, onDelete }) => {
  const navigate = useNavigate();

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
        {students.map((student) => {
          const slug = slugify(student.name);

          return (
            <Table.Row key={student.nis}>
              <Table.Cell>
                <Link
                  to={slug}
                  className="block max-w-56 truncate font-semibold text-text-body transition-colors hover:text-primary hover:underline"
                >
                  {student.name}
                </Link>
              </Table.Cell>
              <Table.Cell>{student.nis}</Table.Cell>
              <Table.Cell>{student.className}</Table.Cell>
              <Table.Cell>{student.major}</Table.Cell>
              <Table.Cell>
                <div className="flex items-center gap-2">
                  <Tooltip label="Lihat detail siswa">
                    <Button
                      variant="ghost"
                      size="S"
                      icon={Eye}
                      iconOnly
                      onClick={() => navigate(slug)}
                      aria-label={`Lihat detail ${student.name}`}
                    />
                  </Tooltip>
                  <Tooltip label="Ubah data Siswa">
                    <Button
                      variant="ghost"
                      size="S"
                      icon={Pencil}
                      iconOnly
                      aria-label={`Ubah data ${student.name}`}
                    />
                  </Tooltip>
                  <Tooltip label="Hapus data siswa">
                    <Button
                      variant="ghost"
                      size="S"
                      icon={Trash2}
                      iconOnly
                      onClick={() => onDelete?.(student)}
                      aria-label={`Hapus data ${student.name}`}
                    />
                  </Tooltip>
                </div>
              </Table.Cell>
            </Table.Row>
          );
        })}

        {!students.length && (
          <Table.Row>
            <Table.Cell colSpan={5} className="py-14 text-center">
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
