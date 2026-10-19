<!doctype html>
<html lang="id">

<head>
    <meta charset="UTF-8">

    <title>Laporan Hasil Belajar (Rapor)</title>

    <style>
        @page {
            margin: 25px 30px;
        }

        body {
            font-family: DejaVu Sans, sans-serif;
            color: #000;
            font-size: 10px;
            line-height: 1.4;
        }

        h2 {
            text-align: center;
            margin-bottom: 20px;
            font-size: 16pt;
        }

        .header-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }

        .header-table td {
            padding: 3px 5px;
            vertical-align: top;
        }

        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
        }

        .data-table,
        .data-table th,
        .data-table td {
            border: 1px solid #000;
        }

        .data-table th,
        .data-table td {
            padding: 6px;
            vertical-align: top;
        }

        .data-table th {
            text-align: center;
            background-color: #f2f2f2;
        }

        .center {
            text-align: center;
        }

        .sub-header {
            font-weight: bold;
            background-color: #e6e6e6;
        }

        .student-name {
            font-weight: bold;
        }

        .signature-table {
            width: 100%;
            margin-top: 30px;
            border-collapse: collapse;
        }

        .signature-table td {
            text-align: center;
            vertical-align: top;
            padding: 10px;
        }

        .space-signature {
            height: 70px;
        }
    </style>
</head>

<body>

    <h2>
        LAPORAN HASIL BELAJAR<br>
        (RAPOR)
    </h2>


    {{-- =========================================================
         IDENTITAS SISWA
    ========================================================== --}}

    <table class="header-table">

        <tr>
            <td width="18%">Nama Peserta Didik</td>
            <td width="2%">:</td>
            <td width="40%" class="student-name">
                {{ $student->full_name }}
            </td>

            <td width="15%">Kelas</td>
            <td width="2%">:</td>
            <td width="23%">
                {{ $schoolClass->name }}
            </td>
        </tr>

        <tr>
            <td>NISN</td>
            <td>:</td>
            <td>
                {{ $student->nisn }}
            </td>

            <td>Fase</td>
            <td>:</td>
            <td>
                -
            </td>
        </tr>

        <tr>
            <td>Sekolah</td>
            <td>:</td>
            <td>
                SMP ISLAM ANNIDOMIYAH
            </td>

            <td>Semester</td>
            <td>:</td>
            <td>
                {{ $academicYear->semester }}
            </td>
        </tr>

        <tr>
            <td>Alamat</td>
            <td>:</td>
            <td>
                -
            </td>

            <td>Tahun Pelajaran</td>
            <td>:</td>
            <td>
                {{ $academicYear->year_name }}
            </td>
        </tr>

    </table>


    {{-- =========================================================
         NILAI MATA PELAJARAN
    ========================================================== --}}

    <table class="data-table">

        <thead>
            <tr>
                <th width="5%">No</th>
                <th width="30%">Muatan Pelajaran</th>
                <th width="10%">Nilai Akhir</th>
                <th width="55%">Capaian Kompetensi</th>
            </tr>
        </thead>

        <tbody>

            @forelse ($subjects as $index => $subject)

            <tr>

                <td class="center">
                    {{ $index + 1 }}
                </td>

                <td>
                    {{ $subject['name'] }}
                </td>

                <td class="center">
                    {{ $subject['final_score'] ?? '-' }}
                </td>

                <td>

                    @if ($subject['notes']->isNotEmpty())

                    @foreach ($subject['notes'] as $note)

                    Ananda
                    {{ $student->full_name }}
                    menunjukkan perkembangan dalam pembelajaran
                    {{ $subject['name'] }}
                    dengan catatan:
                    {{ $note }}.

                    @if (!$loop->last)
                    <br><br>
                    @endif

                    @endforeach

                    @else

                    Belum terdapat catatan guru.

                    @endif

                </td>

            </tr>

            @empty

            <tr>
                <td colspan="4" class="center">
                    Belum terdapat data mata pelajaran.
                </td>
            </tr>

            @endforelse

        </tbody>

    </table>


    {{-- =========================================================
         TANDA TANGAN
    ========================================================== --}}

    <table class="signature-table">

        <tr>

            <td width="33%">

                <br>

                Orang Tua / Wali,

                <div class="space-signature"></div>

                <strong>
                    ______________________
                </strong>

            </td>


            <td width="33%"></td>


            <td width="34%">

                <br>

                Wali Kelas

                <div class="space-signature"></div>

                <strong>
                    ______________________
                </strong>

            </td>

        </tr>


        <tr>

            <td colspan="3">

                Mengetahui,<br>

                Kepala Sekolah

                <div class="space-signature"></div>

                <strong>
                    ______________________
                </strong>

            </td>

        </tr>

    </table>

</body>

</html>