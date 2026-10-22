import { useState } from "react";
import { ArrowLeft, Pencil, Save, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router";

import Button from "@/shared/ui/button/Button";
import Input from "@/shared/ui/form/Input";
import Select from "@/shared/ui/form/Select";
import Modal from "@/shared/ui/overlay/Modal";
import slugify from "@/shared/lib/slugify";
import {
  getTeachers,
  removeTeacher,
  updateTeacher,
} from "../ui/teacherList";

const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

const TeacherDetailContent = ({ slug }) => {
  const navigate = useNavigate();

  const [form, setForm] = useState(
    () =>
      getTeachers().find((teacher) => slugify(teacher.name) === slug) ?? null,
  );
  const [originalNip] = useState(form?.nip ?? null);
  const [editing, setEditing] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleCancel = () => {
    const current = getTeachers().find(
      (teacher) => teacher.nip === originalNip,
    );

    setForm(current ?? null);
    setEditing(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form) return;

    updateTeacher(originalNip, form);
    setEditing(false);

    const newSlug = slugify(form.name);

    if (newSlug !== slug) {
      navigate(`/dashboard/teachers/${newSlug}`, { replace: true });
    }
  };

  const handleDelete = () => {
    if (!form) return;

    removeTeacher(form.nip);
    navigate("/dashboard/teachers");
  };

  if (!form) {
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
                {getInitials(form.name)}
              </span>

              <div className="min-w-0">
                <h1 className="truncate text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                  {form.name}
                </h1>
                <p className="mt-1 text-sm text-muted">NIP {form.nip}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {editing ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                  >
                    Batal
                  </Button>
                  <Button type="submit" variant="primary" icon={Save}>
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
              )}
            </div>
          </div>

          <div className="grid gap-4 p-6 sm:grid-cols-2">
            <Input
              label="Nama lengkap"
              name="name"
              value={form.name}
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

            <Select
              label="Jenis kelamin"
              name="gender"
              value={form.gender}
              onChange={handleChange}
              disabled={!editing}
            >
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </Select>

            <Input
              label="No Telepon"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              disabled={!editing}
            />
          </div>
        </section>
      </form>

      <Modal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Hapus data guru"
        description={`Data ${form.name} akan dihapus dari daftar guru.`}
        size="S"
        footer={
          <>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Batal
            </Button>
            <Button variant="danger" icon={Trash2} onClick={handleDelete}>
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

const TeacherDetailPage = () => {
  const { slug } = useParams();

  return <TeacherDetailContent key={slug} slug={slug} />;
};

export default TeacherDetailPage;
