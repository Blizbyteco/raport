import { useState } from "react";
import { Plus, Search, Trash2 } from "lucide-react";

import Button from "@/shared/ui/button/Button";
import Input from "@/shared/ui/form/Input";
import Textarea from "@/shared/ui/form/Textarea";
import Modal from "@/shared/ui/overlay/Modal";
import PageHeader from "@/shared/layout/PageHeader";

import ExtracurricularCard from "../ui/ExtracurricularCard";
import ExtracurricularMembersModal from "../ui/ExtracurricularMembersModal";
import usePermissions from "@/features/auth/hooks/usePermissions";
import useActiveAcademicYear from "@/features/academic-year/hooks/useActiveAcademicYear";
import useExtracurricular from "../hooks/useExtracurricular";
import useExtracurriculars from "../hooks/useExtracurriculars";
import useCreateExtracurricular from "../hooks/useCreateExtracurricular";
import useUpdateExtracurricular from "../hooks/useUpdateExtracurricular";
import useDeleteExtracurricular from "../hooks/useDeleteExtracurricular";

const emptyForm = { name: "", description: "", is_active: true };

const ExtracurricularsPage = () => {
  const { canManage } = usePermissions();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formOverrides, setFormOverrides] = useState(null);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [managing, setManaging] = useState(null);
  const [search, setSearch] = useState("");

  const { data: activeAcademicYear } = useActiveAcademicYear();
  const { data, isLoading, isError } = useExtracurriculars(activeAcademicYear?.id);
  const { data: extracurricularDetail } = useExtracurricular(editing?.id);
  const createMutation = useCreateExtracurricular();
  const updateMutation = useUpdateExtracurricular();
  const deleteMutation = useDeleteExtracurricular();

  const items = data ?? [];
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase().trim()),
  );

  const canonicalExtracurricular =
    extracurricularDetail?.data ?? extracurricularDetail;
  const formSource = editing ? canonicalExtracurricular ?? editing : emptyForm;
  const form = {
    name: formOverrides?.name ?? formSource?.name ?? "",
    description: formOverrides?.description ?? formSource?.description ?? "",
    is_active: formOverrides?.is_active ?? (formSource?.is_active !== false),
  };

  const openCreate = () => {
    setEditing(null);
    setFormOverrides(null);
    setIsModalOpen(true);
  };

  const openEdit = (extracurricular) => {
    setEditing(extracurricular);
    setFormOverrides(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditing(null);
    setFormOverrides(null);
    setIsModalOpen(false);
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormOverrides((current) => ({
      ...(current ?? {}),
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      is_active: form.is_active,
    };

    if (!payload.name) return;

    if (editing) {
      updateMutation.mutate(
        { id: editing.id, ...payload },
        { onSuccess: closeModal },
      );
      return;
    }

    createMutation.mutate(payload, { onSuccess: closeModal });
  };

  const handleDelete = () => {
    if (!deleting) return;

    deleteMutation.mutate(deleting.id, {
      onSuccess: () => setDeleting(null),
    });
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <PageHeader
          title="Ekstrakurikuler"
          description="Kelola daftar ekstrakurikuler yang tersedia."
        />

        {canManage && (
          <Button icon={Plus} onClick={openCreate}>
            Tambah ekskul
          </Button>
        )}
      </header>

      <div className="w-full sm:max-w-sm">
        <Input
          icon={Search}
          placeholder="Cari ekstrakurikuler..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {isLoading ? (
        <p className="text-sm text-muted">Memuat ekstrakurikuler...</p>
      ) : isError ? (
        <p className="text-sm text-danger">Gagal memuat ekstrakurikuler.</p>
      ) : (
        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((extracurricular) => (
            <ExtracurricularCard
              key={extracurricular.id}
              excul={extracurricular}
              onEdit={() => openEdit(extracurricular)}
              onDelete={() => setDeleting(extracurricular)}
              onManage={() => setManaging(extracurricular)}
            />
          ))}

          {!filteredItems.length && (
            <p className="col-span-full py-10 text-center text-sm text-muted">
              Ekstrakurikuler tidak ditemukan.
            </p>
          )}
        </section>
      )}

      <Modal
        open={isModalOpen}
        onClose={closeModal}
        title={
          editing ? "Ubah Ekstrakurikuler" : "Tambah Ekstrakurikuler"
        }
        description={
          editing
            ? "Perbarui data ekstrakurikuler."
            : "Tambahkan ekstrakurikuler baru."
        }
        footer={
          <>
            <Button variant="outline" onClick={closeModal}>
              Batal
            </Button>
            <Button
              type="submit"
              form="extracurricular-form"
              isLoading={isSubmitting}
              disabled={!form.name.trim() || isSubmitting}
            >
              {editing ? "Simpan perubahan" : "Tambah ekstrakurikuler"}
            </Button>
          </>
        }
      >
        <form id="extracurricular-form" onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nama ekstrakurikuler"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Contoh: Pramuka"
            required
          />

          <Textarea
            label="Deskripsi"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Deskripsi singkat ekstrakurikuler"
          />

          <label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <input
              type="checkbox"
              name="is_active"
              checked={form.is_active}
              onChange={handleChange}
              className="size-4 accent-primary"
            />
            Aktif
          </label>
        </form>
      </Modal>

      <Modal
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        title="Hapus ekstrakurikuler"
        description={
          deleting
            ? `Ekstrakurikuler "${deleting.name}" akan dihapus.`
            : undefined
        }
        size="S"
        footer={
          <>
            <Button variant="outline" onClick={() => setDeleting(null)}>
              Batal
            </Button>
            <Button
              variant="danger"
              icon={Trash2}
              onClick={handleDelete}
              isLoading={deleteMutation.isPending}
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

      {managing && (
        <ExtracurricularMembersModal
          extracurricular={managing}
          onClose={() => setManaging(null)}
        />
      )}
    </div>
  );
};

export default ExtracurricularsPage;
