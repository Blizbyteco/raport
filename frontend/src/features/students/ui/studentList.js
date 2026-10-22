import { students as initialStudents } from "@/shared/data/students.json";

let studentList = [...initialStudents];

export const getStudents = () => studentList;

export const removeStudent = (nis) => {
  studentList = studentList.filter((student) => student.nis !== nis);

  return studentList;
};

export const updateStudent = (originalNis, changes) => {
  studentList = studentList.map((student) =>
    student.nis === originalNis ? { ...student, ...changes } : student,
  );

  return studentList;
};
