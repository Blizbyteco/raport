<?php

namespace Database\Seeders;

use App\Models\FoundationOfficial;
use Illuminate\Database\Seeder;

class FoundationOfficialSeeder extends Seeder
{
    public function run(): void
    {
        $officials = [
            [
                'name' => 'Dr. H. Ach. Ubaidillah, S.T., M.T.',
                'position' => 'Ketua Yayasan',
                'period' => '2025-2030',
                'phone' => '081300000001',
                'email' => 'ketua@yayasan.test',
                'sort_order' => 1,
            ],
            [
                'name' => 'Ahmad Zulkarnain Ibnu Akbar, S.Pd., Gr.',
                'position' => 'Sekretaris',
                'period' => '2025-2030',
                'phone' => '081300000002',
                'email' => 'sekretaris@yayasan.test',
                'sort_order' => 2,
            ],
            [
                'name' => 'Rennyta Devina Sari Putri, M.Pd., Gr.',
                'position' => 'Bendahara',
                'period' => '2025-2030',
                'phone' => '081300000003',
                'email' => 'bendahara@yayasan.test',
                'sort_order' => 3,
            ],
            [
                'name' => 'Nurul Laily, S.Pd., Gr.',
                'position' => 'Anggota',
                'period' => '2025-2030',
                'phone' => '081300000004',
                'email' => 'anggota@yayasan.test',
                'sort_order' => 4,
            ],
        ];

        foreach ($officials as $official) {
            FoundationOfficial::updateOrCreate(
                [
                    'name' => $official['name'],
                    'position' => $official['position'],
                ],
                $official
            );
        }
    }
}
