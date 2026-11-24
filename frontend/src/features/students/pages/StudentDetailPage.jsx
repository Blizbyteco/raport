import { useState } from "react";
import { ArrowLeft, Pencil, Save, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router";

import Button from "@/shared/ui/button/Button";
import Input from "@/shared/ui/form/Input";
import Select from "@/shared/ui/form/Select";
import Modal from "@/shared/ui/overlay/Modal";

import useStudent from "../hooks/useStudent";
import useUpdateStudent from "../hooks/useUpdateStudent";
import useDeleteStudent from "../hooks/useDeleteStudent";
import usePermissions from "@/features/auth/hooks/usePermissions";

const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

const StudentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useStudent(id);
  const updateMutation = useUpdateStudent();
  const deleteMutation = useDeleteStudent();
  const { canManage } = usePermissions();

  const student = data?.data ?? data;

  const initialForm = student
    ? {
        nisn: student.nisn ?? "",
        full_name: student.full_name ?? "",
        gender: student.gender ?? "",
        parent_name: student.parent_name ?? "",
      }
    : null;

  const [draft, setDraft] = useState(null);
  const [editing, setEditing] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const form = draft ?? initialForm;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setDraft((current) => ({ ...(current ?? initialForm), [name]: value }));
  };

  const handleCancel = () => {
    setDraft(null);
    setEditing(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    updateMutation.mutate(
      {
        id: student.id,
        nisn: form.nisn.trim(),
        full_name: form.full_name.trim(),
        gender: form.gender || null,
        parent_name: form.parent_name.trim() || null,
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
    deleteMutation.mutate(student.id, {
      onSuccess: () => navigate("/dashboard/students"),
    });
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl">
        <p className="text-sm text-muted">Memuat data siswa...</p>
      </div>
    );
  }

  if (isError || !student || !form) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <Button
          variant="ghost"
          size="S"
          icon={ArrowLeft}
          onClick={() => navigate("/dashboard/students")}
          className="-ml-2"
        >
          Kembali
        </Button>

        <div className="rounded-xl border border-border bg-card p-10 text-center">
          <p className="font-semibold text-foreground">Siswa tidak ditemukan</p>
          <p className="mt-1 text-sm text-muted">
            Data siswa yang Anda cari tidak tersedia.
          </p>
        </div>
      </div>
    );
  }

  const activePlacements = (student.classStudents ?? []).filter(
    (placement) => placement.status === "AKTIF",
  );
  const currentPlacement =
    activePlacements.find((placement) => placement.academicYear?.is_active) ??
    activePlacements[0];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Button
        variant="ghost"
        size="S"
        icon={ArrowLeft}
        onClick={() => navigate("/dashboard/students")}
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
                <p className="mt-1 text-sm text-muted">NISN {form.nisn}</p>
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
              label="NISN"
              name="nisn"
              value={form.nisn}
              onChange={handleChange}
              disabled={!editing}
              required={editing}
            />

            <Select
              label="Jenis kelamin"
              name="gender"
              value={form.gender}
              onChange={handleChange}
              disabled={!editing}
            >
              <option value="">Belum diisi</option>
              <option value="L">Laki-laki</option>
              <option value="P">Perempuan</option>
            </Select>

            <Input
              label="Nama wali / orang tua"
              name="parent_name"
              value={form.parent_name}
              onChange={handleChange}
              disabled={!editing}
            />

            <Input
              label="Kelas"
              value={
                currentPlacement
                  ? `${currentPlacement.schoolClass?.name ?? "-"} (${currentPlacement.academicYear?.start_year ?? "-"}/${currentPlacement.academicYear?.end_year ?? "-"})`
                  : "Belum ditempatkan"
              }
              disabled
            />
          </div>

          {updateMutation.isError && (
            <p className="px-6 pb-6 text-sm text-danger">
              {updateMutation.error?.response?.data?.message ||
                "Gagal menyimpan data siswa."}
            </p>
          )}
        </section>
      </form>

      <Modal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Hapus data siswa"
        description={`Data ${form.full_name} akan dihapus dari daftar siswa.`}
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

export default StudentDetailPage;
