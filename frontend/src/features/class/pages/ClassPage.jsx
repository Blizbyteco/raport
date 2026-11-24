import { useState } from "react";
import { Plus, Search } from "lucide-react";

import Button from "@/shared/ui/button/Button";
import Input from "@/shared/ui/form/Input";
import Modal from "@/shared/ui/overlay/Modal";
import PageHeader from "@/shared/layout/PageHeader";

import ClassCard from "../ui/ClassCard";
import usePermissions from "@/features/auth/hooks/usePermissions";
import useClass from "../hooks/useClass";
import useClasses from "../hooks/useClasses";
import useCreateClass from "../hooks/useCreateClass";
import useUpdateClass from "../hooks/useUpdateClass";
import useDeleteClass from "../hooks/useDeleteClass";

const romanGradeLevels = {
  X: 10,
  XI: 11,
  XII: 12,
};

const parseGradeLevel = (value) => {
  const normalized = String(value ?? "").trim().toUpperCase();

  const romanGradeLevel = romanGradeLevels[normalized];

  if (typeof romanGradeLevel === "number") {
    return romanGradeLevel;
  }

  if (!/^\d+$/.test(normalized)) {
    return null;
  }

  const level = Number(normalized);

  return level >= 7 && level <= 12 ? level : null;
};

const ClassPage = () => {
  const { canManage } = usePermissions();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [formOverrides, setFormOverrides] = useState(null);
  const [search, setSearch] = useState("");

  const { data, isLoading, isError } = useClasses(search);
  const { data: classDetail } = useClass(editingClass?.id);

  const createMutation = useCreateClass();
  const updateMutation = useUpdateClass();
  const deleteMutation = useDeleteClass();

  const classes = data ?? [];
  const canonicalClass = classDetail?.data ?? classDetail;
  const editSource = canonicalClass ?? editingClass;
  const className = formOverrides?.name ?? editSource?.name ?? "";
  const gradeLevel = String(
    formOverrides?.grade_level ?? editSource?.grade_level ?? "",
  );

  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const gradeLevelInput = String(gradeLevel ?? "").trim();
  const parsedGradeLevel = parseGradeLevel(gradeLevelInput);
  const gradeLevelError =
    gradeLevelInput !== "" && parsedGradeLevel === null
      ? "Tingkat harus 7-12 atau X, XI, XII."
      : undefined;
  const isSubmitDisabled =
    isSubmitting || !className.trim() || parsedGradeLevel === null;

  const openCreateModal = () => {
    setEditingClass(null);
    setFormOverrides(null);
    setIsModalOpen(true);
  };

  const openEditModal = (classItem) => {
    setEditingClass(classItem);
    setFormOverrides(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingClass(null);
    setFormOverrides(null);
    createMutation.reset();
    updateMutation.reset();
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const name = className.trim();

    if (!name || parsedGradeLevel === null) {
      return;
    }

    if (editingClass) {
      updateMutation.mutate(
        {
          id: editingClass.id,
          name,
          grade_level: parsedGradeLevel,
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
        grade_level: parsedGradeLevel,
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

        {canManage && (
          <Button icon={Plus} onClick={openCreateModal}>
            Tambah kelas
          </Button>
        )}
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
          <p className="text-sm text-danger">Gagal memuat data kelas.</p>
        </div>
      ) : classes.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {classes.map((classItem) => (
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
              disabled={isSubmitDisabled}
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
        <div className="space-y-4">
          <Input
            label="Nama kelas"
            id="className"
            name="className"
            placeholder="Contoh: X IPA 1"
            value={className}
            onChange={(event) =>
              setFormOverrides((current) => ({
                ...(current ?? {}),
                name: event.target.value,
              }))
            }
            required
          />

          <Input
            label="Tingkat"
            id="gradeLevel"
            name="gradeLevel"
            placeholder="Contoh: X, XI, XII, 7, 8"
            value={gradeLevel}
            onChange={(event) =>
              setFormOverrides((current) => ({
                ...(current ?? {}),
                grade_level: event.target.value,
              }))
            }
            error={gradeLevelError}
            required
          />
        </div>

        {(createMutation.isError || updateMutation.isError) && (
          <p className="mt-2 text-sm text-danger">
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
