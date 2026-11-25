import { useEffect, useState } from "react";
import { LockKeyhole, UserRound } from "lucide-react";

import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";

import Button from "@/shared/ui/button/Button";
import Input from "@/shared/ui/form/Input";
import { toast } from "@/shared/ui/feedback/toast";
import getHomePath from "@/shared/lib/homePath";

import useAuth from "@/features/auth/hooks/useAuth";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user, loading, isAuthenticated } = useAuth();

  const [hasJustLoggedIn, setHasJustLoggedIn] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  useEffect(() => {
    if (loading || !isAuthenticated || !user) return;
    if (hasJustLoggedIn) return;

    toast.info(`Anda sudah masuk sebagai ${user.full_name}.`);
    navigate(getHomePath(user.role), { replace: true });
  }, [loading, isAuthenticated, user, hasJustLoggedIn, navigate]);

  useEffect(() => {
    if (loading || isAuthenticated) return;
    if (!location.state?.from) return;

    toast.warning("Sesi Anda berakhir. Silakan masuk untuk melanjutkan.");
  }, [loading, isAuthenticated, location.state]);

  const onSubmit = async (data) => {
    try {
      const loggedInUser = await login(data);

      setHasJustLoggedIn(true);
      toast.success(
        `Berhasil masuk. Selamat datang, ${loggedInUser.full_name}.`,
      );
      navigate(getHomePath(loggedInUser.role), { replace: true });
    } catch (error) {
      const serverErrors = error.response?.data?.errors;

      if (serverErrors?.username) {
        setError("username", {
          type: "server",
          message: serverErrors.username[0],
        });
      }

      if (serverErrors?.password) {
        setError("password", {
          type: "server",
          message: serverErrors.password[0],
        });
      }

      if (serverErrors?.failed) {
        toast.danger("Username / Password salah!");
        return;
      }

      toast.danger(
        error.response?.data?.message ?? "Gagal masuk. Silakan coba lagi.",
      );
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
        <p className="text-sm text-muted">Memeriksa sesi...</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            E-Raport
          </h1>

          <p className="mt-1 text-sm text-muted">
            Sistem Pendamping Perkembangan Pembelajaran
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-card-foreground">
              Selamat Datang
            </h2>

            <p className="mt-1 text-sm text-muted">
              Masuk untuk melanjutkan ke sistem.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Username"
              type="text"
              placeholder="Masukkan username"
              icon={UserRound}
              autoComplete="username"
              {...register("username")}
              error={errors.username?.message}
            />

            <Input
              label="Password"
              type="password"
              placeholder="Masukkan password"
              icon={LockKeyhole}
              autoComplete="current-password"
              {...register("password")}
              error={errors.password?.message}
            />

            <Button
              type="submit"
              className="w-full"
              size="L"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Memproses..." : "Masuk"}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-muted">
          © 2026 E-Raport Pendamping
        </p>
      </div>
    </main>
  );
};

export default LoginPage;
