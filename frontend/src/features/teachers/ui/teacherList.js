import { teachers as initialTeachers } from "@/shared/data/teachers.json";

let teacherList = [...initialTeachers];

export const getTeachers = () => teacherList;

export const removeTeacher = (nip) => {
  teacherList = teacherList.filter((teacher) => teacher.nip !== nip);

  return teacherList;
};

export const updateTeacher = (originalNip, changes) => {
  teacherList = teacherList.map((teacher) =>
    teacher.nip === originalNip ? { ...teacher, ...changes } : teacher,
  );

  return teacherList;
};
