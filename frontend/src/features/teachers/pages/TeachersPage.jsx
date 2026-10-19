import { Download, FileSpreadsheet, Plus, Search } from "lucide-react";

import Button from "@/shared/ui/button/Button";
import Input from "@/shared/ui/form/Input";
import { useNavigate } from "react-router";

import TeacherTable from "../ui/TeacherTable";
import { teachers } from "@/shared/data/teachers.json";
import PageHeader from "@/shared/layout/PageHeader";

const TeachersPage = () => {
  const navigate = useNavigate();

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

        <TeacherTable teachers={teachers} />
      </section>
    </div>
  );
};

export default TeachersPage;
