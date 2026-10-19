AUTH
├── GET /api/user
└── POST /api/logout

TEACHER
├── GET /api/teacher/classes
└── GET /api/teacher/classes/{schoolClass}

CLASSROOM
├── GET /api/classes/{schoolClass}/students
└── GET /api/classes/{schoolClass}/subjects

LESSONS
├── GET /api/class-subjects/{classSubject}/lessons
├── POST /api/class-subjects/{classSubject}/lessons
├── GET /api/class-subjects/{classSubject}/lessons/{dailyLesson}
├── PUT /api/class-subjects/{classSubject}/lessons/{dailyLesson}
└── DELETE /api/class-subjects/{classSubject}/lessons/{dailyLesson}

PROGRESS
├── GET /api/lessons/{dailyLesson}/progress
├── POST /api/lessons/{dailyLesson}/progress
└── PUT /api/lessons/{dailyLesson}/progress/{student}

MONITORING
└── GET /api/teacher/classes/{schoolClass}/progress
