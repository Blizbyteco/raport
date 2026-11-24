import { BrowserRouter, Routes, Route } from "react-router";

import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "./ProtectedRoute";
import RootRedirect from "./RootRedirect";

import DashboardPage from "@/features/dashboard/pages/DashboardPage";
import StudentsPage from "@/features/students/pages/StudentsPage";
import StudentDetailPage from "@/features/students/pages/StudentDetailPage";
import CreateStudentPage from "@/features/students/pages/CreateStudentPage";
import ImportStudentsPage from "@/features/students/pages/ImportStudentsPage";
import TeachersPage from "@/features/teachers/pages/TeachersPage";
import TeacherDetailPage from "@/features/teachers/pages/TeacherDetailPage";
import CreateTeacherPage from "@/features/teachers/pages/CreateTeacherPage";
import ImportTeachersPage from "@/features/teachers/pages/ImportTeachersPage";
import ClassPage from "@/features/class/pages/ClassPage";
import SubjectsPage from "@/features/subjects/pages/SubjectsPage";
import StudentPlacementPage from "@/features/student-placement/pages/StudentPlacementPage";
import StudentPlacementDetailPage from "@/features/student-placement/pages/StudentPlacementDetailPage";
import StudentPlacementAddPage from "@/features/student-placement/pages/StudentPlacementAddPage";
import ExtracurricularsPage from "@/features/extracurriculars/pages/ExtracurricularsPage";
import TeacherHomePage from "@/features/teacher/pages/TeacherHomePage";
import ClassroomPage from "@/features/teacher/pages/ClassroomPage";
import ClassScheduleDetailPage from "@/features/teacher/pages/ClassScheduleDetailPage";
import LearningProgressCreatePage from "@/features/teacher/pages/LearningProgressCreatePage";
import HomeroomMonitoringPage from "@/features/teacher/pages/HomeroomMonitoringPage";
import TeacherPlacementPage from "@/features/teacher-placement/pages/TeacherPlacementPage";
import TeacherPlacementDetailPage from "@/features/teacher-placement/pages/TeacherPlacementDetailPage";
import LoginPage from "@/features/auth/page/LoginPage";
import LearningProgressUpdatePage from "@/features/teacher/pages/LearningProgressUpdate";
import ClassroomEvaluationPage from "@/features/teacher/pages/ClassroomEvaluationPage";
import AttendanceHistoryPage from "@/features/attendance/pages/AttendanceHistoryPage";
import AttendanceDetailPage from "@/features/attendance/pages/AttendanceDetailPage";
import AttendanceFormPage from "@/features/attendance/pages/AttendanceFormPage";
import StudentProgressDetailPage from "@/features/teacher/pages/StudentProgressDetailPage";
import ProfilePage from "@/features/profiles/pages/ProfilePage";
import CreateAcademicYearPage from "@/features/academic-year/pages/CreateAcademicYearPage";
import AcademicYearsPage from "@/features/academic-year/pages/AcademicYearsPage";
import EditAcademicYearPage from "@/features/academic-year/pages/EditAcademicYearPage";
import FoundationStructurePage from "@/features/foundation/pages/FoundationStructurePage";

const Routers = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Admin & head of foundation (read-only) */}
        <Route element={<ProtectedRoute roles={["admin", "leader"]} />}>
          <Route element={<MainLayout />}>
            <Route path="dashboard">
              <Route index element={<DashboardPage />} />
              <Route path="academic-year" element={<AcademicYearsPage />} />

              <Route element={<ProtectedRoute roles={["admin"]} />}>
                <Route
                  path="academic-year/create"
                  element={<CreateAcademicYearPage />}
                />
                <Route
                  path="academic-year/:id/edit"
                  element={<EditAcademicYearPage />}
                />
              </Route>

              <Route path="students">
                <Route index element={<StudentsPage />} />
                <Route element={<ProtectedRoute roles={["admin"]} />}>
                  <Route path="create" element={<CreateStudentPage />} />
                  <Route path="import" element={<ImportStudentsPage />} />
                </Route>
                <Route path=":id" element={<StudentDetailPage />} />
              </Route>

              <Route path="teachers">
                <Route index element={<TeachersPage />} />
                <Route element={<ProtectedRoute roles={["admin"]} />}>
                  <Route path="create" element={<CreateTeacherPage />} />
                  <Route path="import" element={<ImportTeachersPage />} />
                </Route>
                <Route path=":id" element={<TeacherDetailPage />} />
              </Route>

              <Route path="classes">
                <Route index element={<ClassPage />} />
              </Route>

              <Route path="subjects">
                <Route index element={<SubjectsPage />} />
              </Route>

              <Route path="extracurriculars">
                <Route index element={<ExtracurricularsPage />} />
              </Route>

              <Route path="foundation">
                <Route index element={<FoundationStructurePage />} />
              </Route>

              <Route path="student-placement">
                <Route index element={<StudentPlacementPage />} />
                <Route
                  path=":classId"
                  element={<StudentPlacementDetailPage />}
                />
                <Route element={<ProtectedRoute roles={["admin"]} />}>
                  <Route
                    path=":classId/add"
                    element={<StudentPlacementAddPage />}
                  />
                </Route>
              </Route>

              <Route
                path="teacher-placement"
                element={<TeacherPlacementPage />}
              />

              <Route
                path="teacher-placement/:classId"
                element={<TeacherPlacementDetailPage />}
              />
            </Route>
          </Route>
        </Route>

        {/* Teacher */}
        <Route element={<ProtectedRoute roles={["teacher"]} />}>
          <Route element={<MainLayout />}>
            <Route path="teacher">
              <Route index element={<TeacherHomePage />} />
              <Route path="class/:classSubjectId" element={<ClassroomPage />} />
              <Route
                path="class/:classSubjectId/progress/create"
                element={<LearningProgressCreatePage />}
              />
              <Route
                path="class/:classSubjectId/progress/:dailyLessonId"
                element={<LearningProgressUpdatePage />}
              />
              <Route
                path="class/:classSubjectId/evaluation"
                element={<ClassroomEvaluationPage />}
              />
              <Route
                path="class/:classSubjectId/evaluation/:studentId"
                element={<StudentProgressDetailPage />}
              />
              <Route
                path="class/:classSubjectId/attendance"
                element={<AttendanceFormPage />}
              />
              <Route
                path="class/:classSubjectId/attendance/new"
                element={<AttendanceFormPage />}
              />
              <Route
                path="class/:classSubjectId/attendance/:attendanceId/edit"
                element={<AttendanceFormPage />}
              />
              <Route
                path="class/:classSubjectId/attendance/history"
                element={<AttendanceHistoryPage />}
              />
              <Route
                path="class/:classSubjectId/attendance/history/:attendanceId"
                element={<AttendanceDetailPage />}
              />
              <Route
                path="class/monitoring/:classId"
                element={<HomeroomMonitoringPage />}
              />
              <Route
                path="class/monitoring"
                element={<HomeroomMonitoringPage />}
              />
              <Route
                path="class/:classSubjectId/schedule"
                element={<ClassScheduleDetailPage />}
              />
            </Route>
          </Route>
        </Route>

        {/* Common */}
        <Route element={<ProtectedRoute roles={["admin", "teacher", "leader"]} />}>
          <Route element={<MainLayout />}>
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Routers;
