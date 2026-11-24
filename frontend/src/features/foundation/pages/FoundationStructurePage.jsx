import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import Button from "@/shared/ui/button/Button";
import Input from "@/shared/ui/form/Input";
import Select from "@/shared/ui/form/Select";
import Modal from "@/shared/ui/overlay/Modal";
import PageHeader from "@/shared/layout/PageHeader";
import usePermissions from "@/features/auth/hooks/usePermissions";

import FoundationTree from "../ui/FoundationTree";
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
  parent_id: "",
  sort_order: "",
};

const getBlockedParentIds = (official, officials) => {
  const blocked = new Set();

  if (!official) return blocked;

  blocked.add(official.id);
  const stack = [official.id];

  while (stack.length) {
    const currentId = stack.pop();

    officials.forEach((item) => {
      if (item.parent_id === currentId && !blocked.has(item.id)) {
        blocked.add(item.id);
        stack.push(item.id);
      }
    });
  }

  return blocked;
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
      parent_id:
        official.parent_id === null || official.parent_id === undefined
          ? ""
          : String(official.parent_id),
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
      parent_id: form.parent_id ? Number(form.parent_id) : null,
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

  const blockedParentIds = getBlockedParentIds(editing, officials);
  const parentOptions = officials.filter(
    (official) => !blockedParentIds.has(official.id),
  );

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

      <FoundationTree
        officials={officials}
        isLoading={isLoading}
        isError={isError}
        canManage={canManage}
        onEdit={openEdit}
        onDelete={setDeleting}
      />

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

          <Select
            label="Atasan langsung"
            name="parent_id"
            value={form.parent_id}
            onChange={handleChange}
          >
            <option value="">Tidak ada (puncak struktur)</option>
            {parentOptions.map((official) => (
              <option key={official.id} value={official.id}>
                {official.name} — {official.position}
              </option>
            ))}
          </Select>

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
