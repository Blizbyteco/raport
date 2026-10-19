import { useState } from "react";
import { Plus, Search } from "lucide-react";

import Button from "@/shared/ui/button/Button";
import Input from "@/shared/ui/form/Input";
import Modal from "@/shared/ui/overlay/Modal";
import { extracurriculars } from "@/shared/data/extracurriculars.json";
import ExtracurricularCard from "../ui/ExtracurricularCard";
import PageHeader from "@/shared/layout/PageHeader";

const ExtracurricularsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);

  const openCreateModal = () => {
    setEditingSubject(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSubject(null);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <PageHeader
          title="Ekstrakurikuler"
          description="Kelola daftar ekskul yang tersedia"
        />

        <Button icon={Plus} onClick={openCreateModal}>
          Tambah mapel
        </Button>
      </header>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {extracurriculars.map((excul) => (
          <ExtracurricularCard excul={excul} />
        ))}
      </section>

      <Modal
        open={isModalOpen}
        onClose={closeModal}
        title={editingSubject ? "Edit Mata Pelajaran" : "Tambah Mata Pelajaran"}
        description={
          editingSubject
            ? "Ubah nama mata pelajaran."
            : "Tambahkan mata pelajaran baru."
        }
        footer={
          <>
            <Button variant="outline" onClick={closeModal}>
              Batal
            </Button>
            <Button>
              {editingSubject ? "Simpan perubahan" : "Tambah mata pelajaran"}
            </Button>
          </>
        }
      >
        <Input
          label="Nama mata pelajaran"
          id="subjectName"
          name="subjectName"
          placeholder="Contoh: Matematika"
          defaultValue={editingSubject?.name ?? ""}
          required
        />
      </Modal>
    </div>
  );
};

export default ExtracurricularsPage;
