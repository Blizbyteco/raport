```blade
<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">

    <style>
        @page {
            margin: 25px 30px;
        }

        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 10px;
            color: #111;
        }

        .header {
            text-align: center;
            margin-bottom: 20px;
        }

        .school-name {
            font-size: 18px;
            font-weight: bold;
            text-transform: uppercase;
        }

        .report-title {
            font-size: 14px;
            font-weight: bold;
            margin-top: 5px;
        }

        .identity {
            width: 100%;
            margin-bottom: 15px;
        }

        .identity td {
            padding: 3px 0;
            vertical-align: top;
        }

        .identity .label {
            width: 100px;
            font-weight: bold;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th,
        td {
            border: 1px solid #333;
            padding: 6px;
        }

        th {
            text-align: center;
            font-weight: bold;
            background: #f2f2f2;
        }

        .center {
            text-align: center;
        }

        .student-section {
            page-break-before: always;
        }

        .student-section:first-of-type {
            page-break-before: avoid;
        }

        .student-title {
            font-size: 13px;
            font-weight: bold;
            margin-bottom: 10px;
        }

        .summary {
            width: 100%;
            margin-bottom: 12px;
        }

        .summary td {
            border: none;
            padding: 2px 0;
        }

        .summary .label {
            width: 100px;
            font-weight: bold;
        }

        .signature {
            width: 100%;
            margin-top: 35px;
        }

        .signature td {
            border: none;
            text-align: center;
            vertical-align: top;
        }
    </style>
</head>

<body>

    {{-- HEADER --}}
    <div class="header">
        <div class="school-name">
            SMP ISLAM ANNIDOMIYAH
        </div>

        <div class="report-title">
            LAPORAN PERKEMBANGAN PEMBELAJARAN SISWA
        </div>
    </div>

    {{-- IDENTITAS --}}
    <table class="identity">
        <tr>
            <td class="label">Tahun Ajaran</td>
            <td>: {{ $classSubject->academicYear->year_name }}</td>

            <td class="label">Kelas</td>
            <td>: {{ $classSubject->schoolClass->name }}</td>
        </tr>

        <tr>
            <td class="label">Semester</td>
            <td>: {{ $classSubject->academicYear->semester }}</td>

            <td class="label">Mata Pelajaran</td>
            <td>: {{ $classSubject->subject->name }}</td>
        </tr>

        <tr>
            <td class="label">Guru</td>
            <td colspan="3">
                : {{ $classSubject->teacher->full_name }}
            </td>
        </tr>
    </table>

    {{-- REKAP SELURUH SISWA --}}
    <h3>Rekap Perkembangan Siswa</h3>

    <table>
        <thead>
            <tr>
                <th width="35">No</th>
                <th>Nama Siswa</th>
                <th width="80">Pembelajaran</th>
                <th width="70">Dinilai</th>
                <th width="70">Rata-rata</th>
                <th width="70">Terendah</th>
                <th width="70">Tertinggi</th>
            </tr>
        </thead>

        <tbody>
            @forelse ($students as $index => $item)
            <tr>
                <td class="center">
                    {{ $index + 1 }}
                </td>

                <td>
                    {{ $item['student']->full_name }}
                </td>

                <td class="center">
                    {{ $item['lesson_count'] }}
                </td>

                <td class="center">
                    {{ $item['assessed_count'] }}
                </td>

                <td class="center">
                    {{ $item['average'] ?? '-' }}
                </td>

                <td class="center">
                    {{ $item['lowest'] ?? '-' }}
                </td>

                <td class="center">
                    {{ $item['highest'] ?? '-' }}
                </td>
            </tr>
            @empty
            <tr>
                <td colspan="7" class="center">
                    Belum ada data siswa.
                </td>
            </tr>
            @endforelse
        </tbody>
    </table>


    {{-- DETAIL PER SISWA --}}
    @foreach ($students as $item)

    <div class="student-section">

        <div class="student-title">
            Detail Perkembangan Siswa
        </div>

        <table class="summary">
            <tr>
                <td class="label">Nama</td>
                <td>: {{ $item['student']->full_name }}</td>
            </tr>

            <tr>
                <td class="label">NISN</td>
                <td>: {{ $item['student']->nisn }}</td>
            </tr>

            <tr>
                <td class="label">Rata-rata</td>
                <td>: {{ $item['average'] ?? '-' }}</td>
            </tr>
        </table>

        <table>
            <thead>
                <tr>
                    <th width="35">No</th>
                    <th width="80">Tanggal</th>
                    <th>Materi</th>
                    <th width="60">Nilai</th>
                    <th>Catatan Guru</th>
                </tr>
            </thead>

            <tbody>
                @forelse ($item['lessons'] as $lessonIndex => $lesson)
                <tr>
                    <td class="center">
                        {{ $lessonIndex + 1 }}
                    </td>

                    <td class="center">
                        {{ \Carbon\Carbon::parse($lesson['date'])->format('d/m/Y') }}
                    </td>

                    <td>
                        {{ $lesson['material'] }}
                    </td>

                    <td class="center">
                        {{ $lesson['score'] ?? '-' }}
                    </td>

                    <td>
                        {{ $lesson['note'] ?? '-' }}
                    </td>
                </tr>
                @empty
                <tr>
                    <td colspan="5" class="center">
                        Belum ada data pembelajaran.
                    </td>
                </tr>
                @endforelse
            </tbody>
        </table>

    </div>

    @endforeach

</body>

</html>
```