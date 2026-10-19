import { useNavigate } from "react-router";
import { Download, FileSpreadsheet, Plus, Search } from "lucide-react";

import Button from "@/shared/ui/button/Button";
import Input from "@/shared/ui/form/Input";
import Select from "@/shared/ui/form/Select";

import { students } from "@/shared/data/students.json";
import { classes } from "@/shared/data/classes.json";
import StudentTable from "../ui/StudentTable";
import PageHeader from "@/shared/layout/PageHeader";

const StudentsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <PageHeader
          title="Data Siswa"
          description="Kelola dan lihat data siswa yang terdaftar."
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
            Tambah siswa
          </Button>
        </div>
      </header>

      <section className="space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <Input icon={Search} placeholder="Cari nama, NIS..." />

          <div className="w-fulls sm:w-3/5">
            <Select>
              <option value="Semua kelas">Semua kelas</option>
              {classes.map((_class) => (
                <option key={_class.id}>{_class.name}</option>
              ))}
            </Select>
          </div>
        </div>

        <StudentTable students={students} />
      </section>
    </div>
  );
};

export default StudentsPage;
