import { useState } from "react";
import { ArrowLeft, Pencil, Save, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router";

import Button from "@/shared/ui/button/Button";
import Input from "@/shared/ui/form/Input";
import Select from "@/shared/ui/form/Select";
import Modal from "@/shared/ui/overlay/Modal";
import slugify from "@/shared/lib/slugify";
import {
  getStudents,
  removeStudent,
  updateStudent,
} from "../ui/studentList";

const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

const StudentDetailContent = ({ slug }) => {
  const navigate = useNavigate();

  const [form, setForm] = useState(
    () =>
      getStudents().find((student) => slugify(student.name) === slug) ?? null,
  );
  const [originalNis] = useState(form?.nis ?? null);
  const [editing, setEditing] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleCancel = () => {
    const current = getStudents().find(
      (student) => student.nis === originalNis,
    );

    setForm(current ?? null);
    setEditing(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form) return;

    updateStudent(originalNis, form);
    setEditing(false);

    const newSlug = slugify(form.name);

    if (newSlug !== slug) {
      navigate(`/dashboard/students/${newSlug}`, { replace: true });
    }
  };

  const handleDelete = () => {
    if (!form) return;

    removeStudent(form.nis);
    navigate("/dashboard/students");
  };

  if (!form) {
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
                {getInitials(form.name)}
              </span>

              <div className="min-w-0">
                <h1 className="truncate text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                  {form.name}
                </h1>
                <p className="mt-1 text-sm text-muted">NIS {form.nis}</p>
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
              label="NIS"
              name="nis"
              value={form.nis}
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
              label="Kelas"
              name="className"
              value={form.className}
              onChange={handleChange}
              disabled={!editing}
            />

            <Input
              label="Jurusan"
              name="major"
              value={form.major}
              onChange={handleChange}
              disabled={!editing}
            />

            <Select
              label="Status"
              name="status"
              value={form.status}
              onChange={handleChange}
              disabled={!editing}
            >
              <option value="Aktif">Aktif</option>
              <option value="Tidak aktif">Tidak aktif</option>
            </Select>
          </div>
        </section>
      </form>

      <Modal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Hapus data siswa"
        description={`Data ${form.name} akan dihapus dari daftar siswa.`}
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

const StudentDetailPage = () => {
  const { slug } = useParams();

  return <StudentDetailContent key={slug} slug={slug} />;
};

export default StudentDetailPage;
