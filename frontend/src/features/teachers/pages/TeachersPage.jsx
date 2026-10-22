import { useState } from "react";
import { Download, FileSpreadsheet, Plus, Search, Trash2 } from "lucide-react";

import Button from "@/shared/ui/button/Button";
import Input from "@/shared/ui/form/Input";
import Modal from "@/shared/ui/overlay/Modal";
import { useNavigate } from "react-router";

import TeacherTable from "../ui/TeacherTable";
import { teachers } from "@/shared/data/teachers.json";
import PageHeader from "@/shared/layout/PageHeader";

const TeachersPage = () => {
  const navigate = useNavigate();

  const [teacherList, setTeacherList] = useState(teachers);
  const [teacherToDelete, setTeacherToDelete] = useState(null);

  const handleDelete = () => {
    if (!teacherToDelete) return;

    setTeacherList((current) =>
      current.filter((teacher) => teacher.nip !== teacherToDelete.nip),
    );
    setTeacherToDelete(null);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <PageHeader
          title="Data Guru"
          description="Kelola dan lihat data guru yang terdaftar."
        />

        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="flex gap-2">
            <Button variant="outline" icon={Download}>
              Ekspor data
            </Button>
            <Button
              onClick={() => navigate("import")}
              variant="outline"
              icon={FileSpreadsheet}
            >
              Impor data
            </Button>
          </div>
          <Button
            onClick={() => navigate("create")}
            variant="primary"
            icon={Plus}
          >
            Tambah guru
          </Button>
        </div>
      </header>

      <section className="space-y-4" aria-labelledby="teacher-list-title">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <Input icon={Search} placeholder="Cari nama atau NIP..." />
        </div>

        <TeacherTable teachers={teacherList} onDelete={setTeacherToDelete} />
      </section>

      <Modal
        open={Boolean(teacherToDelete)}
        onClose={() => setTeacherToDelete(null)}
        title="Hapus data guru"
        description={
          teacherToDelete
            ? `Data ${teacherToDelete.name} akan dihapus dari daftar guru.`
            : undefined
        }
        size="S"
        footer={
          <>
            <Button variant="outline" onClick={() => setTeacherToDelete(null)}>
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

export default TeachersPage;
