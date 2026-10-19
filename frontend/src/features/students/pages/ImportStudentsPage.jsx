import { Download, Save } from "lucide-react";

import Button from "@/shared/ui/button/Button";
import FileUpload from "@/shared/ui/form/FileUpload";
import PageHeader from "@/shared/layout/PageHeader";
import FormHeader from "@/shared/layout/FormHeader";

const ImportStudentsPage = () => {
  return (
    <form className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        title="Import Siswa"
        description="Tambahkan banyak data siswa sekaligus melalui file Excel."
      />
      <section className="rounded-xl border border-border bg-card">
        <div className="border-b border-border p-6">
          <FormHeader
            title="Upload file Excel"
            description="Gunakan file dengan format .xlsx atau .xls."
          />
        </div>

        <div className="p-5 sm:p-6">
          <FileUpload
            id="student-file"
            name="student-file"
            accept=".xlsx,.xls"
            title="Pilih file Excel"
            description="Klik untuk memilih file atau seret file Excel ke area ini."
          />
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card">
        <div className="border-b border-border p-6">
          <FormHeader title="Format file" />
        </div>

        <div className="p-6">
          <div className="flex flex-col gap-3 rounded-lg sm:flex-row sm:items-center sm:justify-between">
            <FormHeader
              title="Belum punya template?"
              description="Download template Excel agar format kolom sesuai."
            />
            <Button variant="outline" size="S" icon={Download}>
              Download template
            </Button>
          </div>
        </div>
      </section>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" size="M">
          Batal
        </Button>

        <Button type="button" variant="primary" size="M" icon={Save}>
          Impor siswa
        </Button>
      </div>
    </form>
  );
};

export default ImportStudentsPage;
