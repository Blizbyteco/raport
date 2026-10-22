import { Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router";

import Button from "@/shared/ui/button/Button";
import Badge from "@/shared/ui/data-display/Badge";
import Table from "@/shared/ui/data-display/Table";
import Tooltip from "@/shared/ui/feedback/Tooltip";
import { formatDate } from "@/shared/lib/formatDate";

const AcademicYearTable = ({ data, isLoading, isError, onDelete }) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border bg-card p-6">
        <p className="text-sm text-muted text-center">
          Memuat data tahun ajaran...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-border bg-card p-6">
        <p className="text-sm text-danger">Gagal memuat data tahun ajaran.</p>
      </div>
    );
  }

  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.Head>No</Table.Head>
          <Table.Head>Tahun Ajaran</Table.Head>
          <Table.Head>Ganjil</Table.Head>
          <Table.Head>Genap</Table.Head>
          <Table.Head>Status</Table.Head>
          <Table.Head>Aksi</Table.Head>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {data.length === 0 ? (
          <Table.Row>
            <Table.Cell colSpan={6} className="text-center">
              Belum ada data tahun ajaran.
            </Table.Cell>
          </Table.Row>
        ) : (
          data.map((academicYear, index) => {
            const ganjil = academicYear.terms.find(
              (term) => term.name === "Ganjil",
            );

            const genap = academicYear.terms.find(
              (term) => term.name === "Genap",
            );

            return (
              <Table.Row key={academicYear.id}>
                <Table.Cell>{index + 1}</Table.Cell>
                <Table.Cell>
                  <span className="font-semibold text-foreground">
                    {academicYear.start_year}/{academicYear.end_year}
                  </span>
                </Table.Cell>
                <Table.Cell>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">
                      {formatDate(ganjil?.start_date)}
                    </p>

                    <p className="text-xs text-muted">
                      sampai {formatDate(ganjil?.end_date)}
                    </p>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">
                      {formatDate(genap?.start_date)}
                    </p>

                    <p className="text-xs text-muted">
                      sampai {formatDate(genap?.end_date)}
                    </p>
                  </div>
                </Table.Cell>

                {/* Status */}
                <Table.Cell>
                  <Badge variant={academicYear.is_active ? "success" : "muted"}>
                    {academicYear.is_active ? "Aktif" : "Tidak Aktif"}
                  </Badge>
                </Table.Cell>

                {/* Aksi */}
                <Table.Cell>
                  <div className="flex items-center gap-1">
                    <Tooltip label="Ubah data tahun akademik">
                      <Button
                        variant="ghost"
                        size="S"
                        icon={Pencil}
                        iconOnly
                        onClick={() => navigate(`${academicYear.id}/edit`)}
                        aria-label={`Ubah data tahun akademik ${academicYear.start_year}/${academicYear.end_year}`}
                      />
                    </Tooltip>

                    <Tooltip label="Hapus data tahun akademik">
                      <Button
                        variant="ghost"
                        size="S"
                        icon={Trash2}
                        iconOnly
                        onClick={() => onDelete?.(academicYear)}
                        aria-label={`Hapus data tahun akademik ${academicYear.start_year}/${academicYear.end_year}`}
                      />
                    </Tooltip>
                  </div>
                </Table.Cell>
              </Table.Row>
            );
          })
        )}
      </Table.Body>
    </Table>
  );
};

export default AcademicYearTable;
