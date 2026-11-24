<?php

namespace Database\Seeders;

use App\Models\FoundationOfficial;
use Illuminate\Database\Seeder;

class FoundationOfficialSeeder extends Seeder
{
    public function run(): void
    {
        // Ordered from the top of the structure to its members so that every
        // parent already exists (or was created earlier in this run) when a
        // child references it.
        $officials = [
            [
                'name' => 'KH. Abdul Ghofur',
                'position' => 'Pembina',
                'period' => '2025-2030',
                'phone' => '081300000000',
                'email' => 'pembina@yayasan.test',
                'sort_order' => 1,
                'parent_position' => null,
            ],
            [
                'name' => 'Dr. H. Ach. Ubaidillah, S.T., M.T.',
                'position' => 'Ketua Yayasan',
                'period' => '2025-2030',
                'phone' => '081300000001',
                'email' => 'ketua@yayasan.test',
                'sort_order' => 1,
                'parent_position' => 'Pembina',
            ],
            [
                'name' => 'Ahmad Zulkarnain Ibnu Akbar, S.Pd., Gr.',
                'position' => 'Sekretaris',
                'period' => '2025-2030',
                'phone' => '081300000002',
                'email' => 'sekretaris@yayasan.test',
                'sort_order' => 1,
                'parent_position' => 'Ketua Yayasan',
            ],
            [
                'name' => 'Rennyta Devina Sari Putri, M.Pd., Gr.',
                'position' => 'Bendahara',
                'period' => '2025-2030',
                'phone' => '081300000003',
                'email' => 'bendahara@yayasan.test',
                'sort_order' => 2,
                'parent_position' => 'Ketua Yayasan',
            ],
            [
                'name' => 'Nurul Laily, S.Pd., Gr.',
                'position' => 'Anggota',
                'period' => '2025-2030',
                'phone' => '081300000004',
                'email' => 'anggota@yayasan.test',
                'sort_order' => 3,
                'parent_position' => 'Ketua Yayasan',
            ],
        ];

        foreach ($officials as $official) {
            $parentId = $official['parent_position'] === null
                ? null
                : FoundationOfficial::query()
                    ->where('position', $official['parent_position'])
                    ->value('id');

            unset($official['parent_position']);

            FoundationOfficial::updateOrCreate(
                [
                    'name' => $official['name'],
                    'position' => $official['position'],
                ],
                $official + ['parent_id' => $parentId]
            );
        }
    }
}
