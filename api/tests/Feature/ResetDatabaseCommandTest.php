<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class ResetDatabaseCommandTest extends TestCase
{
    use DatabaseMigrations;

    public function test_it_drops_all_data_and_creates_a_single_admin(): void
    {
        User::create([
            'nip' => '111111111111111111',
            'username' => 'guru.lama',
            'password' => Hash::make('password'),
            'full_name' => 'Guru Lama',
            'role' => 'teacher',
            'is_active' => true,
        ]);

        $this->artisan('db:reset', [
            '--force' => true,
            '--admin-username' => 'owner',
            '--admin-name' => 'Owner Sekolah',
            '--admin-nip' => '999999999999999999',
            '--admin-password' => 'rahasia123',
        ])->assertSuccessful();

        $this->assertDatabaseCount('users', 1);
        $this->assertDatabaseMissing('users', ['username' => 'guru.lama']);

        $admin = User::where('username', 'owner')->firstOrFail();

        $this->assertSame('admin', $admin->role);
        $this->assertTrue($admin->is_active);
        $this->assertTrue(Hash::check('rahasia123', $admin->password));
    }

    public function test_it_rejects_an_admin_password_that_is_too_short(): void
    {
        $this->artisan('db:reset', [
            '--force' => true,
            '--admin-password' => 'short',
        ])->assertFailed();

        $this->assertDatabaseCount('users', 0);
    }
}
