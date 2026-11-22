import { useState } from "react";
import { useNavigate } from "react-router";
import { Download, Plus, Search, Trash2 } from "lucide-react";

import Button from "@/shared/ui/button/Button";
import Input from "@/shared/ui/form/Input";
import Modal from "@/shared/ui/overlay/Modal";

import StudentTable from "../ui/StudentTable";
import PageHeader from "@/shared/layout/PageHeader";
import useStudents from "../hooks/useStudents";
import useDeleteStudent from "../hooks/useDeleteStudent";
import { downloadCsv } from "@/shared/lib/csv";

const CSV_HEADERS = ["nisn", "full_name", "gender", "parent_name"];

const StudentsPage = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [studentToDelete, setStudentToDelete] = useState(null);

  const { data, isLoading, isError } = useStudents(search);
  const deleteMutation = useDeleteStudent();

  const students = data?.data ?? [];

  const handleDelete = () => {
    if (!studentToDelete) return;

    deleteMutation.mutate(studentToDelete.id, {
      onSuccess: () => setStudentToDelete(null),
    });
  };

  const handleExport = () => {
    downloadCsv("siswa.csv", [
      CSV_HEADERS,
      ...students.map((student) =>
        CSV_HEADERS.map((key) => student[key] ?? ""),
      ),
    ]);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <PageHeader
          title="Data Siswa"
          description="Kelola dan lihat data siswa yang terdaftar."
        />
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" icon={Download} onClick={handleExport}>
            Ekspor data
          </Button>
          <Button
            onClick={() => navigate("create")}
            variant="primary"
            icon={Plus}
          >
            Tambah siswa
          </Button>
        </div>
      </header>

      <section className="space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="w-full sm:max-w-sm">
            <Input
              icon={Search}
              placeholder="Cari nama atau NISN..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <p className="text-sm font-medium text-muted">
            {students.length} siswa
          </p>
        </div>

        {isLoading ? (
          <div className="rounded-xl border border-border bg-card px-6 py-14 text-center">
            <p className="text-sm text-muted">Memuat data siswa...</p>
          </div>
        ) : isError ? (
          <div className="rounded-xl border border-border bg-card px-6 py-14 text-center">
            <p className="text-sm text-danger">Gagal memuat data siswa.</p>
          </div>
        ) : (
          <StudentTable
            students={students}
            onDelete={setStudentToDelete}
          />
        )}
      </section>

      <Modal
        open={Boolean(studentToDelete)}
        onClose={() => setStudentToDelete(null)}
        title="Hapus data siswa"
        description={
          studentToDelete
            ? `Data ${studentToDelete.full_name} akan dihapus dari daftar siswa.`
            : undefined
        }
        size="S"
        footer={
          <>
            <Button variant="outline" onClick={() => setStudentToDelete(null)}>
              Batal
            </Button>
            <Button
              variant="danger"
              icon={Trash2}
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              Hapus
            </Button>
          </>
        }
      >
        <p className="text-sm text-muted">
          Tindakan ini tidak dapat dibatalkan.
        </p>
      </Modal>
    </div>
  );
};

export default StudentsPage;
