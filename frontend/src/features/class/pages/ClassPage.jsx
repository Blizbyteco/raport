import { useState } from "react";
import { Plus, Search } from "lucide-react";

import Button from "@/shared/ui/button/Button";
import Input from "@/shared/ui/form/Input";
import Modal from "@/shared/ui/overlay/Modal";
import PageHeader from "@/shared/layout/PageHeader";

import ClassCard from "../ui/ClassCard";
import useClasses from "../hooks/useClasses";
import useCreateClass from "../hooks/useCreateClass";
import useUpdateClass from "../hooks/useUpdateClass";
import useDeleteClass from "../hooks/useDeleteClass";

const ClassPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [className, setClassName] = useState("");
  const [search, setSearch] = useState("");

  const { data, isLoading, isError } = useClasses(search);

  const createMutation = useCreateClass();
  const updateMutation = useUpdateClass();
  const deleteMutation = useDeleteClass();

  const classes = data?.data ?? [];

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const openCreateModal = () => {
    setEditingClass(null);
    setClassName("");
    setIsModalOpen(true);
  };

  const openEditModal = (classItem) => {
    setEditingClass(classItem);
    setClassName(classItem.name);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingClass(null);
    setClassName("");
    createMutation.reset();
    updateMutation.reset();
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const name = className.trim();

    if (!name) {
      return;
    }

    if (editingClass) {
      updateMutation.mutate(
        {
          id: editingClass.id,
          name,
        },
        {
          onSuccess: closeModal,
        },
      );

      return;
    }

    createMutation.mutate(
      {
        name,
      },
      {
        onSuccess: closeModal,
      },
    );
  };

  const handleDelete = (classItem) => {
    const confirmed = window.confirm(`Hapus kelas "${classItem.name}"?`);

    if (!confirmed) {
      return;
    }

    deleteMutation.mutate(classItem.id);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <PageHeader
          title="Data Kelas"
          description="Kelola daftar kelas dan jumlah siswa."
        />

        <Button icon={Plus} onClick={openCreateModal}>
          Tambah kelas
        </Button>
      </header>

      <div className="flex items-center gap-3 whitespace-nowrap sm:justify-between">
        <div className="w-full sm:max-w-sm">
          <Input
            icon={Search}
            placeholder="Cari kelas..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <p className="text-sm font-medium text-muted">{classes.length} kelas</p>
      </div>

      {isLoading ? (
        <div className="rounded-xl border border-border bg-card px-6 py-14 text-center">
          <p className="text-sm text-muted">Memuat data kelas...</p>
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-border bg-card px-6 py-14 text-center">
          <p className="text-sm text-destructive">Gagal memuat data kelas.</p>
        </div>
      ) : data.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {data.map((classItem) => (
            <ClassCard
              key={classItem.id}
              item={classItem}
              onEdit={() => openEditModal(classItem)}
              onDelete={() => handleDelete(classItem)}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card px-6 py-14 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-background text-muted">
            <Search className="size-5" />
          </div>

          <h2 className="mt-4 font-bold text-card-foreground">
            Kelas tidak ditemukan
          </h2>

          <p className="mt-1 text-sm text-muted">
            Coba gunakan kata kunci pencarian yang berbeda.
          </p>
        </div>
      )}

      <Modal
        open={isModalOpen}
        onClose={closeModal}
        title={editingClass ? "Edit Kelas" : "Tambah Kelas"}
        description={
          editingClass ? "Ubah nama kelas." : "Tambahkan kelas baru."
        }
        footer={
          <>
            <Button
              variant="outline"
              onClick={closeModal}
              disabled={isSubmitting}
            >
              Batal
            </Button>

            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !className.trim()}
            >
              {isSubmitting
                ? "Menyimpan..."
                : editingClass
                  ? "Simpan perubahan"
                  : "Tambah kelas"}
            </Button>
          </>
        }
      >
        <Input
          label="Nama kelas"
          id="className"
          name="className"
          placeholder="Contoh: X IPA 1"
          value={className}
          onChange={(event) => setClassName(event.target.value)}
          required
        />

        {(createMutation.isError || updateMutation.isError) && (
          <p className="mt-2 text-sm text-destructive">
            {createMutation.error?.response?.data?.message ||
              updateMutation.error?.response?.data?.message ||
              "Gagal menyimpan kelas."}
          </p>
        )}
      </Modal>
    </div>
  );
};

export default ClassPage;
