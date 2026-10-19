<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AcademicYearController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ClassHomeroomTeacherController;
use App\Http\Controllers\ClassStudentController;
use App\Http\Controllers\ClassSubjectController;
use App\Http\Controllers\DailyLessonController;
use App\Http\Controllers\ExtracurricularController;
use App\Http\Controllers\ExtracurricularStudentController;
use App\Http\Controllers\ExtracurricularTeacherController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SchoolClassController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\StudentDailyProgressController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\TeacherController;

Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Teacher
    Route::get('/teacher/classes', [ClassSubjectController::class, 'teacherClasses']);

    // Academic Year
    Route::apiResource('academic-years', AcademicYearController::class);

    // Master Data
    Route::apiResource('classes', SchoolClassController::class);
    Route::apiResource('teachers', TeacherController::class);
    Route::apiResource('subjects', SubjectController::class);
    Route::apiResource('students', StudentController::class);
    Route::apiResource('extracurriculars', ExtracurricularController::class);

    // Class Students
    Route::get('/classes/{schoolClass}/students', [ClassStudentController::class, 'index']);
    Route::post('/classes/{schoolClass}/students', [ClassStudentController::class, 'store']);
    Route::delete('/classes/{schoolClass}/students/{student}', [ClassStudentController::class, 'destroy']);

    // Class Subjects / Teacher Placement
    Route::get('/classes/{schoolClass}/subjects', [ClassSubjectController::class, 'index']);
    Route::post('/classes/{schoolClass}/subjects', [ClassSubjectController::class, 'store']);
    Route::put('/classes/{schoolClass}/subjects/{classSubject}', [ClassSubjectController::class, 'update']);
    Route::delete('/classes/{schoolClass}/subjects/{classSubject}', [ClassSubjectController::class, 'destroy']);

    // Homeroom Teacher
    Route::get('/classes/{schoolClass}/homeroom-teacher', [ClassHomeroomTeacherController::class, 'show']);
    Route::put('/classes/{schoolClass}/homeroom-teacher', [ClassHomeroomTeacherController::class, 'update']);
    Route::delete('/classes/{schoolClass}/homeroom-teacher', [ClassHomeroomTeacherController::class, 'destroy']);

    // Extracurricular - Teachers
    Route::get('/extracurriculars/{extracurricular}/teachers', [ExtracurricularTeacherController::class, 'index']);
    Route::post('/extracurriculars/{extracurricular}/teachers', [ExtracurricularTeacherController::class, 'store']);
    Route::delete('/extracurriculars/{extracurricular}/teachers/{teacher}', [ExtracurricularTeacherController::class, 'destroy']);

    // Extracurricular - Students
    Route::get('/extracurriculars/{extracurricular}/students', [ExtracurricularStudentController::class, 'index']);
    Route::post('/extracurriculars/{extracurricular}/students', [ExtracurricularStudentController::class, 'store']);
    Route::delete('/extracurriculars/{extracurricular}/students/{student}', [ExtracurricularStudentController::class, 'destroy']);

    // Daily Lessons
    Route::get('/class-subjects/{classSubject}/lessons', [DailyLessonController::class, 'index']);
    Route::post('/class-subjects/{classSubject}/lessons', [DailyLessonController::class, 'store']); // Create lesson + progress siswa
    Route::get('/class-subjects/{classSubject}/lessons/{dailyLesson}', [DailyLessonController::class, 'show']); // Detail lesson
    Route::put('/class-subjects/{classSubject}/lessons/{dailyLesson}', [DailyLessonController::class, 'update']); // Edit informasi lesson
    Route::delete('/class-subjects/{classSubject}/lessons/{dailyLesson}', [DailyLessonController::class, 'destroy']); // Hapus lesson

    // Students dalam classroom
    Route::get('/class-subjects/{classSubject}/students', [ClassSubjectController::class, 'students']);

    // Student Daily Progress
    Route::get('/class-subjects/{classSubject}/report/pdf', [ReportController::class, 'classroomReport']);
    Route::get('/students/{student}/report/pdf', [ReportController::class, 'studentReport']);
    Route::get('/lessons/{dailyLesson}/progress', [StudentDailyProgressController::class, 'index']);
    Route::put('/lessons/{dailyLesson}/progress/{student}', [StudentDailyProgressController::class, 'update']); // Edit progress satu siswa
});
