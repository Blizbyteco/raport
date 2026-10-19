<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TeacherSubjectResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,

            'subject' => [
                'id' => $this->subject->id,
                'name' => $this->subject->name,
            ],

            'classroom' => [
                'id' => $this->schoolClass->id,
                'name' => $this->schoolClass->name,
                'grade_level' => $this->schoolClass->grade_level,
                'student_count' => $this->schoolClass->class_students_count,
            ],
        ];
    }
}
