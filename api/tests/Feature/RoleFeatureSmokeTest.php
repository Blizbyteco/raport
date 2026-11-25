<?php

namespace Tests\Feature;

use App\Models\AcademicYear;
use App\Models\Attendance;
use App\Models\ClassSubject;
use App\Models\DailyLesson;
use App\Models\Extracurricular;
use App\Models\SchoolClass;
use App\Models\Student;
use App\Models\Subject;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RoleFeatureSmokeTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);
        Extracurricular::create([
            'name' => 'QA Seed Extracurricular',
            'description' => 'Seeded for smoke coverage',
            'is_active' => true,
        ]);
    }

    private function callEndpoint(string $method, string $url, array $payload = [], int $status = 200): array
    {
        $response = $this->{$method.'Json'}($url, $payload);

        if ($response->status() !== $status) {
            $this->fail(sprintf(
                '%s %s expected %d got %d: %s',
                strtoupper($method),
                $url,
                $status,
                $response->status(),
                mb_substr($response->getContent(), 0, 2000),
            ));
        }

        return $response->json() ?? [];
    }

    private function academicYearPayload(string $startYear, bool $active = false): array
    {
        return [
            'start_year' => (int) $startYear,
            'end_year' => (int) $startYear + 1,
            'is_active' => $active,
            'terms' => [
                [
                    'name' => 'Ganjil',
                    'start_date' => $startYear.'-07-01',
                    'end_date' => $startYear.'-12-31',
                ],
                [
                    'name' => 'Genap',
                    'start_date' => ((int) $startYear + 1).'-01-01',
                    'end_date' => ((int) $startYear + 1).'-06-30',
                ],
            ],
        ];
    }

    public function test_admin_pages_and_mutations(): void
    {
        $admin = User::where('username', 'admin')->firstOrFail();
        $this->actingAs($admin, 'web');

        $activeYear = AcademicYear::where('is_active', true)->firstOrFail();
        $schoolClass = SchoolClass::firstOrFail();
        $student = Student::firstOrFail();
        $subject = Subject::firstOrFail();
        $teacher = User::where('role', 'teacher')->firstOrFail();
        $classSubject = ClassSubject::firstOrFail();
        $lesson = DailyLesson::firstOrFail();
        $attendance = Attendance::firstOrFail();
        $extracurricular = Extracurricular::firstOrFail();

        $reads = [
            '/api/user',
            '/api/profile',
            '/api/dashboard',
            '/api/academic-years',
            '/api/academic-years/'.$activeYear->id,
            '/api/students?search='.urlencode($student->full_name),
            '/api/students/'.$student->id,
            '/api/teachers?search='.urlencode($teacher->full_name),
            '/api/teachers/'.$teacher->id,
            '/api/classes?search='.urlencode($schoolClass->name),
            '/api/classes/'.$schoolClass->id,
            '/api/subjects?search='.urlencode($subject->name),
            '/api/extracurriculars',
            '/api/extracurriculars/'.$extracurricular->id,
            '/api/classes/'.$schoolClass->id.'/students?academic_year_id='.$activeYear->id,
            '/api/classes/'.$schoolClass->id.'/subjects?academic_year_id='.$activeYear->id,
            '/api/classes/'.$schoolClass->id.'/homeroom-teacher?academic_year_id='.$activeYear->id,
            '/api/class-subjects/'.$classSubject->id.'/lessons',
            '/api/class-subjects/'.$classSubject->id.'/lessons/'.$lesson->id,
            '/api/class-subjects/'.$classSubject->id.'/students',
            '/api/class-subjects/'.$classSubject->id.'/evaluation',
            '/api/lessons/'.$lesson->id.'/progress',
            '/api/class-subjects/'.$classSubject->id.'/attendances?search=Absensi&month='.now()->month,
            '/api/attendances/'.$attendance->id,
            '/api/extracurriculars/'.$extracurricular->id.'/teachers?academic_year_id='.$activeYear->id,
            '/api/extracurriculars/'.$extracurricular->id.'/students?academic_year_id='.$activeYear->id,
        ];

        foreach ($reads as $url) {
            $this->callEndpoint('get', $url);
        }

        $profile = $this->callEndpoint('get', '/api/profile');
        $this->assertArrayHasKey('nip', $profile['user']);
        $this->assertSame($admin->nip, $profile['user']['nip']);

        $this->get('/api/students/'.$student->id.'/report/pdf')->assertOk();
        $this->get('/api/class-subjects/'.$classSubject->id.'/report/pdf')->assertOk();
        $this->get('/api/class-subjects/'.$classSubject->id.'/report/pdf?period=monthly&month='.now()->format('Y-m'))->assertOk();
        $this->get('/api/class-subjects/'.$classSubject->id.'/report/pdf?period=semester&semester=ganjil')->assertOk();
        $this->getJson('/api/class-subjects/'.$classSubject->id.'/report/pdf?period=monthly')->assertStatus(422);

        $this->callEndpoint('put', '/api/profile', [
            'full_name' => 'Administrator QA',
        ]);
        $this->assertSame('Administrator QA', User::find($admin->id)->full_name);

        $newYear = $this->callEndpoint('post', '/api/academic-years', $this->academicYearPayload('2030'), 201)['data'];
        $this->callEndpoint('put', '/api/academic-years/'.$newYear['id'], $this->academicYearPayload('2030'));
        $this->callEndpoint('post', '/api/academic-years/'.$newYear['id'].'/activate');
        $this->callEndpoint('post', '/api/academic-years/'.$activeYear->id.'/activate');
        $this->callEndpoint('delete', '/api/academic-years/'.$newYear['id']);

        $newStudent = $this->callEndpoint('post', '/api/students', [
            'nisn' => 'QA000000001',
            'full_name' => 'QA Student',
            'gender' => 'L',
            'parent_name' => 'QA Parent',
        ], 201);
        $this->callEndpoint('put', '/api/students/'.$newStudent['id'], [
            'nisn' => 'QA000000001',
            'full_name' => 'QA Student Updated',
            'gender' => 'P',
            'parent_name' => 'QA Parent Updated',
        ]);

        $newTeacher = $this->callEndpoint('post', '/api/teachers', [
            'nip' => 'QA900000000000001',
            'username' => 'qa.teacher',
            'password' => 'password123',
            'full_name' => 'QA Teacher',
        ], 201)['data'];
        $this->callEndpoint('put', '/api/teachers/'.$newTeacher['id'], [
            'nip' => 'QA900000000000001',
            'username' => 'qa.teacher',
            'password' => 'password456',
            'full_name' => 'QA Teacher Updated',
            'is_active' => true,
        ]);

        $newClass = $this->callEndpoint('post', '/api/classes', [
            'name' => 'QA-class',
            'grade_level' => 10,
        ], 201);
        $this->callEndpoint('put', '/api/classes/'.$newClass['id'], [
            'name' => 'QA-class-updated',
            'grade_level' => 11,
        ]);

        $newSubject = $this->callEndpoint('post', '/api/subjects', [
            'name' => 'QA Subject',
        ], 201);
        $this->callEndpoint('put', '/api/subjects/'.$newSubject['id'], [
            'name' => 'QA Subject Updated',
        ]);

        $newExtracurricular = $this->callEndpoint('post', '/api/extracurriculars', [
            'name' => 'QA Extracurricular',
            'description' => 'QA description',
            'is_active' => true,
        ], 201);
        $this->callEndpoint('put', '/api/extracurriculars/'.$newExtracurricular['id'], [
            'name' => 'QA Extracurricular Updated',
            'description' => 'QA description updated',
            'is_active' => false,
        ]);

        $this->callEndpoint('post', '/api/classes/'.$newClass['id'].'/students', [
            'academic_year_id' => $activeYear->id,
            'student_ids' => [$newStudent['id']],
        ], 201);
        $this->callEndpoint('delete', '/api/classes/'.$newClass['id'].'/students/'.$newStudent['id'].'?academic_year_id='.$activeYear->id);

        $newClassSubject = $this->callEndpoint('post', '/api/classes/'.$newClass['id'].'/subjects', [
            'academic_year_id' => $activeYear->id,
            'subject_id' => $newSubject['id'],
            'teacher_id' => $teacher->id,
        ], 201);
        $this->callEndpoint('put', '/api/classes/'.$newClass['id'].'/subjects/'.$newClassSubject['id'], [
            'subject_id' => $newSubject['id'],
            'teacher_id' => $newTeacher['id'],
        ]);

        $this->callEndpoint('put', '/api/classes/'.$newClass['id'].'/homeroom-teacher', [
            'academic_year_id' => $activeYear->id,
            'teacher_id' => $newTeacher['id'],
        ]);
        $this->callEndpoint('delete', '/api/classes/'.$newClass['id'].'/homeroom-teacher?academic_year_id='.$activeYear->id);

        $this->callEndpoint('post', '/api/extracurriculars/'.$newExtracurricular['id'].'/teachers', [
            'academic_year_id' => $activeYear->id,
            'teacher_id' => $newTeacher['id'],
        ], 201);
        $this->callEndpoint('post', '/api/extracurriculars/'.$newExtracurricular['id'].'/students', [
            'academic_year_id' => $activeYear->id,
            'student_ids' => [$newStudent['id']],
        ], 201);

        $classStudents = $this->callEndpoint('get', '/api/class-subjects/'.$classSubject->id.'/students')['data'];
        $this->assertNotEmpty($classStudents);
        $lessonPayload = [
            'lesson_date' => '2027-01-10',
            'title' => 'QA Lesson',
            'description' => 'QA lesson description',
            'progress' => array_map(fn ($item) => [
                'student_id' => $item['id'],
                'score' => 90,
                'teacher_note' => 'QA note',
            ], $classStudents),
        ];
        $newLesson = $this->callEndpoint('post', '/api/class-subjects/'.$classSubject->id.'/lessons', $lessonPayload, 201)['data'];
        $this->callEndpoint('put', '/api/class-subjects/'.$classSubject->id.'/lessons/'.$newLesson['id'], [
            'lesson_date' => '2027-01-11',
            'title' => 'QA Lesson Updated',
            'description' => 'QA lesson description updated',
        ]);
        $this->callEndpoint('put', '/api/lessons/'.$newLesson['id'].'/progress/'.$classStudents[0]['id'], [
            'score' => 95,
            'teacher_note' => 'QA note updated',
        ]);
        $this->callEndpoint('delete', '/api/class-subjects/'.$classSubject->id.'/lessons/'.$newLesson['id']);

        $attendancePayload = [
            'date' => '2027-02-10',
            'meeting_number' => 99,
            'topic' => 'QA Topic',
            'notes' => 'QA Notes',
            'attendance' => array_map(fn ($item) => [
                'student_id' => $item['id'],
                'status' => 'present',
                'note' => null,
            ], $classStudents),
        ];
        $newAttendance = $this->callEndpoint('post', '/api/class-subjects/'.$classSubject->id.'/attendances', $attendancePayload, 201)['data'];
        $attendancePayload['date'] = '2027-02-11';
        $this->callEndpoint('put', '/api/attendances/'.$newAttendance['id'], $attendancePayload);
        $this->callEndpoint('delete', '/api/attendances/'.$newAttendance['id']);

        $this->callEndpoint('delete', '/api/classes/'.$newClass['id'].'/subjects/'.$newClassSubject['id']);
        $this->callEndpoint('delete', '/api/extracurriculars/'.$newExtracurricular['id']);
        $this->callEndpoint('delete', '/api/subjects/'.$newSubject['id']);
        $this->callEndpoint('delete', '/api/classes/'.$newClass['id']);
        $this->callEndpoint('delete', '/api/teachers/'.$newTeacher['id']);
        $this->callEndpoint('delete', '/api/students/'.$newStudent['id']);
    }

    public function test_teacher_pages_and_mutations(): void
    {
        $teacher = User::where('role', 'teacher')
            ->whereHas('taughtSubjects')
            ->whereHas('homeroomClasses')
            ->firstOrFail();
        $this->actingAs($teacher, 'web');

        $activeYear = AcademicYear::where('is_active', true)->firstOrFail();
        $classSubject = ClassSubject::where('teacher_id', $teacher->id)->firstOrFail();
        $homeroom = $teacher->homeroomClasses()->firstOrFail();
        $lesson = DailyLesson::where('class_subject_id', $classSubject->id)->firstOrFail();
        $attendance = Attendance::where('class_subject_id', $classSubject->id)->firstOrFail();

        $reads = [
            '/api/user',
            '/api/profile',
            '/api/dashboard',
            '/api/teacher/classes',
            '/api/teacher/homeroom-classes',
            '/api/teacher/classes/'.$homeroom->school_class_id,
            '/api/teacher/classes/'.$homeroom->school_class_id.'/progress',
            '/api/classes/'.$classSubject->school_class_id.'/students?academic_year_id='.$activeYear->id,
            '/api/classes/'.$classSubject->school_class_id.'/subjects?academic_year_id='.$activeYear->id,
            '/api/classes/'.$classSubject->school_class_id.'/homeroom-teacher?academic_year_id='.$activeYear->id,
            '/api/class-subjects/'.$classSubject->id.'/lessons',
            '/api/class-subjects/'.$classSubject->id.'/lessons/'.$lesson->id,
            '/api/class-subjects/'.$classSubject->id.'/students',
            '/api/class-subjects/'.$classSubject->id.'/evaluation',
            '/api/lessons/'.$lesson->id.'/progress',
            '/api/class-subjects/'.$classSubject->id.'/attendances',
            '/api/attendances/'.$attendance->id,
        ];

        foreach ($reads as $url) {
            $this->callEndpoint('get', $url);
        }

        $profile = $this->callEndpoint('get', '/api/profile');
        $this->assertArrayHasKey('nip', $profile['user']);
        $this->assertSame($teacher->nip, $profile['user']['nip']);

        $this->get('/api/class-subjects/'.$classSubject->id.'/report/pdf')->assertOk();

        $this->callEndpoint('put', '/api/profile', [
            'full_name' => $teacher->full_name.' QA',
        ]);

        $classStudents = $this->callEndpoint('get', '/api/class-subjects/'.$classSubject->id.'/students')['data'];
        $this->assertNotEmpty($classStudents);

        $newLesson = $this->callEndpoint('post', '/api/class-subjects/'.$classSubject->id.'/lessons', [
            'lesson_date' => '2027-03-10',
            'title' => 'QA Teacher Lesson',
            'progress' => [
                [
                    'student_id' => $classStudents[0]['id'],
                    'score' => 85,
                ],
            ],
        ], 201)['data'];

        $this->callEndpoint('put', '/api/lessons/'.$newLesson['id'].'/progress/'.$classStudents[0]['id'], [
            'score' => 88,
            'teacher_note' => 'Teacher QA note',
        ]);
        $this->callEndpoint('delete', '/api/class-subjects/'.$classSubject->id.'/lessons/'.$newLesson['id']);

        $newAttendance = $this->callEndpoint('post', '/api/class-subjects/'.$classSubject->id.'/attendances', [
            'date' => '2027-04-10',
            'meeting_number' => 98,
            'topic' => 'Teacher QA Topic',
            'attendance' => [
                [
                    'student_id' => $classStudents[0]['id'],
                    'status' => 'sick',
                    'note' => 'Teacher QA note',
                ],
            ],
        ], 201)['data'];

        $this->callEndpoint('put', '/api/attendances/'.$newAttendance['id'], [
            'date' => '2027-04-11',
            'meeting_number' => 98,
            'topic' => 'Teacher QA Topic Updated',
            'attendance' => [
                [
                    'student_id' => $classStudents[0]['id'],
                    'status' => 'present',
                ],
            ],
        ]);
        $this->callEndpoint('delete', '/api/attendances/'.$newAttendance['id']);
    }

    public function test_teacher_cannot_manage_class_subjects_they_do_not_teach(): void
    {
        $teacher = User::where('role', 'teacher')
            ->whereHas('taughtSubjects')
            ->firstOrFail();

        $otherClassSubject = ClassSubject::where('teacher_id', '!=', $teacher->id)
            ->whereNotNull('teacher_id')
            ->firstOrFail();

        $this->actingAs($teacher, 'web');

        $this->postJson('/api/class-subjects/'.$otherClassSubject->id.'/lessons', [
            'lesson_date' => '2027-05-10',
            'title' => 'QA Forbidden Lesson',
        ])->assertStatus(403);

        $this->postJson('/api/class-subjects/'.$otherClassSubject->id.'/attendances', [
            'date' => '2027-05-10',
            'attendance' => [],
        ])->assertStatus(403);
    }
}
