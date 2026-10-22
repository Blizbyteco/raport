<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $teachers = [
            [
                'nip' => '900000000000000001',
                'username' => 'ach.ubaidillah',
                'full_name' => 'Dr.H. ACH. UBAIDILLAH,ST.MT.',
            ],
            [
                'nip' => '900000000000000002',
                'username' => 'ahmad.zulkarnain',
                'full_name' => 'AHMAD ZULKARNAIN IBNU AKBAR, S.Pd.,Gr.',
            ],
            [
                'nip' => '900000000000000003',
                'username' => 'dewi.rahmawati',
                'full_name' => 'DEWI RAHMAWATI, S.Pd.,Gr',
            ],
            [
                'nip' => '900000000000000004',
                'username' => 'ach.lutfi.mubarok',
                'full_name' => 'ACH. LUTFI MUBAROK NUR, S.Pd.',
            ],
            [
                'nip' => '900000000000000005',
                'username' => 'nurul.laily',
                'full_name' => 'NURUL LAILY, S.Pd.,Gr.',
            ],
            [
                'nip' => '900000000000000006',
                'username' => 'rennyta.devina',
                'full_name' => 'RENNYTA DEVINA SARI PUTRI, M.Pd.,Gr.',
            ],
            [
                'nip' => '900000000000000007',
                'username' => 'yaumalisa.indah',
                'full_name' => 'YAUMALISA INDAH PURNAMAWATI, S.Pd.,Gr.',
            ],
            [
                'nip' => '900000000000000008',
                'username' => 'moh.rizqiyadi',
                'full_name' => 'MOH. RIZQIYADI, S.Pd',
            ],
            [
                'nip' => '900000000000000009',
                'username' => 'maghfiroh.romadhoni',
                'full_name' => 'MAGHFIROH ROMADHONI, S.Mat., Gr.',
            ],
            [
                'nip' => '900000000000000010',
                'username' => 'ledy.novia',
                'full_name' => 'LEDY NOVIA SRIDIARSIH, S.Pd., Gr.',
            ],
            [
                'nip' => '900000000000000011',
                'username' => 'a.zainur.rofieq',
                'full_name' => 'A. ZAINUR ROFIEQ, S.Pd.',
            ],
            [
                'nip' => '900000000000000012',
                'username' => 'rahmat.rifaldi',
                'full_name' => 'RAHMAT RIFALDI ALKAUSAR, S.Si., Gr.',
            ],
            [
                'nip' => '900000000000000013',
                'username' => 'memes.linda.ayu',
                'full_name' => 'MEMES LINDA AYU, S.Pd.,Gr.',
            ],
            [
                'nip' => '900000000000000014',
                'username' => 'rohimatul.maisyatoh',
                'full_name' => 'ROHIMATUL MAISYAROH, S.Kom',
            ],
            [
                'nip' => '900000000000000015',
                'username' => 'feri.irawan',
                'full_name' => 'FERI IRAWAN, S.Pd., Gr.',
            ],
        ];

        foreach ($teachers as $teacher) {
            User::updateOrCreate(
                [
                    'nip' => $teacher['nip'],
                ],
                [
                    'username' => $teacher['username'],
                    'password' => Hash::make('password'),
                    'full_name' => $teacher['full_name'],
                    'role' => 'teacher',
                    'is_active' => true,
                ]
            );
        }

        User::updateOrCreate(
            [
                'username' => 'admin',
            ],
            [
                'nip' => '900000000000000000',
                'password' => Hash::make('password'),
                'full_name' => 'Administrator',
                'role' => 'admin',
                'is_active' => true,
            ]
        );
    }
}
