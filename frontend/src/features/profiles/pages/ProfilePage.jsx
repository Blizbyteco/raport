import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  BadgeCheck,
  BriefcaseBusiness,
  KeyRound,
  LockKeyhole,
  Save,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import useAuth from "@/features/auth/hooks/useAuth";
import useProfile from "@/features/profiles/hooks/useProfile";
import {
  useUpdatePassword,
  useUpdateProfile,
} from "@/features/profiles/hooks/useProfileMutations";
import Button from "@/shared/ui/button/Button";
import Alert from "@/shared/ui/feedback/Alert";
import Input from "@/shared/ui/form/Input";

const roleLabel = {
  admin: "Administrator",
  teacher: "Guru",
  leader: "Pimpinan",
};

const getInitials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

const getErrorMessage = (error) => {
  const data = error?.response?.data;

  if (data?.message) {
    return data.message;
  }

  const firstError = Object.values(data?.errors ?? {})[0]?.[0];

  return firstError ?? "Terjadi kesalahan. Silakan coba lagi.";
};

const ProfilePage = () => {
  const { user } = useAuth();
  const { data: profileData } = useProfile();
  const [activeTab, setActiveTab] = useState("profile");
  const [feedback, setFeedback] = useState(null);
  const [updatedProfile, setUpdatedProfile] = useState(null);

  const profile = {
    ...(user ?? {}),
    ...(profileData ?? {}),
    ...(updatedProfile ?? {}),
  };

  const updateProfileMutation = useUpdateProfile();
  const updatePasswordMutation = useUpdatePassword();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      full_name: user?.full_name ?? "",
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    watch,
    reset: resetPassword,
    setError: setPasswordError,
    formState: { errors: passwordErrors },
  } = useForm({
    defaultValues: {
      current_password: "",
      password: "",
      password_confirmation: "",
    },
  });

  const newPassword = watch("password");

  useEffect(() => {
    if (profileData?.full_name && !isDirty) {
      reset({ full_name: profileData.full_name });
    }
  }, [profileData, isDirty, reset]);

  const setValidationErrors = (error, setFieldError) => {
    const validationErrors = error?.response?.data?.errors;

    if (!validationErrors) return;

    Object.entries(validationErrors).forEach(([field, messages]) => {
      if (messages?.[0]) {
        setFieldError(field, { message: messages[0] });
      }
    });
  };

  const onSaveProfile = (values) => {
    setFeedback(null);

    updateProfileMutation.mutate(
      { full_name: values.full_name },
      {
        onSuccess: (response) => {
          const updated = response?.data ?? response;

          setUpdatedProfile((previous) => ({
            ...(previous ?? {}),
            ...updated,
          }));
          reset({ full_name: updated?.full_name ?? values.full_name });
          setFeedback({
            type: "success",
            message: response?.message ?? "Profil berhasil diperbarui.",
          });
        },
        onError: (error) => {
          setFeedback({ type: "danger", message: getErrorMessage(error) });
          setValidationErrors(error, setError);
        },
      },
    );
  };

  const onChangePassword = (values) => {
    setFeedback(null);

    updatePasswordMutation.mutate(values, {
      onSuccess: (response) => {
        resetPassword();
        setFeedback({
          type: "success",
          message: response?.message ?? "Password berhasil diperbarui.",
        });
      },
      onError: (error) => {
        setFeedback({ type: "danger", message: getErrorMessage(error) });
        setValidationErrors(error, setPasswordError);
      },
    });
  };

  const tabs = [
    { id: "profile", label: "Informasi Profil", icon: UserRound },
    { id: "security", label: "Keamanan", icon: ShieldCheck },
  ];

  return (
    <main className="min-h-screen space-y-6 bg-background text-dark">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Profile Saya</h1>
        <p className="text-sm text-muted">
          Kelola informasi akun dan pengaturan keamanan Anda.
        </p>
      </div>

      <section className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="h-28 bg-primary/10 sm:h-36" />

        <div className="px-5 pb-5 sm:px-7">
          <div className="-mt-10 flex flex-col gap-4 sm:-mt-12 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <div className="flex size-20 shrink-0 items-center justify-center rounded-2xl border-4 border-card bg-primary text-2xl font-bold text-white sm:size-24">
                {getInitials(profile?.full_name ?? user?.full_name) || "?"}
              </div>

              <div className="min-w-0 pb-1">
                <h2 className="truncate text-xl font-bold">
                  {profile?.full_name ?? user?.full_name ?? "-"}
                </h2>
                <p className="text-sm text-muted">
                  @{profile?.username ?? user?.username ?? "-"}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:pb-1">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
                <BriefcaseBusiness size={14} />
                {roleLabel[user?.role] ?? "Pengguna"}
              </span>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted">
            {profile?.nip && (
              <span className="inline-flex items-center gap-1.5">
                <BadgeCheck size={14} />
                NIP: {profile.nip}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5">
              <KeyRound size={14} />
              ID Akun: {profile?.id ?? user?.id ?? "-"}
            </span>
          </div>
        </div>
      </section>

      {feedback && (
        <Alert
          type={feedback.type}
          message={feedback.message}
          onClose={() => setFeedback(null)}
        />
      )}

      <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
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
                  setFeedback(null);
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
                  <Input
                    label="Nama Lengkap"
                    required
                    icon={UserRound}
                    placeholder="Masukkan nama lengkap"
                    error={errors.full_name?.message}
                    {...register("full_name", {
                      required: "Nama lengkap wajib diisi",
                      maxLength: {
                        value: 100,
                        message: "Nama lengkap maksimal 100 karakter",
                      },
                    })}
                  />

                  <Input
                    label="Username"
                    value={profile?.username ?? user?.username ?? ""}
                    readOnly
                    disabled
                  />

                  <Input
                    label="NIP"
                    value={profile?.nip ?? "-"}
                    readOnly
                    disabled
                  />

                  <Input
                    label="Role"
                    value={roleLabel[user?.role] ?? "Pengguna"}
                    readOnly
                    disabled
                  />
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-border p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <p className="text-xs text-muted">
                  Perubahan profil disimpan langsung ke server.
                </p>

                <Button
                  type="submit"
                  icon={Save}
                  isLoading={updateProfileMutation.isPending}
                  disabled={!isDirty || updateProfileMutation.isPending}
                >
                  Simpan Perubahan
                </Button>
              </div>
            </form>
          ) : (
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

                <Input
                  label="Password Saat Ini"
                  required
                  type="password"
                  icon={KeyRound}
                  autoComplete="current-password"
                  placeholder="Masukkan password saat ini"
                  error={passwordErrors.current_password?.message}
                  {...registerPassword("current_password", {
                    required: "Password saat ini wajib diisi",
                  })}
                />

                <div className="grid gap-5 sm:grid-cols-2">
                  <Input
                    label="Password Baru"
                    required
                    type="password"
                    autoComplete="new-password"
                    placeholder="Minimal 8 karakter"
                    error={passwordErrors.password?.message}
                    {...registerPassword("password", {
                      required: "Password baru wajib diisi",
                      minLength: {
                        value: 8,
                        message: "Minimal 8 karakter",
                      },
                    })}
                  />

                  <Input
                    label="Konfirmasi Password"
                    required
                    type="password"
                    autoComplete="new-password"
                    placeholder="Ulangi password baru"
                    error={passwordErrors.password_confirmation?.message}
                    {...registerPassword("password_confirmation", {
                      required: "Konfirmasi password wajib diisi",
                      validate: (value) =>
                        value === newPassword ||
                        "Konfirmasi password tidak cocok",
                    })}
                  />
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-border p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <p className="text-xs text-muted">
                  Password baru akan langsung aktif setelah disimpan.
                </p>

                <Button
                  type="submit"
                  icon={ShieldCheck}
                  isLoading={updatePasswordMutation.isPending}
                >
                  Perbarui Password
                </Button>
              </div>
            </form>
          )}
        </section>
      </div>
    </main>
  );
};

export default ProfilePage;
