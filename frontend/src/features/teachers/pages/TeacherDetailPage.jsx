import { useState } from "react";
import { ArrowLeft, Pencil, Save, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router";

import Badge from "@/shared/ui/data-display/Badge";
import Button from "@/shared/ui/button/Button";
import Input from "@/shared/ui/form/Input";
import Modal from "@/shared/ui/overlay/Modal";

import useTeacher from "../hooks/useTeacher";
import useUpdateTeacher from "../hooks/useUpdateTeacher";
import useDeleteTeacher from "../hooks/useDeleteTeacher";
import usePermissions from "@/features/auth/hooks/usePermissions";

const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

const TeacherDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useTeacher(id);
  const updateMutation = useUpdateTeacher();
  const deleteMutation = useDeleteTeacher();
  const { canManage } = usePermissions();

  const teacher = data?.data;

  const initialForm = teacher
    ? {
        nip: teacher.nip ?? "",
        username: teacher.username ?? "",
        full_name: teacher.full_name ?? "",
        password: "",
        is_active: Boolean(teacher.is_active),
      }
    : null;

  const [draft, setDraft] = useState(null);
  const [editing, setEditing] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const form = draft ?? initialForm;

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setDraft((current) => ({
      ...(current ?? initialForm),
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCancel = () => {
    setDraft(null);
    setEditing(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    updateMutation.mutate(
      {
        id: teacher.id,
        nip: form.nip.trim(),
        username: form.username.trim(),
        full_name: form.full_name.trim(),
        password: form.password || null,
        is_active: form.is_active,
      },
      {
        onSuccess: () => {
          setDraft(null);
          setEditing(false);
        },
      },
    );
  };

  const handleDelete = () => {
    deleteMutation.mutate(teacher.id, {
      onSuccess: () => navigate("/dashboard/teachers"),
    });
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl">
        <p className="text-sm text-muted">Memuat data guru...</p>
      </div>
    );
  }

  if (isError || !teacher || !form) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <Button
          variant="ghost"
          size="S"
          icon={ArrowLeft}
          onClick={() => navigate("/dashboard/teachers")}
          className="-ml-2"
        >
          Kembali
        </Button>

        <div className="rounded-xl border border-border bg-card p-10 text-center">
          <p className="font-semibold text-foreground">Guru tidak ditemukan</p>
          <p className="mt-1 text-sm text-muted">
            Data guru yang Anda cari tidak tersedia.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Button
        variant="ghost"
        size="S"
        icon={ArrowLeft}
        onClick={() => navigate("/dashboard/teachers")}
        className="-ml-2"
      >
        Kembali
      </Button>

      <form onSubmit={handleSubmit}>
        <section className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="flex flex-col gap-4 border-b border-border p-6 lg:flex-row lg:items-center">
            <div className="flex min-w-0 flex-1 items-center gap-4">
              <span className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-xl font-bold text-primary">
                {getInitials(form.full_name)}
              </span>

              <div className="min-w-0">
                <h1 className="truncate text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                  {form.full_name}
                </h1>
                <p className="mt-1 text-sm text-muted">NIP {form.nip}</p>
                <div className="mt-2">
                  <Badge variant={form.is_active ? "success" : "muted"}>
                    {form.is_active ? "Aktif" : "Tidak aktif"}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {canManage &&
                (editing ? (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                    >
                      Batal
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      icon={Save}
                      isLoading={updateMutation.isPending}
                    >
                      Simpan
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      type="button"
                      variant="primary"
                      icon={Pencil}
                      onClick={() => setEditing(true)}
                    >
                      Ubah data
                    </Button>
                    <Button
                      type="button"
                      variant="danger"
                      icon={Trash2}
                      onClick={() => setDeleteOpen(true)}
                    >
                      Hapus data
                    </Button>
                  </>
                ))}
            </div>
          </div>

          <div className="grid gap-4 p-6 sm:grid-cols-2">
            <Input
              label="Nama lengkap"
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              disabled={!editing}
              required={editing}
            />

            <Input
              label="NIP"
              name="nip"
              value={form.nip}
              onChange={handleChange}
              disabled={!editing}
              required={editing}
            />

            <Input
              label="Username"
              name="username"
              value={form.username}
              onChange={handleChange}
              disabled={!editing}
              required={editing}
            />

            <Input
              label="Password baru"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              disabled={!editing}
              placeholder="Kosongkan jika tidak diubah"
            />

            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <input
                type="checkbox"
                name="is_active"
                checked={form.is_active}
                onChange={handleChange}
                disabled={!editing}
                className="size-4 accent-primary"
              />
              Akun aktif
            </label>
          </div>

          {updateMutation.isError && (
            <p className="px-6 pb-6 text-sm text-danger">
              {updateMutation.error?.response?.data?.message ||
                "Gagal menyimpan data guru."}
            </p>
          )}
        </section>
      </form>

      <Modal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Hapus data guru"
        description={`Data ${form.full_name} akan dihapus dari daftar guru.`}
        size="S"
        footer={
          <>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
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

export default TeacherDetailPage;
