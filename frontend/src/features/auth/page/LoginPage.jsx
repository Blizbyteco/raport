import { useState } from "react";
import { LockKeyhole, UserRound } from "lucide-react";

import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

import Button from "@/shared/ui/button/Button";
import Input from "@/shared/ui/form/Input";
import Alert from "@/shared/ui/feedback/Alert";

import useAuth from "@/features/auth/hooks/useAuth";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showAlert, setShowAlert] = useState(false);

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

  const onSubmit = async (data) => {
    setShowAlert(false);

    try {
      const user = await login(data);

      if (user.role === "admin") {
        navigate("/dashboard", { replace: true });
        return;
      }

      if (user.role === "teacher") {
        navigate("/teacher", { replace: true });
      }
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
        setShowAlert(true);
      }
    }
  };

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

          {showAlert && (
            <div className="mt-4">
              <Alert
                type="error"
                message="Username / Password salah!"
                duration={3000}
                onClose={() => setShowAlert(false)}
              />
            </div>
          )}
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
