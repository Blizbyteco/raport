import { useState } from "react";
import { Plus, Search } from "lucide-react";

import Button from "@/shared/ui/button/Button";
import Input from "@/shared/ui/form/Input";
import Modal from "@/shared/ui/overlay/Modal";
import { extracurriculars } from "@/shared/data/extracurriculars.json";
import ExtracurricularCard from "../ui/ExtracurricularCard";
import PageHeader from "@/shared/layout/PageHeader";

const ExtracurricularsPage = () => {
  const [items, setItems] = useState(extracurriculars);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [name, setName] = useState("");
  const [search, setSearch] = useState("");

  const openCreateModal = () => {
    setEditingSubject(null);
    setName("");
    setIsModalOpen(true);
  };

  const openEditModal = (excul) => {
    setEditingSubject(excul);
    setName(excul.name);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSubject(null);
    setName("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) return;

    setItems((current) =>
      editingSubject
        ? current.map((item) =>
            item.id === editingSubject.id
              ? { ...item, name: trimmedName }
              : item,
          )
        : [...current, { id: Date.now(), name: trimmedName }],
    );

    closeModal();
  };

  const handleDelete = (excul) => {
    const confirmed = window.confirm(`Hapus ekstrakurikuler "${excul.name}"?`);

    if (!confirmed) return;

    setItems((current) => current.filter((item) => item.id !== excul.id));
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase().trim()),
  );

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <PageHeader
          title="Ekstrakurikuler"
          description="Kelola daftar ekskul yang tersedia"
        />

        <Button icon={Plus} onClick={openCreateModal}>
          Tambah ekskul
        </Button>
      </header>

      <div className="w-full sm:max-w-sm">
        <Input
          icon={Search}
          placeholder="Cari ekstrakurikuler..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((excul) => (
          <ExtracurricularCard
            key={excul.id}
            excul={excul}
            onEdit={() => openEditModal(excul)}
            onDelete={() => handleDelete(excul)}
          />
        ))}
      </section>

      <Modal
        open={isModalOpen}
        onClose={closeModal}
        title={
          editingSubject ? "Edit Ekstrakurikuler" : "Tambah Ekstrakurikuler"
        }
        description={
          editingSubject
            ? "Ubah nama ekstrakurikuler."
            : "Tambahkan ekstrakurikuler baru."
        }
        footer={
          <>
            <Button variant="outline" onClick={closeModal}>
              Batal
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!name.trim()}
            >
              {editingSubject ? "Simpan perubahan" : "Tambah ekstrakurikuler"}
            </Button>
          </>
        }
      >
        <Input
          label="Nama ekstrakurikuler"
          id="extracurricularName"
          name="extracurricularName"
          placeholder="Contoh: Pramuka"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
      </Modal>
    </div>
  );
};

export default ExtracurricularsPage;
