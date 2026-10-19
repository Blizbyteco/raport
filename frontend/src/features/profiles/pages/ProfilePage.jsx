import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  UserRound,
  ShieldCheck,
  LockKeyhole,
  Camera,
  Check,
  Save,
  KeyRound,
  Mail,
  Phone,
  BriefcaseBusiness,
  CalendarDays,
  BadgeCheck,
  Eye,
  EyeOff,
} from "lucide-react";

const currentUser = {
  fullName: "Firmansyah",
  username: "firmansyah",
  email: "firmansyah@example.com",
  phone: "081234567890",
  role: "admin", // Bisa "teacher", tanpa mengubah layout halaman
  nip: "198765432021001",
  joinedAt: "12 Juli 2025",
  isActive: true,
};

const roleLabel = {
  admin: "Administrator",
  teacher: "Guru",
};

const getInitials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [feedback, setFeedback] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      fullName: currentUser.fullName,
      email: currentUser.email,
      phone: currentUser.phone,
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    watch,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm();

  const newPassword = watch("newPassword");

  const onSaveProfile = (data) => {
    // UI only — sambungkan ke API nanti.
    console.log(data);
    setFeedback("Perubahan profil berhasil disimpan (simulasi).");
  };

  const onChangePassword = (data) => {
    // UI only — belum mengirim perubahan ke backend.
    console.log(data);
    setFeedback("Password berhasil diperbarui (simulasi).");
    resetPassword();
  };

  const tabs = [
    { id: "profile", label: "Informasi Profil", icon: UserRound },
    { id: "security", label: "Keamanan", icon: ShieldCheck },
  ];

  return (
    <main className="min-h-screen space-y-6 bg-background text-dark ">
      {/* Page heading */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Profile Saya</h1>
        <p className="text-sm text-muted">
          Kelola informasi akun dan pengaturan keamanan Anda.
        </p>
      </div>

      {/* Profile overview */}
      <section className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="h-28 bg-primary/10 sm:h-36" />

        <div className="px-5 pb-5 sm:px-7">
          <div className="-mt-10 flex flex-col gap-4 sm:-mt-12 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <div className="relative flex size-20 shrink-0 items-center justify-center rounded-2xl border-4 border-card bg-primary text-2xl font-bold text-white sm:size-24">
                {getInitials(currentUser.fullName)}
                <button
                  type="button"
                  title="Ubah foto profil"
                  className="absolute -bottom-1 -right-1 flex size-8 items-center justify-center rounded-full border-2 border-card bg-background text-foreground shadow-sm transition hover:bg-muted/20"
                >
                  <Camera size={15} />
                </button>
              </div>

              <div className="min-w-0 pb-1">
                <h2 className="truncate text-xl font-bold">
                  {currentUser.fullName}
                </h2>
                <p className="text-sm text-muted">@{currentUser.username}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:pb-1">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
                <BriefcaseBusiness size={14} />
                {roleLabel[currentUser.role] ?? "Pengguna"}
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-600">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                {currentUser.isActive ? "Akun Aktif" : "Nonaktif"}
              </span>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted">
            <span className="inline-flex items-center gap-1.5">
              <BadgeCheck size={14} />
              NIP: {currentUser.nip}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays size={14} />
              Bergabung {currentUser.joinedAt}
            </span>
          </div>
        </div>
      </section>

      {/* Feedback */}
      {feedback && (
        <div className="flex items-start gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-600">
          <Check size={17} className="mt-0.5 shrink-0" />
          {feedback}
          <button
            type="button"
            onClick={() => setFeedback("")}
            className="ml-auto text-xs font-medium underline"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Main content */}
      <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        {/* Sidebar tabs */}
        <aside className="h-fit rounded-2xl border border-border bg-card p-2">
          <p className="px-3 pb-2 pt-2 text-xs font-semibold uppercase tracking-wider text-muted">
            Pengaturan Akun
          </p>

          <nav className="flex gap-1 lg:flex-col">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setActiveTab(id);
                  setFeedback("");
                }}
                className={`flex flex-1 items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition lg:flex-none ${
                  activeTab === id
                    ? "bg-primary/10 text-primary"
                    : "text-muted hover:bg-muted/10 hover:text-foreground"
                }`}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Profile form */}
        <section className="min-w-0 rounded-2xl border border-border bg-card">
          {activeTab === "profile" ? (
            <form onSubmit={handleSubmit(onSaveProfile)}>
              <div className="border-b border-border p-5 sm:p-6">
                <h3 className="font-semibold">Informasi Profil</h3>
                <p className="mt-1 text-sm text-muted">
                  Informasi dasar yang terhubung dengan akun Anda.
                </p>
              </div>

              <div className="space-y-5 p-5 sm:p-6">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-sm font-medium">Nama Lengkap</label>
                    <div className="relative">
                      <UserRound
                        size={17}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                      />
                      <input
                        {...register("fullName", {
                          required: "Nama lengkap wajib diisi",
                        })}
                        className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                        placeholder="Masukkan nama lengkap"
                      />
                    </div>
                    {errors.fullName && (
                      <p className="text-xs text-red-500">
                        {errors.fullName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Username</label>
                    <input
                      value={currentUser.username}
                      readOnly
                      className="w-full cursor-not-allowed rounded-xl border border-border bg-muted/10 px-3 py-2.5 text-sm text-muted outline-none"
                    />
                    <p className="text-xs text-muted">
                      Username tidak dapat diubah.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">NIP</label>
                    <input
                      value={currentUser.nip}
                      readOnly
                      className="w-full cursor-not-allowed rounded-xl border border-border bg-muted/10 px-3 py-2.5 text-sm text-muted outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <div className="relative">
                      <Mail
                        size={17}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                      />
                      <input
                        type="email"
                        {...register("email", {
                          required: "Email wajib diisi",
                          pattern: {
                            value: /^\S+@\S+\.\S+$/,
                            message: "Format email tidak valid",
                          },
                        })}
                        className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                        placeholder="nama@email.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-xs text-red-500">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nomor Telepon</label>
                    <div className="relative">
                      <Phone
                        size={17}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                      />
                      <input
                        {...register("phone", {
                          required: "Nomor telepon wajib diisi",
                        })}
                        className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                        placeholder="08xxxxxxxxxx"
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-xs text-red-500">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-border p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <p className="text-xs text-muted">
                  Perubahan hanya disimulasikan pada UI.
                </p>
                <button
                  type="submit"
                  disabled={!isDirty}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Save size={16} />
                  Simpan Perubahan
                </button>
              </div>
            </form>
          ) : (
            /* Security tab */
            <form onSubmit={handlePasswordSubmit(onChangePassword)}>
              <div className="border-b border-border p-5 sm:p-6">
                <h3 className="font-semibold">Keamanan Akun</h3>
                <p className="mt-1 text-sm text-muted">
                  Perbarui password untuk menjaga keamanan akun Anda.
                </p>
              </div>

              <div className="space-y-5 p-5 sm:p-6">
                <div className="flex items-start gap-3 rounded-xl border border-primary/15 bg-primary/5 p-4">
                  <LockKeyhole
                    size={19}
                    className="mt-0.5 shrink-0 text-primary"
                  />
                  <div>
                    <p className="text-sm font-semibold">
                      Gunakan password yang kuat
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-muted">
                      Gunakan kombinasi huruf, angka, dan karakter khusus.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Password Saat Ini
                  </label>
                  <div className="relative">
                    <KeyRound
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      {...registerPassword("currentPassword", {
                        required: "Password saat ini wajib diisi",
                      })}
                      className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-11 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                      placeholder="Masukkan password saat ini"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
                    >
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                  {passwordErrors.currentPassword && (
                    <p className="text-xs text-red-500">
                      {passwordErrors.currentPassword.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Password Baru</label>
                    <input
                      type="password"
                      {...registerPassword("newPassword", {
                        required: "Password baru wajib diisi",
                        minLength: {
                          value: 8,
                          message: "Minimal 8 karakter",
                        },
                      })}
                      className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                      placeholder="Minimal 8 karakter"
                    />
                    {passwordErrors.newPassword && (
                      <p className="text-xs text-red-500">
                        {passwordErrors.newPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Konfirmasi Password
                    </label>
                    <input
                      type="password"
                      {...registerPassword("confirmPassword", {
                        required: "Konfirmasi password wajib diisi",
                        validate: (value) =>
                          value === newPassword ||
                          "Konfirmasi password tidak cocok",
                      })}
                      className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                      placeholder="Ulangi password baru"
                    />
                    {passwordErrors.confirmPassword && (
                      <p className="text-xs text-red-500">
                        {passwordErrors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-border p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <p className="text-xs text-muted">
                  Perubahan hanya disimulasikan pada UI.
                </p>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  <ShieldCheck size={16} />
                  Perbarui Password
                </button>
              </div>
            </form>
          )}
        </section>
      </div>
    </main>
  );
};

export default ProfilePage;
