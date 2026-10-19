import { Save } from "lucide-react";
import { useNavigate } from "react-router";

import Button from "@/shared/ui/button/Button";
import Input from "@/shared/ui/form/Input";
import Select from "@/shared/ui/form/Select";
import FormHeader from "@/shared/layout/FormHeader";

const StudentForm = () => {
  const navigate = useNavigate();

  return (
    <form className="space-y-6">
      <section className="rounded-xl border border-border bg-card">
        <div className="border-b border-border p-6">
          <FormHeader
            title="Data Pribadi"
            description="Informasi dasar mengenai siswa."
          />
        </div>

        <div className="grid gap-4 p-6 sm:grid-cols-2">
          <Input
            label="NIS"
            id="nis"
            name="nis"
            placeholder="Contoh: 20250101"
            required
            error="harap isi"
          />

          <Input
            label="Nama lengkap"
            id="name"
            name="name"
            placeholder="Masukkan nama lengkap siswa"
            required
          />

          <Select label="Jenis kelamin" name="gender" defaultValue="" required>
            <option value="" disabled>
              Pilih jenis kelamin
            </option>

            <option value="Laki-laki">Laki-laki</option>
            <option value="Perempuan">Perempuan</option>
          </Select>

          <Input
            label="Nama Wali / Orang tua"
            id="name"
            name="name"
            placeholder="Masukkan nama lengkap"
            required
          />
        </div>
      </section>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button
          onClick={() => navigate(-1)}
          type="button"
          variant="outline"
          size="M"
        >
          Batal
        </Button>

        <Button type="submit" variant="primary" size="M" icon={Save}>
          Simpan siswa
        </Button>
      </div>
    </form>
  );
};

export default StudentForm;
