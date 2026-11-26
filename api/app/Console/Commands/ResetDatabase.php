<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Throwable;

class ResetDatabase extends Command
{
    /**
     * @var string
     */
    protected $signature = 'db:reset
        {--admin-username= : Username akun admin}
        {--admin-name= : Nama lengkap akun admin}
        {--admin-nip= : NIP akun admin}
        {--admin-password= : Password akun admin (min. 8 karakter)}
        {--no-admin : Hapus semua data tanpa membuat akun admin}
        {--force : Jalankan tanpa konfirmasi interaktif}';

    /**
     * @var string
     */
    protected $description = 'Hapus semua tabel, jalankan ulang migrasi, lalu buat akun admin';

    public function handle(): int
    {
        $withAdmin = ! $this->option('no-admin');

        $username = $this->resolveOption('admin-username', 'DB_RESET_ADMIN_USERNAME', 'admin');
        $name = $this->resolveOption('admin-name', 'DB_RESET_ADMIN_NAME', 'Administrator');
        $nip = $this->resolveOption('admin-nip', 'DB_RESET_ADMIN_NIP', '900000000000000000');
        $password = $this->resolveOption('admin-password', 'DB_RESET_ADMIN_PASSWORD', '');

        if ($withAdmin) {
            $error = $this->validateAdmin($username, $name, $nip, $password);

            if ($error !== null) {
                $this->error($error);

                return self::FAILURE;
            }
        }

        if (! $this->option('force')) {
            if (! $this->input->isInteractive()) {
                $this->error('Mode non-interaktif: tambahkan --force untuk menjalankan reset.');

                return self::FAILURE;
            }

            $this->warn('SEMUA tabel dan data (akun, sesi, nilai, absensi) akan dihapus permanen.');
            $this->line('Database target: '.$this->databaseLabel());

            if ($this->ask('Ketik "RESET" untuk melanjutkan') !== 'RESET') {
                $this->info('Dibatalkan.');

                return self::FAILURE;
            }
        }

        try {
            $this->call('migrate:fresh', ['--force' => true]);
        } catch (Throwable $exception) {
            $this->error('Reset gagal: '.$exception->getMessage());

            return self::FAILURE;
        }

        $generatedPassword = null;

        if ($withAdmin) {
            if ($password === '') {
                $password = Str::password(16, symbols: false);
                $generatedPassword = $password;
            }

            User::create([
                'nip' => $nip,
                'username' => $username,
                'password' => Hash::make($password),
                'full_name' => $name,
                'role' => 'admin',
                'is_active' => true,
            ]);
        }

        $this->call('optimize:clear');

        $this->newLine();
        $this->components->info('Database berhasil di-reset.');

        if ($withAdmin) {
            $this->components->twoColumnDetail('Username', $username);
            $this->components->twoColumnDetail('Nama', $name);
            $this->components->twoColumnDetail('NIP', $nip);
            $this->components->twoColumnDetail(
                'Password',
                $generatedPassword ?? '(sesuai yang Anda masukkan)'
            );

            if ($generatedPassword !== null) {
                $this->components->warn('Simpan password di atas sekarang; password tidak ditampilkan lagi.');
            }
        } else {
            $this->components->warn('Tidak ada akun yang dibuat. Saat container API start, db:seed-if-empty akan mengisi data demo karena tabel users kosong.');
        }

        return self::SUCCESS;
    }

    private function resolveOption(string $option, string $env, string $default): string
    {
        $value = $this->option($option);

        if (is_string($value) && $value !== '') {
            return $value;
        }

        $envValue = getenv($env);

        if (is_string($envValue) && $envValue !== '') {
            return $envValue;
        }

        return $default;
    }

    private function validateAdmin(string $username, string $name, string $nip, string $password): ?string
    {
        if (! preg_match('/^[A-Za-z0-9._-]{3,50}$/', $username)) {
            return 'Username admin harus 3-50 karakter dan hanya boleh berisi huruf, angka, titik, garis bawah, atau strip.';
        }

        if ($name === '' || Str::length($name) > 100) {
            return 'Nama admin wajib diisi dan maksimal 100 karakter.';
        }

        if ($nip === '' || Str::length($nip) > 255) {
            return 'NIP admin wajib diisi dan maksimal 255 karakter.';
        }

        if ($password !== '' && Str::length($password) < 8) {
            return 'Password admin minimal 8 karakter.';
        }

        return null;
    }

    private function databaseLabel(): string
    {
        $connection = config('database.default');

        return sprintf(
            '%s / %s',
            $connection,
            config("database.connections.{$connection}.database") ?? '?'
        );
    }
}
