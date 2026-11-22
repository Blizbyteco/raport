import { useState } from "react";
import { Download, Plus, Search, Trash2 } from "lucide-react";
import { useNavigate } from "react-router";

import Button from "@/shared/ui/button/Button";
import Input from "@/shared/ui/form/Input";
import Modal from "@/shared/ui/overlay/Modal";
import PageHeader from "@/shared/layout/PageHeader";

import TeacherTable from "../ui/TeacherTable";
import useTeachers from "../hooks/useTeachers";
import useDeleteTeacher from "../hooks/useDeleteTeacher";

const TeachersPage = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [teacherToDelete, setTeacherToDelete] = useState(null);

  const { data, isLoading, isError } = useTeachers(search);
  const deleteMutation = useDeleteTeacher();

  const teachers = data?.data ?? [];

  const handleDelete = () => {
    if (!teacherToDelete) return;

    deleteMutation.mutate(teacherToDelete.id, {
      onSuccess: () => setTeacherToDelete(null),
    });
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <PageHeader
          title="Data Guru"
          description="Kelola dan lihat data guru yang terdaftar."
        />

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" icon={Download}>
            Ekspor data
          </Button>
          <Button
            onClick={() => navigate("create")}
            variant="primary"
            icon={Plus}
          >
            Tambah guru
          </Button>
        </div>
      </header>

      <section className="space-y-4" aria-labelledby="teacher-list-title">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="w-full sm:max-w-sm">
            <Input
              icon={Search}
              placeholder="Cari nama, NIP, atau username..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <p className="text-sm font-medium text-muted">
            {teachers.length} guru
          </p>
        </div>

        {isLoading ? (
          <div className="rounded-xl border border-border bg-card px-6 py-14 text-center">
            <p className="text-sm text-muted">Memuat data guru...</p>
          </div>
        ) : isError ? (
          <div className="rounded-xl border border-border bg-card px-6 py-14 text-center">
            <p className="text-sm text-danger">Gagal memuat data guru.</p>
          </div>
        ) : (
          <TeacherTable
            teachers={teachers}
            onDelete={setTeacherToDelete}
          />
        )}
      </section>

      <Modal
        open={Boolean(teacherToDelete)}
        onClose={() => setTeacherToDelete(null)}
        title="Hapus data guru"
        description={
          teacherToDelete
            ? `Data ${teacherToDelete.full_name} akan dihapus dari daftar guru.`
            : undefined
        }
        size="S"
        footer={
          <>
            <Button variant="outline" onClick={() => setTeacherToDelete(null)}>
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

export default TeachersPage;
