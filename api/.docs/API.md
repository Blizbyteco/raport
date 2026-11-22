# API Documentation — E-Raport Pendamping

## Base URL

```text
/api
```

Semua endpoint di bawah `/api` berada di middleware `auth:sanctum`. Autentikasi menggunakan **Laravel Sanctum mode SPA** (cookie session), bukan bearer token. Login dilakukan melalui `POST /login` di luar prefix `/api` dengan payload `username` dan `password`.

Request JSON sebaiknya menyertakan:

```http
Accept: application/json
Content-Type: application/json
X-CSRF-TOKEN: {csrf_token}
```

---

# 1. Academic Years

Mengelola tahun ajaran dan dua semester (`terms`) yang menyertainya.

## 1.1 Get Academic Years

```http
GET /api/academic-years
```

Mengambil seluruh tahun ajaran beserta `terms`, diurutkan dari `start_year` terbesar.

### Response

```json
{
    "message": "Data tahun ajaran berhasil diambil.",
    "data": [
        {
            "id": 1,
            "start_year": 2026,
            "end_year": 2027,
            "is_active": true,
            "terms": [
                {
                    "id": 1,
                    "academic_year_id": 1,
                    "name": "Ganjil",
                    "start_date": "2026-07-01",
                    "end_date": "2026-12-31"
                },
                {
                    "id": 2,
                    "academic_year_id": 1,
                    "name": "Genap",
                    "start_date": "2027-01-01",
                    "end_date": "2027-06-30"
                }
            ]
        }
    ]
}
```

---

## 1.2 Get Academic Year

```http
GET /api/academic-years/{academicYear}
```

Mengambil detail satu tahun ajaran beserta `terms`.

### Parameters

| Parameter      | Type    | Required | Description     |
| -------------- | ------- | -------- | --------------- |
| `academicYear` | integer | Yes      | ID tahun ajaran |

---

## 1.3 Create Academic Year

```http
POST /api/academic-years
```

### Payload

```json
{
    "start_year": 2026,
    "end_year": 2027,
    "is_active": true,
    "terms": [
        { "name": "Ganjil", "start_date": "2026-07-01", "end_date": "2026-12-31" },
        { "name": "Genap", "start_date": "2027-01-01", "end_date": "2027-06-30" }
    ]
}
```

### Fields

| Field             | Type    | Required | Description                          |
| ----------------- | ------- | -------- | ------------------------------------ |
| `start_year`      | integer | Yes      | Tahun mulai (2000–2100)              |
| `end_year`        | integer | Yes      | Harus `start_year + 1`               |
| `is_active`       | boolean | No       | Default `false`; jika `true`, tahun lain dinonaktifkan |
| `terms`           | array   | Yes      | Harus berisi 2 semester              |
| `terms.*.name`    | string  | Yes      | `Ganjil` atau `Genap`, tidak duplikat |
| `terms.*.start_date` | date  | Yes      | Tanggal mulai semester               |
| `terms.*.end_date`   | date  | Yes      | Tanggal selesai, tidak sebelum mulai |

---

## 1.4 Update Academic Year

```http
PUT /api/academic-years/{academicYear}
```

Payload sama seperti 1.3; `terms.*.id` opsional. `terms` tetap wajib berisi dua semester. Jika `is_active: true`, tahun ajaran lain dinonaktifkan.

---

## 1.5 Delete Academic Year

```http
DELETE /api/academic-years/{academicYear}
```

Menghapus tahun ajaran. Tahun ajaran yang sedang aktif tidak dapat dihapus (422).

---

## 1.6 Activate Academic Year

```http
POST /api/academic-years/{academicYear}/activate
```

Menjadikan tahun ajaran aktif dan menonaktifkan semua tahun ajaran lainnya.

### Response

```json
{
    "message": "Tahun ajaran berhasil diaktifkan.",
    "data": {
        "id": 1,
        "start_year": 2026,
        "end_year": 2027,
        "is_active": true,
        "terms": [
            {
                "id": 1,
                "academic_year_id": 1,
                "name": "Ganjil",
                "start_date": "2026-07-01",
                "end_date": "2026-12-31"
            }
        ]
    }
}
```

---

# 2. Classes

Mengelola data kelas.

## 2.1 Get Classes

```http
GET /api/classes
```

Mengambil seluruh kelas. `students_count` dan `subjects_count` dihitung hanya untuk tahun ajaran aktif.

---

## 2.2 Get Class

```http
GET /api/classes/{schoolClass}
```

Mengambil detail kelas beserta relasi siswa, mata pelajaran, guru, dan wali kelas. `students_count` dan `subjects_count` dihitung hanya untuk tahun ajaran aktif.

---

## 2.3 Create Class

```http
POST /api/classes
```

### Payload

```json
{
    "name": "X RPL 1",
    "grade_level": 10
}
```

### Fields

| Field         | Type    | Required | Description          |
| ------------- | ------- | -------- | -------------------- |
| `name`        | string  | Yes      | Nama kelas           |
| `grade_level` | integer | Yes      | Tingkat kelas, 7–12  |

---

## 2.4 Update Class

```http
PUT /api/classes/{schoolClass}
```

### Payload

```json
{
    "name": "X RPL 2",
    "grade_level": 10
}
```

---

## 2.5 Delete Class

```http
DELETE /api/classes/{schoolClass}
```

---

# 3. Subjects

Mengelola master mata pelajaran.

## 3.1 Get Subjects

```http
GET /api/subjects?search=matematika
```

Mendukung filter `search` pada `name`; hasil diurutkan berdasarkan nama.

---

## 3.2 Get Subject

```http
GET /api/subjects/{subject}
```

---

## 3.3 Create Subject

```http
POST /api/subjects
```

### Payload

```json
{
    "name": "Matematika"
}
```

### Fields

| Field  | Type   | Required | Description          |
| ------ | ------ | -------- | -------------------- |
| `name` | string | Yes      | Nama mata pelajaran  |

---

## 3.4 Update Subject

```http
PUT /api/subjects/{subject}
```

### Payload

```json
{
    "name": "Matematika"
}
```

---

## 3.5 Delete Subject

```http
DELETE /api/subjects/{subject}
```

---

# 4. Students

Mengelola data siswa.

## 4.1 Get Students

```http
GET /api/students
```

Mendukung pencarian berdasarkan nama atau NISN.

### Query Parameters

```text
?search=ahmad
```

### Example

```http
GET /api/students?search=ahmad
```

### Response

```json
{
    "current_page": 1,
    "data": [
        {
            "id": 1,
            "nisn": "0012345678",
            "full_name": "Ahmad Fauzan",
            "gender": "L",
            "parent_name": "Budi Santoso"
        }
    ],
    "per_page": 20,
    "total": 1
}
```

---

## 4.2 Get Student

```http
GET /api/students/{student}
```

Mengambil detail siswa termasuk riwayat penempatan kelas.

---

## 4.3 Create Student

```http
POST /api/students
```

### Payload

```json
{
    "nisn": "0012345678",
    "full_name": "Ahmad Fauzan",
    "gender": "L",
    "parent_name": "Budi Santoso"
}
```

### Fields

| Field         | Type   | Required | Description    |
| ------------- | ------ | -------- | -------------- |
| `nisn`        | string | Yes      | NISN unik      |
| `full_name`   | string | Yes      | Nama lengkap   |
| `gender`      | string | No       | Jenis kelamin  |
| `parent_name` | string | No       | Nama orang tua |

---

## 4.4 Update Student

```http
PUT /api/students/{student}
```

### Payload

```json
{
    "nisn": "0012345678",
    "full_name": "Ahmad Fauzan",
    "gender": "L",
    "parent_name": "Budi Santoso"
}
```

---

## 4.5 Delete Student

```http
DELETE /api/students/{student}
```

---

# 5. Class Students

Mengatur penempatan siswa ke kelas berdasarkan tahun ajaran.

## 5.1 Get Students in Class

```http
GET /api/classes/{schoolClass}/students?academic_year_id=1
```

### Query Parameters

| Parameter          | Type    | Required | Description  |
| ------------------ | ------- | -------- | ------------ |
| `academic_year_id` | integer | Yes      | Tahun ajaran |

### Response

```json
[
    {
        "id": 1,
        "academic_year_id": 1,
        "school_class_id": 2,
        "student_id": 10,
        "status": "AKTIF",
        "student": {
            "id": 10,
            "nisn": "0012345678",
            "full_name": "Ahmad Fauzan"
        }
    }
]
```

---

## 5.2 Add Students to Class

```http
POST /api/classes/{schoolClass}/students
```

Menambahkan beberapa siswa sekaligus ke kelas.

### Payload

```json
{
    "academic_year_id": 1,
    "student_ids": [10, 11, 12, 13]
}
```

### Fields

| Field              | Type    | Required | Description     |
| ------------------ | ------- | -------- | --------------- |
| `academic_year_id` | integer | Yes      | Tahun ajaran    |
| `student_ids`      | array   | Yes      | Daftar ID siswa |
| `student_ids.*`    | integer | Yes      | ID siswa        |

Satu siswa hanya dapat memiliki satu kelas pada satu tahun ajaran karena terdapat unique constraint:

```text
academic_year_id + student_id
```

---

## 5.3 Remove Student from Class

```http
DELETE /api/classes/{schoolClass}/students/{student}?academic_year_id=1
```

### Query Parameters

| Parameter          | Type    | Required |
| ------------------ | ------- | -------- |
| `academic_year_id` | integer | Yes      |

---

# 6. Class Subjects / Teacher Placement

Mengatur mata pelajaran dan guru yang mengajar pada suatu kelas.

## 6.1 Get Class Subjects

```http
GET /api/classes/{schoolClass}/subjects?academic_year_id=1
```

### Response

```json
[
    {
        "id": 1,
        "academic_year_id": 1,
        "school_class_id": 2,
        "subject_id": 3,
        "teacher_id": 8,
        "subject": {
            "id": 3,
            "code": "MTK",
            "name": "Matematika"
        },
        "teacher": {
            "id": 8,
            "username": "guru.ahmad",
            "full_name": "Ahmad Fauzan"
        }
    }
]
```

---

## 6.2 Assign Subject and Teacher

```http
POST /api/classes/{schoolClass}/subjects
```

### Payload

```json
{
    "academic_year_id": 1,
    "subject_id": 3,
    "teacher_id": 8
}
```

### Fields

| Field              | Type    | Required | Description                |
| ------------------ | ------- | -------- | -------------------------- |
| `academic_year_id` | integer | Yes      | Tahun ajaran               |
| `subject_id`       | integer | Yes      | Mata pelajaran             |
| `teacher_id`       | integer | Yes      | ID user dengan role `teacher` |

---

## 6.3 Update Subject Teacher Assignment

```http
PUT /api/classes/{schoolClass}/subjects/{classSubject}
```

### Payload

```json
{
    "subject_id": 3,
    "teacher_id": 9
}
```

---

## 6.4 Delete Subject Teacher Assignment

```http
DELETE /api/classes/{schoolClass}/subjects/{classSubject}
```

---

## 6.5 Get Teacher Classes

```http
GET /api/teacher/classes
```

Mengambil semua class subject yang diampu oleh user yang sedang login.

### Response

```json
[
    {
        "id": 5,
        "subject": { "id": 3, "name": "Matematika" },
        "classroom": {
            "id": 2,
            "name": "X RPL 1",
            "grade_level": 10,
            "student_count": 32
        }
    }
]
```

---

## 6.6 Get Homeroom Classes

```http
GET /api/teacher/homeroom-classes
```

Mengambil kelas wali kelas user yang sedang login untuk tahun ajaran aktif (fallback: tahun ajaran terbaru).

### Response

```json
{
    "data": [
        {
            "id": 1,
            "classroom": { "id": 2, "name": "X RPL 1", "grade_level": 10 },
            "academic_year": { "id": 1, "start_year": 2026, "end_year": 2027 },
            "student_count": 32
        }
    ]
}
```

---

## 6.7 Get Teacher Class Detail

```http
GET /api/teacher/classes/{schoolClass}
```

Detail kelas untuk user yang sedang login, dibatasi pada tahun ajaran aktif.

### Response

```json
{
    "data": {
        "id": 2,
        "name": "X RPL 1",
        "grade_level": 10,
        "academic_year": { "id": 1, "start_year": 2026, "end_year": 2027 },
        "students": [
            { "id": 20, "nisn": "0012345678", "full_name": "Ahmad Fauzan" }
        ],
        "subjects": [
            {
                "id": 5,
                "subject": { "id": 3, "name": "Matematika" },
                "teacher": { "id": 8, "full_name": "Ahmad Fauzan" }
            }
        ],
        "homeroom_teachers": [
            { "id": 8, "full_name": "Ahmad Fauzan" }
        ]
    }
}
```

---

## 6.8 Get Teacher Class Progress

```http
GET /api/teacher/classes/{schoolClass}/progress
```

Ringkasan nilai progress siswa pada tahun ajaran aktif. Status: `Belum Dinilai`, `Perlu Perhatian` (`<70`), `Baik` (`70–84`), `Sangat Baik` (`>=85`).

### Response

```json
{
    "data": {
        "class": { "id": 2, "name": "X RPL 1", "grade_level": 10 },
        "academic_year": { "id": 1, "start_year": 2026, "end_year": 2027 },
        "summary": {
            "average": 78.5,
            "total_lessons": 12,
            "assessed_students": 30,
            "attention_students": 4
        },
        "students": [
            {
                "id": 20,
                "nisn": "0012345678",
                "full_name": "Ahmad Fauzan",
                "average": 82.5,
                "assessed": 12,
                "status": "Baik"
            }
        ]
    }
}
```

---

# 7. Homeroom Teacher

Mengatur wali kelas berdasarkan tahun ajaran.

## 7.1 Get Homeroom Teacher

```http
GET /api/classes/{schoolClass}/homeroom-teacher?academic_year_id=1
```

### Response

```json
{
    "id": 1,
    "academic_year_id": 1,
    "school_class_id": 2,
    "teacher_id": 8,
    "teacher": {
        "id": 8,
        "username": "guru.ahmad",
        "full_name": "Ahmad Fauzan"
    }
}
```

---

## 7.2 Assign / Change Homeroom Teacher

```http
PUT /api/classes/{schoolClass}/homeroom-teacher
```

### Payload

```json
{
    "academic_year_id": 1,
    "teacher_id": 8
}
```

Jika wali kelas sudah ada, data akan diperbarui.

---

## 7.3 Remove Homeroom Teacher

```http
DELETE /api/classes/{schoolClass}/homeroom-teacher?academic_year_id=1
```

---

# 8. Extracurriculars

Mengelola master ekstrakurikuler.

## 8.1 Get Extracurriculars

```http
GET /api/extracurriculars
```

---

## 8.2 Get Extracurricular

```http
GET /api/extracurriculars/{extracurricular}
```

Mengambil detail ekstrakurikuler beserta guru dan siswa yang terdaftar.

---

## 8.3 Create Extracurricular

```http
POST /api/extracurriculars
```

### Payload

```json
{
    "name": "Pramuka",
    "description": "Kegiatan kepramukaan",
    "is_active": true
}
```

### Fields

| Field         | Type    | Required | Description          |
| ------------- | ------- | -------- | -------------------- |
| `name`        | string  | Yes      | Nama ekstrakurikuler |
| `description` | text    | No       | Deskripsi; nullable  |
| `is_active`   | boolean | No       | Status aktif         |

Kolom `description` bersifat nullable (migrasi `2026_11_22_000001`).

---

## 8.4 Update Extracurricular

```http
PUT /api/extracurriculars/{extracurricular}
```

### Payload

```json
{
    "name": "Pramuka",
    "description": "Kegiatan kepramukaan",
    "is_active": true
}
```

---

## 8.5 Delete Extracurricular

```http
DELETE /api/extracurriculars/{extracurricular}
```

---

# 9. Extracurricular Teachers

Mengatur guru pembina ekstrakurikuler.

## 9.1 Get Extracurricular Teachers

```http
GET /api/extracurriculars/{extracurricular}/teachers?academic_year_id=1
```

---

## 9.2 Assign Teacher

```http
POST /api/extracurriculars/{extracurricular}/teachers
```

### Payload

```json
{
    "academic_year_id": 1,
    "teacher_id": 8
}
```

`teacher_id` harus menunjuk ke user dengan:

```text
role = GURU
```

---

## 9.3 Remove Teacher

```http
DELETE /api/extracurriculars/{extracurricular}/teachers/{teacher}?academic_year_id=1
```

---

# 10. Extracurricular Students

Mengatur siswa yang mengikuti ekstrakurikuler.

## 10.1 Get Extracurricular Students

```http
GET /api/extracurriculars/{extracurricular}/students?academic_year_id=1
```

---

## 10.2 Add Students

```http
POST /api/extracurriculars/{extracurricular}/students
```

Mendukung penambahan banyak siswa sekaligus.

### Payload

```json
{
    "academic_year_id": 1,
    "student_ids": [10, 11, 12, 15]
}
```

---

## 10.3 Remove Student

```http
DELETE /api/extracurriculars/{extracurricular}/students/{student}?academic_year_id=1
```

---

# 11. Daily Lessons

Mengelola catatan pembelajaran harian guru.

Relasi:

```text
Class Subject
      ↓
Daily Lesson
      ↓
Student Daily Progress
```

## 11.1 Get Daily Lessons

```http
GET /api/class-subjects/{classSubject}/lessons
```

Mengambil riwayat pembelajaran beserta ringkasan nilai. `student_count` dihitung dari siswa aktif pada tahun ajaran class subject.

### Response

```json
{
    "meta": {
        "id": 5,
        "subject": { "id": 3, "name": "Matematika" },
        "classroom": {
            "id": 2,
            "name": "X RPL 1",
            "grade_level": 10,
            "student_count": 32
        }
    },
    "data": [
        {
            "id": 1,
            "material": "Persamaan Linear",
            "date": "2026-09-17",
            "average": 82,
            "assessed": 30,
            "totalStudents": 32
        }
    ]
}
```

---

## 11.2 Get Daily Lesson

```http
GET /api/class-subjects/{classSubject}/lessons/{dailyLesson}
```

Mengambil detail pembelajaran beserta relasi `classSubject.subject` dan `classSubject.schoolClass` dalam `data`.

---

## 11.3 Create Daily Lesson

```http
POST /api/class-subjects/{classSubject}/lessons
```

Membuat pembelajaran sekaligus progress siswa dalam satu transaksi.

### Payload

```json
{
    "lesson_date": "2026-09-17",
    "title": "Persamaan Linear",
    "description": "Pembahasan persamaan linear satu variabel",
    "progress": [
        {
            "student_id": 20,
            "score": 85,
            "teacher_note": "Sudah memahami materi."
        }
    ]
}
```

### Fields

| Field                     | Type   | Required | Description                 |
| ------------------------- | ------ | -------- | --------------------------- |
| `lesson_date`             | date   | Yes      | Tanggal pembelajaran        |
| `title`                   | string | Yes      | Judul/materi, maks. 150     |
| `description`             | string | No       | Deskripsi pembelajaran      |
| `progress`                | array  | Yes      | Minimal satu progress siswa |
| `progress.*.student_id`   | integer| Yes      | ID siswa                    |
| `progress.*.score`        | integer| Yes      | Nilai 1–100                 |
| `progress.*.teacher_note` | string | No       | Catatan guru                |

---

## 11.4 Update Daily Lesson

```http
PUT /api/class-subjects/{classSubject}/lessons/{dailyLesson}
```

### Payload

```json
{
    "lesson_date": "2026-09-18",
    "title": "Persamaan Linear Satu Variabel",
    "description": "Materi dan latihan soal"
}
```

Payload tidak mengubah `progress` siswa.

---

## 11.5 Delete Daily Lesson

```http
DELETE /api/class-subjects/{classSubject}/lessons/{dailyLesson}
```

---

# 12. Student Daily Progress

Mengatur nilai (`score`) siswa pada pembelajaran tertentu. Progress dibuat saat `POST /api/class-subjects/{classSubject}/lessons`; tidak ada endpoint `POST /api/lessons/{dailyLesson}/progress`.

## Score

```text
score: integer 1–100
teacher_note: string|null
```

---

## 12.1 Get Student Progress

```http
GET /api/lessons/{dailyLesson}/progress
```

### Response

```json
{
    "data": [
        {
            "id": 1,
            "daily_lesson_id": 10,
            "student_id": 20,
            "score": 85,
            "teacher_note": null,
            "student": {
                "id": 20,
                "nisn": "0012345678",
                "full_name": "Ahmad Fauzan"
            }
        }
    ]
}
```

---

## 12.2 Update Student Progress

```http
PUT /api/lessons/{dailyLesson}/progress/{student}
```

Mengubah progress yang sudah ada; progress tidak ditemukan menghasilkan 404.

### Payload

```json
{
    "score": 90,
    "teacher_note": "Sudah menguasai materi."
}
```

### Fields

| Field          | Type    | Required | Description      |
| -------------- | ------- | -------- | ---------------- |
| `score`        | integer | Yes      | Nilai 1–100      |
| `teacher_note` | string  | No       | Catatan guru     |

---

# 13. Endpoint Summary

| Method | Endpoint                                    | Description                 |
| ------ | ------------------------------------------- | --------------------------- |
| GET    | `/user`                                     | User yang sedang login      |
| POST   | `/logout`                                   | Logout                      |
| GET    | `/profile`                                  | Profil user                 |
| PUT    | `/profile`                                  | Ubah nama lengkap           |
| PUT    | `/profile/password`                         | Ubah kata sandi             |
| GET    | `/dashboard`                                | Ringkasan dashboard         |
| GET    | `/teacher/classes`                          | Kelas yang diampu           |
| GET    | `/teacher/homeroom-classes`                 | Kelas wali kelas            |
| GET    | `/teacher/classes/{schoolClass}`            | Detail kelas guru           |
| GET    | `/teacher/classes/{schoolClass}/progress`   | Progress kelas guru         |
| GET    | `/academic-years`                           | List tahun ajaran           |
| POST   | `/academic-years`                           | Tambah tahun ajaran         |
| GET    | `/academic-years/{id}`                      | Detail tahun ajaran         |
| PUT    | `/academic-years/{id}`                      | Edit tahun ajaran           |
| DELETE | `/academic-years/{id}`                      | Hapus tahun ajaran          |
| POST   | `/academic-years/{id}/activate`             | Aktifkan tahun ajaran       |
| GET    | `/classes`                                  | List kelas                  |
| POST   | `/classes`                                  | Tambah kelas                |
| GET    | `/classes/{id}`                             | Detail kelas                |
| PUT    | `/classes/{id}`                             | Edit kelas                  |
| DELETE | `/classes/{id}`                             | Hapus kelas                 |
| GET    | `/subjects`                                 | List mapel                  |
| POST   | `/subjects`                                 | Tambah mapel                |
| GET    | `/subjects/{id}`                            | Detail mapel                |
| PUT    | `/subjects/{id}`                            | Edit mapel                  |
| DELETE | `/subjects/{id}`                            | Hapus mapel                 |
| GET    | `/students`                                 | List siswa                  |
| POST   | `/students`                                 | Tambah siswa                |
| GET    | `/students/{id}`                            | Detail siswa                |
| PUT    | `/students/{id}`                            | Edit siswa                  |
| DELETE | `/students/{id}`                            | Hapus siswa                 |
| GET    | `/teachers`                                 | List guru                   |
| POST   | `/teachers`                                 | Tambah guru                 |
| GET    | `/teachers/{id}`                            | Detail guru                 |
| PUT    | `/teachers/{id}`                            | Edit guru                   |
| DELETE | `/teachers/{id}`                            | Hapus guru                  |
| GET    | `/classes/{id}/students`                    | Siswa dalam kelas           |
| POST   | `/classes/{id}/students`                    | Tambah siswa ke kelas       |
| DELETE | `/classes/{id}/students/{student}`          | Hapus siswa dari kelas      |
| GET    | `/classes/{id}/subjects`                    | Mapel/guru kelas            |
| POST   | `/classes/{id}/subjects`                    | Assign mapel + guru         |
| PUT    | `/classes/{id}/subjects/{classSubject}`     | Edit assignment             |
| DELETE | `/classes/{id}/subjects/{classSubject}`     | Hapus assignment            |
| GET    | `/classes/{id}/homeroom-teacher`            | Lihat wali kelas            |
| PUT    | `/classes/{id}/homeroom-teacher`            | Assign/ubah wali kelas      |
| DELETE | `/classes/{id}/homeroom-teacher`            | Hapus wali kelas            |
| GET    | `/extracurriculars`                         | List ekstrakurikuler        |
| POST   | `/extracurriculars`                         | Tambah ekstrakurikuler      |
| GET    | `/extracurriculars/{id}`                    | Detail ekstrakurikuler      |
| PUT    | `/extracurriculars/{id}`                    | Edit ekstrakurikuler        |
| DELETE | `/extracurriculars/{id}`                    | Hapus ekstrakurikuler       |
| GET    | `/extracurriculars/{id}/teachers`           | List guru ekskul            |
| POST   | `/extracurriculars/{id}/teachers`           | Assign guru ekskul          |
| DELETE | `/extracurriculars/{id}/teachers/{teacher}` | Hapus guru ekskul           |
| GET    | `/extracurriculars/{id}/students`           | List siswa ekskul           |
| POST   | `/extracurriculars/{id}/students`           | Tambah siswa ekskul         |
| DELETE | `/extracurriculars/{id}/students/{student}` | Hapus siswa ekskul          |
| GET    | `/class-subjects/{id}/lessons`              | Riwayat pembelajaran        |
| POST   | `/class-subjects/{id}/lessons`              | Tambah pembelajaran         |
| GET    | `/class-subjects/{id}/lessons/{lesson}`     | Detail pembelajaran         |
| PUT    | `/class-subjects/{id}/lessons/{lesson}`     | Edit pembelajaran           |
| DELETE | `/class-subjects/{id}/lessons/{lesson}`     | Hapus pembelajaran          |
| GET    | `/class-subjects/{id}/students`             | Siswa pada class subject    |
| GET    | `/class-subjects/{id}/evaluation`           | Rekap nilai evaluasi        |
| GET    | `/class-subjects/{id}/report/pdf`           | PDF laporan kelas           |
| GET    | `/students/{id}/report/pdf`                 | PDF laporan siswa           |
| GET    | `/lessons/{id}/progress`                    | List progress siswa         |
| PUT    | `/lessons/{id}/progress/{student}`          | Edit progress siswa         |
| GET    | `/class-subjects/{id}/attendances`          | List absensi                |
| POST   | `/class-subjects/{id}/attendances`          | Tambah absensi              |
| GET    | `/attendances/{attendance}`                 | Detail absensi              |
| PUT    | `/attendances/{attendance}`                 | Edit absensi                |
| DELETE | `/attendances/{attendance}`                 | Hapus absensi               |

---

# 14. Data Flow

## Admin

```text
Academic Year
      │
      ├── Classes
      │     │
      │     ├── Students
      │     │
      │     ├── Subjects
      │     │     └── Teacher
      │     │
      │     └── Homeroom Teacher
      │
      └── Extracurricular
            ├── Teachers
            └── Students
```

## Teacher

```text
Login
  ↓
Dashboard / Profile
  ↓
Assigned Classes / Homeroom Classes
  ↓
Class Subject
  ├── Daily Lessons → Student Daily Progress
  ├── Evaluation
  └── Attendance
```

## Riwayat Akademik

```text
Academic Year 2025/2026
        ↓
Class Students
        ↓
Class / Teacher Assignment
        ↓
Daily Lessons
        ↓
Progress

Academic Year 2026/2027
        ↓
Class Students baru
        ↓
Class / Teacher Assignment baru
        ↓
Daily Lessons baru
        ↓
Progress baru
```

Data tahun ajaran sebelumnya tetap tersimpan sehingga perubahan kelas atau guru pada tahun berikutnya tidak menghilangkan histori akademik.

---

# 15. Profile

## 15.1 Get Profile

```http
GET /api/profile
```

Alias dari `GET /api/user`.

### Response

```json
{
    "user": {
        "id": 8,
        "nip": "198001012023011001",
        "username": "guru.ahmad",
        "full_name": "Ahmad Fauzan",
        "role": "teacher"
    }
}
```

---

## 15.2 Update Profile

```http
PUT /api/profile
```

### Payload

```json
{
    "full_name": "Ahmad Fauzan"
}
```

| Field       | Type   | Required | Description       |
| ----------- | ------ | -------- | ----------------- |
| `full_name` | string | Yes      | Nama lengkap, maks. 100 |

### Response

```json
{
    "message": "Profil berhasil diperbarui.",
    "data": {
        "id": 8,
        "nip": "198001012023011001",
        "username": "guru.ahmad",
        "full_name": "Ahmad Fauzan",
        "role": "teacher"
    }
}
```

---

## 15.3 Update Password

```http
PUT /api/profile/password
```

### Payload

```json
{
    "current_password": "password_lama",
    "password": "password_baru",
    "password_confirmation": "password_baru"
}
```

| Field                   | Type   | Required | Description                     |
| ----------------------- | ------ | -------- | ------------------------------- |
| `current_password`      | string | Yes      | Harus cocok dengan kata sandi aktif |
| `password`              | string | Yes      | Minimal 8 karakter, `confirmed` |
| `password_confirmation` | string | Yes      | Sama dengan `password`          |

### Response

```json
{
    "message": "Kata sandi berhasil diperbarui."
}
```

---

# 16. Dashboard

## 16.1 Get Dashboard Summary

```http
GET /api/dashboard
```

Tahun ajaran yang ditampilkan adalah yang aktif, atau tahun ajaran terbaru jika tidak ada yang aktif.

### Response

```json
{
    "data": {
        "totals": {
            "students": 640,
            "teachers": 48,
            "classes": 24,
            "subjects": 12,
            "extracurriculars": 6
        },
        "academic_year": {
            "id": 1,
            "start_year": 2026,
            "end_year": 2027
        },
        "class_progress": [
            {
                "id": 2,
                "name": "X RPL 1",
                "grade_level": 10,
                "students": 32,
                "progress": 78
            }
        ]
    }
}
```

`class_progress.progress` adalah persentase siswa aktif yang memiliki minimal satu progress pada pembelajaran tahun ajaran tersebut (maks. 100).

---

# 17. Class Subject Classroom

## 17.1 Get Class Subject Students

```http
GET /api/class-subjects/{classSubject}/students
```

Siswa aktif pada kelas dan tahun ajaran class subject.

### Response

```json
{
    "data": [
        { "id": 20, "name": "Ahmad Fauzan", "nis": "0012345678" }
    ]
}
```

---

## 17.2 Get Class Subject Evaluation

```http
GET /api/class-subjects/{classSubject}/evaluation
```

Rekap nilai per siswa untuk setiap pembelajaran pada class subject.

### Response

```json
{
    "data": {
        "classroom": {
            "classSubjectId": 5,
            "subject": "Matematika",
            "class": "X RPL 1",
            "academicYear": "2026/2027"
        },
        "lessons": [
            { "id": 10, "date": "2026-09-17", "title": "Persamaan Linear" }
        ],
        "students": [
            {
                "id": 20,
                "name": "Ahmad Fauzan",
                "nis": "0012345678",
                "scores": [85, null],
                "notes": "Sudah memahami materi."
            }
        ]
    }
}
```

`scores` mengikuti urutan `lessons` (`null` jika belum dinilai); `notes` adalah catatan guru terakhir yang tidak kosong.

---

# 18. Attendance

Status yang diterima: `present`, `permission`, `sick`, `absent`. Kolom `meeting_number` dan `topic` bersifat nullable (migrasi `2026_11_22_000002`).

## 18.1 Get Attendances

```http
GET /api/class-subjects/{classSubject}/attendances?search=persamaan&month=9
```

### Query Parameters

| Parameter | Type    | Required | Description                          |
| --------- | ------- | -------- | ------------------------------------ |
| `search`  | string  | No       | Filter `topic` atau `notes`          |
| `month`   | integer | No       | Filter bulan pada `date` (1–12)      |

### Response

```json
{
    "meta": {
        "id": 5,
        "subject": { "id": 3, "name": "Matematika" },
        "classroom": { "id": 2, "name": "X RPL 1", "grade_level": 10 },
        "teacher": { "id": 8, "full_name": "Ahmad Fauzan" }
    },
    "data": [
        {
            "id": 1,
            "date": "2026-09-17",
            "meeting_number": 1,
            "topic": "Persamaan Linear",
            "notes": null,
            "total_students": 32,
            "present": 30,
            "permission": 1,
            "sick": 0,
            "absent": 1
        }
    ]
}
```

Data diurutkan dari tanggal terbaru.

---

## 18.2 Create Attendance

```http
POST /api/class-subjects/{classSubject}/attendances
```

### Payload

```json
{
    "date": "2026-09-17",
    "meeting_number": 1,
    "topic": "Persamaan Linear",
    "notes": "Pertemuan pertama",
    "attendance": [
        { "student_id": 20, "status": "present", "note": null },
        { "student_id": 21, "status": "sick", "note": "Demam" }
    ]
}
```

### Fields

| Field                    | Type    | Required | Description                         |
| ------------------------ | ------- | -------- | ----------------------------------- |
| `date`                   | date    | Yes      | Tanggal absensi                     |
| `meeting_number`         | integer | No       | Nomor pertemuan, minimal 1; nullable |
| `topic`                  | string  | No       | Maks. 150 karakter; nullable        |
| `notes`                  | string  | No       | Catatan umum; nullable              |
| `attendance`             | array   | Yes      | Minimal satu baris; gunakan kunci ini, bukan `statuses` |
| `attendance.*.student_id`| integer | Yes      | ID siswa anggota aktif kelas        |
| `attendance.*.status`    | string  | Yes      | `present`/`permission`/`sick`/`absent` |
| `attendance.*.note`      | string  | No       | Catatan per siswa; nullable         |

Absensi pada tanggal yang sama untuk class subject yang sama ditolak (422). Siswa harus berstatus aktif pada tahun ajaran class subject.

### Response

```json
{
    "message": "Absensi berhasil disimpan.",
    "data": {
        "id": 1,
        "date": "2026-09-17",
        "meeting_number": 1,
        "topic": "Persamaan Linear",
        "notes": "Pertemuan pertama",
        "class_subject": {
            "id": 5,
            "subject": { "id": 3, "name": "Matematika" },
            "classroom": { "id": 2, "name": "X RPL 1" }
        },
        "details": [
            {
                "id": 1,
                "student_id": 20,
                "status": "present",
                "note": null,
                "student": { "id": 20, "nisn": "0012345678", "full_name": "Ahmad Fauzan" }
            }
        ]
    }
}
```

Status 201.

---

## 18.3 Get Attendance

```http
GET /api/attendances/{attendance}
```

Mengembalikan `data` dengan bentuk yang sama seperti `18.2 Response`.

---

## 18.4 Update Attendance

```http
PUT /api/attendances/{attendance}
```

Payload sama seperti 18.2. Baris `attendance` yang tidak dikirim akan dihapus, sedangkan baris yang tetap dikirim diperbarui.

### Response

```json
{
    "message": "Absensi berhasil diperbarui.",
    "data": {
        "id": 1,
        "date": "2026-09-17",
        "meeting_number": 1,
        "topic": "Persamaan Linear",
        "notes": "Pertemuan pertama",
        "class_subject": {
            "id": 5,
            "subject": { "id": 3, "name": "Matematika" },
            "classroom": { "id": 2, "name": "X RPL 1" }
        },
        "details": [
            {
                "id": 1,
                "student_id": 20,
                "status": "permission",
                "note": "Izin keluarga",
                "student": { "id": 20, "nisn": "0012345678", "full_name": "Ahmad Fauzan" }
            }
        ]
    }
}
```

---

## 18.5 Delete Attendance

```http
DELETE /api/attendances/{attendance}
```

### Response

```json
{
    "message": "Absensi berhasil dihapus."
}
```

---

# API Endpoint

Base URL:

`/api`

Semua endpoint berada di dalam middleware `auth:sanctum` dengan autentikasi cookie session Sanctum SPA.

---

## Auth

| Method | Endpoint      | Fungsi                             |
| ------ | ------------- | ---------------------------------- |
| GET    | `/api/user`   | Mendapatkan user yang sedang login |
| POST   | `/api/logout` | Logout user                        |

---

## Profile

| Method | Endpoint               | Fungsi                    |
| ------ | ---------------------- | ------------------------- |
| GET    | `/api/profile`         | Profil user               |
| PUT    | `/api/profile`         | Update nama lengkap       |
| PUT    | `/api/profile/password`| Update kata sandi         |

---

## Dashboard

| Method | Endpoint       | Fungsi                  |
| ------ | -------------- | ----------------------- |
| GET    | `/api/dashboard` | Ringkasan dashboard   |

---

## Teacher

| Method | Endpoint                                  | Fungsi                                               |
| ------ | ----------------------------------------- | ---------------------------------------------------- |
| GET    | `/api/teacher/classes`                    | Mendapatkan kelas yang diampu guru yang sedang login |
| GET    | `/api/teacher/homeroom-classes`           | Kelas wali kelas guru                                |
| GET    | `/api/teacher/classes/{schoolClass}`      | Detail kelas guru                                    |
| GET    | `/api/teacher/classes/{schoolClass}/progress` | Progress kelas guru                              |

---

## Academic Year

| Method    | Endpoint                             | Fungsi                |
| --------- | ------------------------------------ | --------------------- |
| GET       | `/api/academic-years`                | Daftar tahun akademik |
| POST      | `/api/academic-years`                | Tambah tahun akademik |
| GET       | `/api/academic-years/{academicYear}` | Detail tahun akademik |
| PUT/PATCH | `/api/academic-years/{academicYear}` | Update tahun akademik |
| DELETE    | `/api/academic-years/{academicYear}` | Hapus tahun akademik  |
| POST      | `/api/academic-years/{academicYear}/activate` | Aktifkan tahun akademik |

---

## Classes

| Method    | Endpoint                     | Fungsi       |
| --------- | ---------------------------- | ------------ |
| GET       | `/api/classes`               | Daftar kelas |
| POST      | `/api/classes`               | Tambah kelas |
| GET       | `/api/classes/{schoolClass}` | Detail kelas |
| PUT/PATCH | `/api/classes/{schoolClass}` | Update kelas |
| DELETE    | `/api/classes/{schoolClass}` | Hapus kelas  |

---

## Teachers

| Method    | Endpoint                  | Fungsi      |
| --------- | ------------------------- | ----------- |
| GET       | `/api/teachers`           | Daftar guru |
| POST      | `/api/teachers`           | Tambah guru |
| GET       | `/api/teachers/{teacher}` | Detail guru |
| PUT/PATCH | `/api/teachers/{teacher}` | Update guru |
| DELETE    | `/api/teachers/{teacher}` | Hapus guru  |

---

## Subjects

| Method    | Endpoint                  | Fungsi                |
| --------- | ------------------------- | --------------------- |
| GET       | `/api/subjects`           | Daftar mata pelajaran |
| POST      | `/api/subjects`           | Tambah mata pelajaran |
| GET       | `/api/subjects/{subject}` | Detail mata pelajaran |
| PUT/PATCH | `/api/subjects/{subject}` | Update mata pelajaran |
| DELETE    | `/api/subjects/{subject}` | Hapus mata pelajaran  |

---

## Students

| Method    | Endpoint                  | Fungsi       |
| --------- | ------------------------- | ------------ |
| GET       | `/api/students`           | Daftar siswa |
| POST      | `/api/students`           | Tambah siswa |
| GET       | `/api/students/{student}` | Detail siswa |
| PUT/PATCH | `/api/students/{student}` | Update siswa |
| DELETE    | `/api/students/{student}` | Hapus siswa  |

---

## Class Students

| Method | Endpoint                                        | Fungsi                     |
| ------ | ----------------------------------------------- | -------------------------- |
| GET    | `/api/classes/{schoolClass}/students`           | Daftar siswa dalam kelas   |
| POST   | `/api/classes/{schoolClass}/students`           | Menambahkan siswa ke kelas |
| DELETE | `/api/classes/{schoolClass}/students/{student}` | Menghapus siswa dari kelas |

---

## Class Subjects / Teacher Placement

| Method | Endpoint                                             | Fungsi                              |
| ------ | ---------------------------------------------------- | ----------------------------------- |
| GET    | `/api/classes/{schoolClass}/subjects`                | Daftar mapel dan guru pada kelas    |
| POST   | `/api/classes/{schoolClass}/subjects`                | Menambahkan mapel dan guru ke kelas |
| PUT    | `/api/classes/{schoolClass}/subjects/{classSubject}` | Mengubah penempatan guru/mapel      |
| DELETE | `/api/classes/{schoolClass}/subjects/{classSubject}` | Menghapus penempatan                |

### Class Subject Classroom

| Method | Endpoint                                     | Fungsi                       |
| ------ | -------------------------------------------- | ---------------------------- |
| GET    | `/api/class-subjects/{classSubject}/students`| Daftar siswa pada class subject |
| GET    | `/api/class-subjects/{classSubject}/evaluation` | Rekap nilai evaluasi       |

---

## Homeroom Teacher

| Method | Endpoint                                      | Fungsi                         |
| ------ | --------------------------------------------- | ------------------------------ |
| GET    | `/api/classes/{schoolClass}/homeroom-teacher` | Mendapatkan wali kelas         |
| PUT    | `/api/classes/{schoolClass}/homeroom-teacher` | Menentukan/mengubah wali kelas |
| DELETE | `/api/classes/{schoolClass}/homeroom-teacher` | Menghapus wali kelas           |

---

## Extracurriculars

| Method    | Endpoint                                  | Fungsi                 |
| --------- | ----------------------------------------- | ---------------------- |
| GET       | `/api/extracurriculars`                   | Daftar ekstrakurikuler |
| POST      | `/api/extracurriculars`                   | Tambah ekstrakurikuler |
| GET       | `/api/extracurriculars/{extracurricular}` | Detail ekstrakurikuler |
| PUT/PATCH | `/api/extracurriculars/{extracurricular}` | Update ekstrakurikuler |
| DELETE    | `/api/extracurriculars/{extracurricular}` | Hapus ekstrakurikuler  |

### Extracurricular Teachers

| Method | Endpoint                                                     | Fungsi                      |
| ------ | ------------------------------------------------------------ | --------------------------- |
| GET    | `/api/extracurriculars/{extracurricular}/teachers`           | Daftar guru ekstrakurikuler |
| POST   | `/api/extracurriculars/{extracurricular}/teachers`           | Menambahkan guru            |
| DELETE | `/api/extracurriculars/{extracurricular}/teachers/{teacher}` | Menghapus guru              |

### Extracurricular Students

| Method | Endpoint                                                     | Fungsi                       |
| ------ | ------------------------------------------------------------ | ---------------------------- |
| GET    | `/api/extracurriculars/{extracurricular}/students`           | Daftar siswa ekstrakurikuler |
| POST   | `/api/extracurriculars/{extracurricular}/students`           | Menambahkan siswa            |
| DELETE | `/api/extracurriculars/{extracurricular}/students/{student}` | Menghapus siswa              |

---

## Daily Lessons

| Method | Endpoint                                                   | Fungsi               |
| ------ | ---------------------------------------------------------- | -------------------- |
| GET    | `/api/class-subjects/{classSubject}/lessons`               | Daftar pembelajaran  |
| POST   | `/api/class-subjects/{classSubject}/lessons`               | Membuat pembelajaran |
| GET    | `/api/class-subjects/{classSubject}/lessons/{dailyLesson}` | Detail pembelajaran  |
| PUT    | `/api/class-subjects/{classSubject}/lessons/{dailyLesson}` | Update pembelajaran  |
| DELETE | `/api/class-subjects/{classSubject}/lessons/{dailyLesson}` | Hapus pembelajaran   |

---

## Student Daily Progress

| Method | Endpoint                                        | Fungsi                   |
| ------ | ----------------------------------------------- | ------------------------ |
| GET    | `/api/lessons/{dailyLesson}/progress`           | Daftar progress siswa    |
| PUT    | `/api/lessons/{dailyLesson}/progress/{student}` | Update progress siswa    |

---

## Attendance

| Method | Endpoint                                        | Fungsi           |
| ------ | ----------------------------------------------- | ---------------- |
| GET    | `/api/class-subjects/{classSubject}/attendances` | Daftar absensi   |
| POST   | `/api/class-subjects/{classSubject}/attendances` | Tambah absensi   |
| GET    | `/api/attendances/{attendance}`                 | Detail absensi   |
| PUT    | `/api/attendances/{attendance}`                 | Update absensi   |
| DELETE | `/api/attendances/{attendance}`                 | Hapus absensi    |

---

## Reports

| Method | Endpoint                                      | Fungsi             |
| ------ | --------------------------------------------- | ------------------ |
| GET    | `/api/class-subjects/{classSubject}/report/pdf`| PDF laporan kelas  |
| GET    | `/api/students/{student}/report/pdf`          | PDF laporan siswa  |

Filter periode pada PDF laporan kelas (opsional):

| Parameter  | Wajib                     | Nilai                  | Keterangan                                      |
| ---------- | ------------------------- | ---------------------- | ----------------------------------------------- |
| `period`   | Tidak                     | `monthly`, `semester`  | Menentukan jenis filter periode.                |
| `month`    | Ya jika `period=monthly`  | `YYYY-MM`              | Bulan pembelajaran yang dicantumkan.            |
| `semester` | Ya jika `period=semester` | `ganjil`, `genap`      | Semester pada tahun ajaran class subject.       |

Tanpa parameter tersebut, seluruh pembelajaran tetap dicantumkan (perilaku lama). Contoh: `GET /api/class-subjects/{classSubject}/report/pdf?period=monthly&month=2025-08`.
