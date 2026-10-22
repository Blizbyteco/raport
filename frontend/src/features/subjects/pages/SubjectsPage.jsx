import { useEffect, useState } from "react";

import { Plus, Search } from "lucide-react";

import { useForm } from "react-hook-form";

import Button from "@/shared/ui/button/Button";
import Input from "@/shared/ui/form/Input";
import Modal from "@/shared/ui/overlay/Modal";
import PageHeader from "@/shared/layout/PageHeader";

import SubjectCard from "../ui/SubjectCard";

import useSubjects from "../hooks/useSubjects";
import useCreateSubject from "../hooks/useCreateSubject";
import useUpdateSubject from "../hooks/useUpdateSubject";
import useDeleteSubject from "../hooks/useDeleteSubject";
import setFormErrors from "@/shared/lib/setFormErrors";

const SubjectsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [search, setSearch] = useState("");

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
    },
  });

  const { data, isLoading, isError } = useSubjects(search);

  const createMutation = useCreateSubject();
  const updateMutation = useUpdateSubject();
  const deleteMutation = useDeleteSubject();

  const subjects = data ?? [];

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (editingSubject) {
      reset({
        name: editingSubject.name,
      });
    } else {
      reset({
        name: "",
      });
    }
  }, [editingSubject, reset]);

  const openCreateModal = () => {
    setEditingSubject(null);
    reset({
      name: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (subject) => {
    setEditingSubject(subject);
    reset({
      name: subject.name,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSubject(null);
    reset({
      name: "",
    });

    createMutation.reset();
    updateMutation.reset();
  };

  const onSubmit = (data) => {
    if (editingSubject) {
      updateMutation.mutate(
        {
          id: editingSubject.id,
          name: data.name.trim(),
        },
        {
          onSuccess: closeModal,
        },
      );

      return;
    }

    createMutation.mutate(
      {
        name: data.name.trim(),
      },
      {
        onSuccess: closeModal,
        onError: (error) => {
          setFormErrors(error, setError);
        },
      },
    );
  };

  const handleDelete = (subject) => {
    const confirmed = window.confirm(`Hapus mata pelajaran "${subject.name}"?`);

    if (!confirmed) {
      return;
    }

    deleteMutation.mutate(subject.id);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <PageHeader
          title="Mata Pelajaran"
          description="Kelola daftar mata pelajaran yang tersedia."
        />

        <Button icon={Plus} onClick={openCreateModal}>
          Tambah mapel
        </Button>
      </header>

      <section className="flex items-center gap-3 whitespace-nowrap sm:justify-between">
        <div className="w-full sm:max-w-sm">
          <Input
            icon={Search}
            placeholder="Cari mata pelajaran..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <p className="text-sm font-medium text-muted">
          {subjects.length} mata pelajaran
        </p>
      </section>

      {isLoading ? (
        <div className="rounded-xl border border-border bg-card px-6 py-14 text-center">
          <p className="text-sm text-muted">Memuat data mata pelajaran...</p>
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-border bg-card px-6 py-14 text-center">
          <p className="text-sm text-destructive">
            Gagal memuat data mata pelajaran.
          </p>
        </div>
      ) : subjects.length > 0 ? (
        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject) => (
            <div key={subject.id} className="relative">
              <SubjectCard
                subject={subject}
                onEdit={() => openEditModal(subject)}
                onDelete={() => handleDelete(subject)}
              />

              {/* <div className="absolute right-3 top-3 flex gap-1">
                <Button
                  variant="ghost"
                  size="S"
                  icon={Pencil}
                  onClick={() => openEditModal(subject)}
                />

                <Button
                  variant="ghost"
                  size="S"
                  icon={Trash2}
                  onClick={() => handleDelete(subject)}
                  disabled={deleteMutation.isPending}
                />
              </div> */}
            </div>
          ))}
        </section>
      ) : (
        <div className="rounded-xl border border-border bg-card px-6 py-14 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-background text-muted">
            <Search className="size-5" />
          </div>

          <h2 className="mt-4 font-bold text-card-foreground">
            Mata pelajaran tidak ditemukan
          </h2>

          <p className="mt-1 text-sm text-muted">
            Coba gunakan kata kunci pencarian yang berbeda.
          </p>
        </div>
      )}

      <Modal
        open={isModalOpen}
        onClose={closeModal}
        title={editingSubject ? "Edit Mata Pelajaran" : "Tambah Mata Pelajaran"}
        description={
          editingSubject
            ? "Ubah nama mata pelajaran."
            : "Tambahkan mata pelajaran baru."
        }
        size="M"
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
              type="submit"
              form="subject-form"
              disabled={isSubmitting}
              isLoading={isSubmitting}
            >
              {editingSubject ? "Simpan perubahan" : "Tambah mata pelajaran"}
            </Button>
          </>
        }
      >
        <form
          id="subject-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <div>
            <Input
              label="Nama mata pelajaran"
              id="subjectName"
              placeholder="Contoh: Matematika"
              {...register("name")}
              error={errors.name?.message}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SubjectsPage;
