AUTH
├── GET /api/user
├── GET /api/profile
├── PUT /api/profile
├── PUT /api/profile/password
└── POST /api/logout

DASHBOARD
└── GET /api/dashboard

TEACHER
├── GET /api/teacher/classes
├── GET /api/teacher/homeroom-classes
└── GET /api/teacher/classes/{schoolClass}

CLASSROOM
├── GET /api/classes/{schoolClass}/students
├── GET /api/classes/{schoolClass}/subjects
├── GET /api/class-subjects/{classSubject}/students
└── GET /api/class-subjects/{classSubject}/evaluation

LESSONS
├── GET /api/class-subjects/{classSubject}/lessons
├── POST /api/class-subjects/{classSubject}/lessons
├── GET /api/class-subjects/{classSubject}/lessons/{dailyLesson}
├── PUT /api/class-subjects/{classSubject}/lessons/{dailyLesson}
└── DELETE /api/class-subjects/{classSubject}/lessons/{dailyLesson}

PROGRESS
├── GET /api/lessons/{dailyLesson}/progress
└── PUT /api/lessons/{dailyLesson}/progress/{student}

ATTENDANCE
├── GET /api/class-subjects/{classSubject}/attendances
├── POST /api/class-subjects/{classSubject}/attendances
├── GET /api/attendances/{attendance}
├── PUT /api/attendances/{attendance}
└── DELETE /api/attendances/{attendance}

MONITORING
└── GET /api/teacher/classes/{schoolClass}/progress

ACADEMIC YEAR
└── POST /api/academic-years/{academicYear}/activate
