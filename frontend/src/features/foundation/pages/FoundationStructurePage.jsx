import { useState } from "react";
import {
  Landmark,
  Mail,
  Pencil,
  Phone,
  Plus,
  Trash2,
  UserRound,
} from "lucide-react";

import Button from "@/shared/ui/button/Button";
import Input from "@/shared/ui/form/Input";
import Modal from "@/shared/ui/overlay/Modal";
import PageHeader from "@/shared/layout/PageHeader";
import Tooltip from "@/shared/ui/feedback/Tooltip";
import usePermissions from "@/features/auth/hooks/usePermissions";

import useFoundationOfficials from "../hooks/useFoundationOfficials";
import useCreateFoundationOfficial from "../hooks/useCreateFoundationOfficial";
import useUpdateFoundationOfficial from "../hooks/useUpdateFoundationOfficial";
import useDeleteFoundationOfficial from "../hooks/useDeleteFoundationOfficial";

const emptyForm = {
  name: "",
  position: "",
  period: "",
  phone: "",
  email: "",
  sort_order: "",
};

const FoundationStructurePage = () => {
  const { canManage } = usePermissions();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const { data, isLoading, isError } = useFoundationOfficials();
  const createMutation = useCreateFoundationOfficial();
  const updateMutation = useUpdateFoundationOfficial();
  const deleteMutation = useDeleteFoundationOfficial();

  const officials = data ?? [];

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEdit = (official) => {
    setEditing(official);
    setForm({
      name: official.name ?? "",
      position: official.position ?? "",
      period: official.period ?? "",
      phone: official.phone ?? "",
      email: official.email ?? "",
      sort_order:
        official.sort_order === null || official.sort_order === undefined
          ? ""
          : String(official.sort_order),
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditing(null);
    setForm(emptyForm);
    createMutation.reset();
    updateMutation.reset();
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const payload = {
      name: form.name.trim(),
      position: form.position.trim(),
      period: form.period.trim() || null,
      phone: form.phone.trim() || null,
      email: form.email.trim() || null,
      sort_order: Number(form.sort_order) || 0,
    };

    if (!payload.name || !payload.position) return;

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
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <PageHeader
          title="Struktur Yayasan"
          description="Susunan pengurus yayasan yang menaungi sekolah."
        />

        {canManage && (
          <Button icon={Plus} onClick={openCreate}>
            Tambah pengurus
          </Button>
        )}
      </header>

      {isLoading ? (
        <p className="text-sm text-muted">Memuat struktur yayasan...</p>
      ) : isError ? (
        <p className="text-sm text-danger">Gagal memuat struktur yayasan.</p>
      ) : officials.length > 0 ? (
        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {officials.map((official) => (
            <article
              key={official.id}
              className="group flex flex-col rounded-xl border border-border bg-card px-4 py-3 transition-all duration-200 hover:ring-1 ring-primary"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Landmark className="size-4" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                      {official.position}
                    </p>
                    <h2 className="mt-1 truncate text-sm font-semibold text-foreground">
                      {official.name}
                    </h2>
                    {official.period && (
                      <p className="mt-1 text-xs text-muted">
                        Periode {official.period}
                      </p>
                    )}
                  </div>
                </div>

                {canManage && (
                  <div className="flex shrink-0 items-center gap-1 transition-opacity max-md:opacity-100 md:opacity-0 md:group-hover:opacity-100 md:focus-within:opacity-100">
                    <Tooltip label="Ubah data pengurus">
                      <Button
                        variant="ghost"
                        size="S"
                        icon={Pencil}
                        iconOnly
                        onClick={() => openEdit(official)}
                        aria-label={`Ubah data ${official.name}`}
                      />
                    </Tooltip>

                    <Tooltip label="Hapus data pengurus">
                      <Button
                        variant="ghost"
                        size="S"
                        icon={Trash2}
                        iconOnly
                        onClick={() => setDeleting(official)}
                        aria-label={`Hapus data ${official.name}`}
                      />
                    </Tooltip>
                  </div>
                )}
              </div>

              {(official.phone || official.email) && (
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-border pt-3 text-xs text-muted">
                  {official.phone && (
                    <span className="inline-flex items-center gap-1.5">
                      <Phone className="size-3.5" aria-hidden="true" />
                      {official.phone}
                    </span>
                  )}
                  {official.email && (
                    <span className="inline-flex items-center gap-1.5">
                      <Mail className="size-3.5" aria-hidden="true" />
                      {official.email}
                    </span>
                  )}
                </div>
              )}
            </article>
          ))}
        </section>
      ) : (
        <div className="rounded-xl border border-border bg-card px-6 py-14 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-background text-muted">
            <UserRound className="size-5" />
          </div>

          <h2 className="mt-4 font-bold text-card-foreground">
            Belum ada pengurus yayasan
          </h2>

          <p className="mt-1 text-sm text-muted">
            {canManage
              ? "Tambahkan susunan pengurus yayasan terlebih dahulu."
              : "Struktur pengurus yayasan belum diisi."}
          </p>
        </div>
      )}

      <Modal
        open={isModalOpen}
        onClose={closeModal}
        title={editing ? "Ubah Pengurus Yayasan" : "Tambah Pengurus Yayasan"}
        description={
          editing
            ? "Perbarui data pengurus yayasan."
            : "Tambahkan pengurus ke dalam struktur yayasan."
        }
        footer={
          <>
            <Button variant="outline" onClick={closeModal}>
              Batal
            </Button>
            <Button
              type="submit"
              form="foundation-official-form"
              isLoading={isSubmitting}
              disabled={
                !form.name.trim() || !form.position.trim() || isSubmitting
              }
            >
              {editing ? "Simpan perubahan" : "Tambah pengurus"}
            </Button>
          </>
        }
      >
        <form
          id="foundation-official-form"
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <Input
            label="Nama lengkap"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Contoh: Dr. H. Ach. Ubaidillah, S.T., M.T."
            required
          />

          <Input
            label="Jabatan"
            name="position"
            value={form.position}
            onChange={handleChange}
            placeholder="Contoh: Ketua Yayasan"
            required
          />

          <Input
            label="Periode"
            name="period"
            value={form.period}
            onChange={handleChange}
            placeholder="Contoh: 2025-2030"
          />

          <Input
            label="Telepon"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Contoh: 081300000001"
          />

          <Input
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Contoh: ketua@yayasan.test"
          />

          <Input
            label="Urutan tampil"
            name="sort_order"
            type="number"
            min="0"
            value={form.sort_order}
            onChange={handleChange}
            placeholder="Contoh: 1"
          />
        </form>
      </Modal>

      <Modal
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        title="Hapus pengurus yayasan"
        description={
          deleting
            ? `Pengurus "${deleting.name}" akan dihapus dari struktur yayasan.`
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
    </div>
  );
};

export default FoundationStructurePage;
