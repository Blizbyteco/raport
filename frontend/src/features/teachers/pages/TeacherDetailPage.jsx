import { ArrowLeft, IdCard, Phone, UserRound } from "lucide-react";
import { useNavigate, useParams } from "react-router";

import Button from "@/shared/ui/button/Button";
import slugify from "@/shared/lib/slugify";
import { teachers } from "@/shared/data/teachers.json";

const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

const DetailItem = ({ icon: Icon, label, value }) => {
  return (
    <div className="flex items-start gap-3">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="size-5" />
      </span>

      <div className="min-w-0">
        <dt className="text-xs font-medium text-muted">{label}</dt>
        <dd className="mt-1 truncate text-sm font-semibold text-foreground">
          {value}
        </dd>
      </div>
    </div>
  );
};

const TeacherDetailPage = () => {
  const navigate = useNavigate();
  const { slug } = useParams();

  const teacher = teachers.find((item) => slugify(item.name) === slug);

  if (!teacher) {
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

      <section className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex flex-col gap-4 border-b border-border p-6 sm:flex-row sm:items-center">
          <span className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-xl font-bold text-primary">
            {getInitials(teacher.name)}
          </span>

          <div className="min-w-0 flex-1">
            <h1 className="truncate text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              {teacher.name}
            </h1>
            <p className="mt-1 text-sm text-muted">NIP {teacher.nip}</p>
          </div>
        </div>

        <dl className="grid gap-6 p-6 sm:grid-cols-2">
          <DetailItem icon={IdCard} label="NIP" value={teacher.nip} />
          <DetailItem
            icon={UserRound}
            label="Jenis kelamin"
            value={teacher.gender}
          />
          <DetailItem icon={Phone} label="No Telepon" value={teacher.phone} />
        </dl>
      </section>
    </div>
  );
};

export default TeacherDetailPage;
