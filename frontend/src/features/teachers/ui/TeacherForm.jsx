import { useNavigate } from "react-router";
import { Save } from "lucide-react";

import Button from "@/shared/ui/button/Button";
import Input from "@/shared/ui/form/Input";
import Select from "@/shared/ui/form/Select";
import FormHeader from "@/shared/layout/FormHeader";

const TeacherForm = () => {
  const navigate = useNavigate();

  return (
    <form className="space-y-6">
      <section className="rounded-xl border border-border bg-card">
        <div className="border-b border-border px-5 py-4 sm:px-6">
          <FormHeader
            title="Data Pribadi"
            description="Informasi dasar mengenai guru."
          />
        </div>

        <div className="grid gap-4 p-6 sm:grid-cols-2">
          <Input
            label="NIP"
            name="nip"
            placeholder="Contoh: 198501012010011001"
            required
          />

          <Input
            label="Nama lengkap"
            name="name"
            placeholder="Masukkan nama lengkap guru"
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
            label="No Telepon"
            name="phone"
            placeholder="+62 xxx xxx xxx"
          />
        </div>
      </section>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button onClick={() => navigate(-1)} type="button" variant="outline">
          Batal
        </Button>

        <Button type="submit" variant="primary" icon={Save}>
          Simpan guru
        </Button>
      </div>
    </form>
  );
};

export default TeacherForm;
