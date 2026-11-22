<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\AttendanceDetail;
use App\Models\ClassSubject;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class AttendanceController extends Controller
{
    private const STATUSES = ['present', 'permission', 'sick', 'absent'];

    public function index(Request $request, ClassSubject $classSubject): JsonResponse
    {
        $classSubject->load(['subject', 'schoolClass', 'teacher']);

        $attendances = Attendance::query()
            ->where('class_subject_id', $classSubject->id)
            ->withCount([
                'details as total_students',
                'details as present' => fn ($query) => $query->where('status', 'present'),
                'details as permission' => fn ($query) => $query->where('status', 'permission'),
                'details as sick' => fn ($query) => $query->where('status', 'sick'),
                'details as absent' => fn ($query) => $query->where('status', 'absent'),
            ])
            ->when($request->filled('search'), function ($query) use ($request) {
                $search = $request->string('search')->toString();

                $query->where(function ($query) use ($search) {
                    $query->where('topic', 'like', "%{$search}%")
                        ->orWhere('notes', 'like', "%{$search}%");
                });
            })
            ->when($request->filled('month'), function ($query) use ($request) {
                $query->whereMonth('date', (int) $request->input('month'));
            })
            ->orderByDesc('date')
            ->get()
            ->map(fn (Attendance $attendance) => $this->summary($attendance));

        return response()->json([
            'meta' => $this->meta($classSubject),
            'data' => $attendances,
        ]);
    }

    public function store(Request $request, ClassSubject $classSubject): JsonResponse
    {
        $validated = $this->validatePayload($request);

        $exists = Attendance::query()
            ->where('class_subject_id', $classSubject->id)
            ->whereDate('date', $validated['date'])
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'Absensi untuk tanggal tersebut sudah ada.',
            ], 422);
        }

        $this->ensureStudentsBelongToClass($classSubject, $validated['attendance']);

        $attendance = DB::transaction(function () use ($validated, $classSubject) {
            $attendance = Attendance::create([
                'class_subject_id' => $classSubject->id,
                'date' => $validated['date'],
                'meeting_number' => $validated['meeting_number'] ?? null,
                'topic' => $validated['topic'] ?? null,
                'notes' => $validated['notes'] ?? null,
            ]);

            foreach ($validated['attendance'] as $item) {
                AttendanceDetail::create([
                    'attendance_id' => $attendance->id,
                    'student_id' => $item['student_id'],
                    'status' => $item['status'],
                    'note' => $item['note'] ?? null,
                ]);
            }

            return $attendance;
        });

        return response()->json([
            'message' => 'Absensi berhasil disimpan.',
            'data' => $this->detail($attendance),
        ], 201);
    }

    public function show(Attendance $attendance): JsonResponse
    {
        return response()->json([
            'data' => $this->detail($attendance),
        ]);
    }

    public function update(Request $request, Attendance $attendance): JsonResponse
    {
        $validated = $this->validatePayload($request);

        $this->ensureStudentsBelongToClass(
            $attendance->classSubject,
            $validated['attendance']
        );

        DB::transaction(function () use ($validated, $attendance) {
            $attendance->update([
                'date' => $validated['date'],
                'meeting_number' => $validated['meeting_number'] ?? null,
                'topic' => $validated['topic'] ?? null,
                'notes' => $validated['notes'] ?? null,
            ]);

            $studentIds = collect($validated['attendance'])
                ->pluck('student_id')
                ->all();

            $attendance->details()
                ->whereNotIn('student_id', $studentIds)
                ->delete();

            foreach ($validated['attendance'] as $item) {
                AttendanceDetail::updateOrCreate(
                    [
                        'attendance_id' => $attendance->id,
                        'student_id' => $item['student_id'],
                    ],
                    [
                        'status' => $item['status'],
                        'note' => $item['note'] ?? null,
                    ]
                );
            }
        });

        return response()->json([
            'message' => 'Absensi berhasil diperbarui.',
            'data' => $this->detail($attendance->fresh()),
        ]);
    }

    public function destroy(Attendance $attendance): JsonResponse
    {
        $attendance->delete();

        return response()->json([
            'message' => 'Absensi berhasil dihapus.',
        ]);
    }

    private function validatePayload(Request $request): array
    {
        return $request->validate([
            'date' => ['required', 'date'],
            'meeting_number' => ['nullable', 'integer', 'min:1'],
            'topic' => ['nullable', 'string', 'max:150'],
            'notes' => ['nullable', 'string'],
            'attendance' => ['required', 'array', 'min:1'],
            'attendance.*.student_id' => ['required', 'integer', 'exists:students,id'],
            'attendance.*.status' => ['required', Rule::in(self::STATUSES)],
            'attendance.*.note' => ['nullable', 'string'],
        ]);
    }

    private function ensureStudentsBelongToClass(
        ClassSubject $classSubject,
        array $attendance
    ): void {
        $allowed = $classSubject->schoolClass
            ->classStudents()
            ->where('academic_year_id', $classSubject->academic_year_id)
            ->where('status', 'AKTIF')
            ->pluck('student_id');

        $submitted = collect($attendance)->pluck('student_id');

        if ($submitted->diff($allowed)->isNotEmpty()) {
            abort(422, 'Terdapat siswa yang bukan anggota kelas ini.');
        }
    }

    private function meta(ClassSubject $classSubject): array
    {
        return [
            'id' => $classSubject->id,
            'subject' => [
                'id' => $classSubject->subject->id,
                'name' => $classSubject->subject->name,
            ],
            'classroom' => [
                'id' => $classSubject->schoolClass->id,
                'name' => $classSubject->schoolClass->name,
                'grade_level' => $classSubject->schoolClass->grade_level,
            ],
            'teacher' => [
                'id' => $classSubject->teacher?->id,
                'full_name' => $classSubject->teacher?->full_name,
            ],
        ];
    }

    private function summary(Attendance $attendance): array
    {
        return [
            'id' => $attendance->id,
            'date' => $attendance->date?->toDateString(),
            'meeting_number' => $attendance->meeting_number,
            'topic' => $attendance->topic,
            'notes' => $attendance->notes,
            'total_students' => $attendance->total_students ?? 0,
            'present' => $attendance->present ?? 0,
            'permission' => $attendance->permission ?? 0,
            'sick' => $attendance->sick ?? 0,
            'absent' => $attendance->absent ?? 0,
        ];
    }

    private function detail(Attendance $attendance): array
    {
        $attendance->load([
            'classSubject.subject',
            'classSubject.schoolClass',
            'classSubject.teacher',
            'details.student',
        ]);

        return [
            'id' => $attendance->id,
            'date' => $attendance->date?->toDateString(),
            'meeting_number' => $attendance->meeting_number,
            'topic' => $attendance->topic,
            'notes' => $attendance->notes,
            'class_subject' => [
                'id' => $attendance->classSubject->id,
                'subject' => [
                    'id' => $attendance->classSubject->subject->id,
                    'name' => $attendance->classSubject->subject->name,
                ],
                'classroom' => [
                    'id' => $attendance->classSubject->schoolClass->id,
                    'name' => $attendance->classSubject->schoolClass->name,
                ],
            ],
            'details' => $attendance->details->map(fn (AttendanceDetail $detail) => [
                'id' => $detail->id,
                'student_id' => $detail->student_id,
                'status' => $detail->status,
                'note' => $detail->note,
                'student' => [
                    'id' => $detail->student?->id,
                    'nisn' => $detail->student?->nisn,
                    'full_name' => $detail->student?->full_name,
                ],
            ])->values(),
        ];
    }
}
