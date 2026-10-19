# API Documentation — E-Raport Pendamping

## Base URL

```text
/api
```

Semua endpoint yang berada di bawah bagian **Authenticated API** membutuhkan:

```http
Authorization: Bearer {token}
Accept: application/json
Content-Type: application/json
```

Autentikasi menggunakan **Laravel Sanctum**.

---

# 1. Academic Years

Mengelola tahun ajaran dan semester.

## 1.1 Get Academic Years

```http
GET /api/academic-years
```

Mengambil seluruh data tahun ajaran.

### Response

```json
[
    {
        "id": 1,
        "year_name": "2026/2027",
        "semester": "GANJIL",
        "is_active": true,
        "created_at": "2026-07-01T00:00:00.000000Z",
        "updated_at": "2026-07-01T00:00:00.000000Z"
    }
]
```

---

## 1.2 Get Academic Year

```http
GET /api/academic-years/{academicYear}
```

Mengambil detail satu tahun ajaran.

### Parameters

| Parameter      | Type    | Required | Description     |
| -------------- | ------- | -------- | --------------- |
| `academicYear` | integer | Yes      | ID tahun ajaran |

---

## 1.3 Create Academic Year

```http
POST /api/academic-years
```

Membuat tahun ajaran baru.

### Payload

```json
{
    "year_name": "2026/2027",
    "semester": "GANJIL",
    "is_active": true
}
```

### Fields

| Field       | Type    | Required | Description  |
| ----------- | ------- | -------- | ------------ |
| `year_name` | string  | Yes      | Tahun ajaran |
| `semester`  | string  | Yes      | Semester     |
| `is_active` | boolean | No       | Status aktif |

---

## 1.4 Update Academic Year

```http
PUT /api/academic-years/{academicYear}
```

### Payload

```json
{
    "year_name": "2026/2027",
    "semester": "GENAP",
    "is_active": true
}
```

---

## 1.5 Delete Academic Year

```http
DELETE /api/academic-years/{academicYear}
```

Menghapus tahun ajaran.

---

# 2. Classes

Mengelola data kelas.

## 2.1 Get Classes

```http
GET /api/classes
```

Mengambil seluruh kelas.

---

## 2.2 Get Class

```http
GET /api/classes/{schoolClass}
```

Mengambil detail kelas beserta relasi siswa, mata pelajaran, guru, dan wali kelas.

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
| `grade_level` | integer | Yes      | Tingkat kelas, 10–12 |

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
GET /api/subjects
```

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
    "code": "MTK",
    "name": "Matematika"
}
```

---

## 3.4 Update Subject

```http
PUT /api/subjects/{subject}
```

### Payload

```json
{
    "code": "MTK",
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
| `teacher_id`       | integer | Yes      | ID user dengan role `GURU` |

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
| `description` | string  | No       | Deskripsi            |
| `is_active`   | boolean | No       | Status aktif         |

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

Mengambil riwayat pembelajaran dari suatu kombinasi kelas + mata pelajaran.

### Response

```json
[
    {
        "id": 1,
        "class_subject_id": 5,
        "lesson_date": "2026-09-17",
        "title": "Persamaan Linear",
        "description": "Pembahasan persamaan linear satu variabel"
    }
]
```

---

## 11.2 Get Daily Lesson

```http
GET /api/class-subjects/{classSubject}/lessons/{dailyLesson}
```

Mengambil detail pembelajaran beserta progress siswa.

---

## 11.3 Create Daily Lesson

```http
POST /api/class-subjects/{classSubject}/lessons
```

### Payload

```json
{
    "lesson_date": "2026-09-17",
    "title": "Persamaan Linear",
    "description": "Pembahasan persamaan linear satu variabel"
}
```

### Fields

| Field         | Type   | Required | Description            |
| ------------- | ------ | -------- | ---------------------- |
| `lesson_date` | date   | Yes      | Tanggal pembelajaran   |
| `title`       | string | Yes      | Judul/materi           |
| `description` | string | No       | Deskripsi pembelajaran |

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

---

## 11.5 Delete Daily Lesson

```http
DELETE /api/class-subjects/{classSubject}/lessons/{dailyLesson}
```

---

# 12. Student Daily Progress

Mengatur tingkat pemahaman siswa pada pembelajaran tertentu.

## Understanding Level

Nilai yang tersedia:

```text
SANGAT_PAHAM
PAHAM
CUKUP
BELUM_PAHAM
```

---

## 12.1 Get Student Progress

```http
GET /api/lessons/{dailyLesson}/progress
```

### Response

```json
[
    {
        "id": 1,
        "daily_lesson_id": 10,
        "student_id": 20,
        "understanding_level": "PAHAM",
        "teacher_note": null,
        "student": {
            "id": 20,
            "nisn": "0012345678",
            "full_name": "Ahmad Fauzan"
        }
    }
]
```

---

## 12.2 Save Student Progress

```http
POST /api/lessons/{dailyLesson}/progress
```

Menyimpan progress banyak siswa sekaligus.

### Payload

```json
{
    "progress": [
        {
            "student_id": 20,
            "understanding_level": "SANGAT_PAHAM",
            "teacher_note": null
        },
        {
            "student_id": 21,
            "understanding_level": "PAHAM",
            "teacher_note": "Sudah memahami materi."
        },
        {
            "student_id": 22,
            "understanding_level": "CUKUP",
            "teacher_note": "Masih perlu latihan."
        },
        {
            "student_id": 23,
            "understanding_level": "BELUM_PAHAM",
            "teacher_note": "Perlu pendampingan lebih lanjut."
        }
    ]
}
```

### Fields

| Field                            | Type    | Required | Description           |
| -------------------------------- | ------- | -------- | --------------------- |
| `progress`                       | array   | Yes      | Daftar progress siswa |
| `progress.*.student_id`          | integer | Yes      | ID siswa              |
| `progress.*.understanding_level` | string  | Yes      | Tingkat pemahaman     |
| `progress.*.teacher_note`        | string  | No       | Catatan guru          |

Endpoint ini menggunakan `updateOrCreate`, sehingga bisa digunakan untuk **simpan pertama kali maupun menyimpan perubahan**.

---

## 12.3 Update Student Progress

```http
PUT /api/lessons/{dailyLesson}/progress/{student}
```

### Payload

```json
{
    "understanding_level": "SANGAT_PAHAM",
    "teacher_note": "Sudah menguasai materi."
}
```

---

# 13. Endpoint Summary

| Method | Endpoint                                    | Description            |
| ------ | ------------------------------------------- | ---------------------- |
| GET    | `/academic-years`                           | List tahun ajaran      |
| POST   | `/academic-years`                           | Tambah tahun ajaran    |
| GET    | `/academic-years/{id}`                      | Detail tahun ajaran    |
| PUT    | `/academic-years/{id}`                      | Edit tahun ajaran      |
| DELETE | `/academic-years/{id}`                      | Hapus tahun ajaran     |
| GET    | `/classes`                                  | List kelas             |
| POST   | `/classes`                                  | Tambah kelas           |
| GET    | `/classes/{id}`                             | Detail kelas           |
| PUT    | `/classes/{id}`                             | Edit kelas             |
| DELETE | `/classes/{id}`                             | Hapus kelas            |
| GET    | `/subjects`                                 | List mapel             |
| POST   | `/subjects`                                 | Tambah mapel           |
| GET    | `/subjects/{id}`                            | Detail mapel           |
| PUT    | `/subjects/{id}`                            | Edit mapel             |
| DELETE | `/subjects/{id}`                            | Hapus mapel            |
| GET    | `/students`                                 | List siswa             |
| POST   | `/students`                                 | Tambah siswa           |
| GET    | `/students/{id}`                            | Detail siswa           |
| PUT    | `/students/{id}`                            | Edit siswa             |
| DELETE | `/students/{id}`                            | Hapus siswa            |
| GET    | `/classes/{id}/students`                    | Siswa dalam kelas      |
| POST   | `/classes/{id}/students`                    | Tambah siswa ke kelas  |
| DELETE | `/classes/{id}/students/{student}`          | Hapus siswa dari kelas |
| GET    | `/classes/{id}/subjects`                    | Mapel/guru kelas       |
| POST   | `/classes/{id}/subjects`                    | Assign mapel + guru    |
| PUT    | `/classes/{id}/subjects/{classSubject}`     | Edit assignment        |
| DELETE | `/classes/{id}/subjects/{classSubject}`     | Hapus assignment       |
| GET    | `/classes/{id}/homeroom-teacher`            | Lihat wali kelas       |
| PUT    | `/classes/{id}/homeroom-teacher`            | Assign/ubah wali kelas |
| DELETE | `/classes/{id}/homeroom-teacher`            | Hapus wali kelas       |
| GET    | `/extracurriculars`                         | List ekstrakurikuler   |
| POST   | `/extracurriculars`                         | Tambah ekstrakurikuler |
| GET    | `/extracurriculars/{id}`                    | Detail ekstrakurikuler |
| PUT    | `/extracurriculars/{id}`                    | Edit ekstrakurikuler   |
| DELETE | `/extracurriculars/{id}`                    | Hapus ekstrakurikuler  |
| GET    | `/extracurriculars/{id}/teachers`           | List guru ekskul       |
| POST   | `/extracurriculars/{id}/teachers`           | Assign guru ekskul     |
| DELETE | `/extracurriculars/{id}/teachers/{teacher}` | Hapus guru ekskul      |
| GET    | `/extracurriculars/{id}/students`           | List siswa ekskul      |
| POST   | `/extracurriculars/{id}/students`           | Tambah siswa ekskul    |
| DELETE | `/extracurriculars/{id}/students/{student}` | Hapus siswa ekskul     |
| GET    | `/class-subjects/{id}/lessons`              | Riwayat pembelajaran   |
| POST   | `/class-subjects/{id}/lessons`              | Tambah pembelajaran    |
| GET    | `/class-subjects/{id}/lessons/{lesson}`     | Detail pembelajaran    |
| PUT    | `/class-subjects/{id}/lessons/{lesson}`     | Edit pembelajaran      |
| DELETE | `/class-subjects/{id}/lessons/{lesson}`     | Hapus pembelajaran     |
| GET    | `/lessons/{id}/progress`                    | List progress siswa    |
| POST   | `/lessons/{id}/progress`                    | Simpan progress siswa  |
| PUT    | `/lessons/{id}/progress/{student}`          | Edit progress siswa    |

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
Assigned Classes
  ↓
Class Subject
  ↓
Daily Lessons
  ↓
Student Daily Progress
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

# API Endpoint

Base URL:

`/api`

Semua endpoint berada di dalam middleware:

`auth:sanctum`

---

## Auth

| Method | Endpoint      | Fungsi                             |
| ------ | ------------- | ---------------------------------- |
| GET    | `/api/user`   | Mendapatkan user yang sedang login |
| POST   | `/api/logout` | Logout user                        |

---

## Teacher

| Method | Endpoint               | Fungsi                                               |
| ------ | ---------------------- | ---------------------------------------------------- |
| GET    | `/api/teacher/classes` | Mendapatkan kelas yang diampu guru yang sedang login |

---

## Academic Year

| Method    | Endpoint                             | Fungsi                |
| --------- | ------------------------------------ | --------------------- |
| GET       | `/api/academic-years`                | Daftar tahun akademik |
| POST      | `/api/academic-years`                | Tambah tahun akademik |
| GET       | `/api/academic-years/{academicYear}` | Detail tahun akademik |
| PUT/PATCH | `/api/academic-years/{academicYear}` | Update tahun akademik |
| DELETE    | `/api/academic-years/{academicYear}` | Hapus tahun akademik  |

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
| POST   | `/api/lessons/{dailyLesson}/progress`           | Menyimpan progress siswa |
| PUT    | `/api/lessons/{dailyLesson}/progress/{student}` | Update progress siswa    |
