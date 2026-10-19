<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class TeacherController extends Controller
{
    /**
     * Menampilkan daftar guru.
     */
    public function index(Request $request)
    {
        $teachers = User::query()
            ->where('role', 'teacher')
            ->when($request->search, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query->where('full_name', 'like', "%{$search}%")
                        ->orWhere('username', 'like', "%{$search}%")
                        ->orWhere('nip', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate(20);

        return response()->json($teachers);
    }

    /**
     * Menyimpan guru baru.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nip' => [
                'required',
                'string',
                'max:255',
                'unique:users,nip',
            ],
            'username' => [
                'required',
                'string',
                'max:50',
                'unique:users,username',
            ],
            'password' => [
                'required',
                'string',
                'min:8',
            ],
            'full_name' => [
                'required',
                'string',
                'max:100',
            ],
            'is_active' => [
                'sometimes',
                'boolean',
            ],
        ]);

        $teacher = User::create([
            'nip' => $validated['nip'],
            'username' => $validated['username'],
            'password' => Hash::make($validated['password']),
            'full_name' => $validated['full_name'],
            'role' => 'teacher',
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return response()->json([
            'message' => 'Guru berhasil ditambahkan.',
            'data' => $teacher,
        ], 201);
    }

    /**
     * Menampilkan detail guru.
     */
    public function show(User $teacher)
    {
        $this->ensureTeacher($teacher);

        return response()->json([
            'data' => $teacher,
        ]);
    }

    /**
     * Mengubah data guru.
     */
    public function update(Request $request, User $teacher)
    {
        $this->ensureTeacher($teacher);

        $validated = $request->validate([
            'nip' => [
                'required',
                'string',
                'max:255',
                Rule::unique('users', 'nip')->ignore($teacher->id),
            ],
            'username' => [
                'required',
                'string',
                'max:50',
                Rule::unique('users', 'username')->ignore($teacher->id),
            ],
            'password' => [
                'nullable',
                'string',
                'min:8',
            ],
            'full_name' => [
                'required',
                'string',
                'max:100',
            ],
            'is_active' => [
                'sometimes',
                'boolean',
            ],
        ]);

        $teacher->nip = $validated['nip'];
        $teacher->username = $validated['username'];
        $teacher->full_name = $validated['full_name'];

        if (array_key_exists('is_active', $validated)) {
            $teacher->is_active = $validated['is_active'];
        }

        if (!empty($validated['password'])) {
            $teacher->password = Hash::make($validated['password']);
        }

        // Pastikan role tetap teacher.
        $teacher->role = 'teacher';

        $teacher->save();

        return response()->json([
            'message' => 'Data guru berhasil diperbarui.',
            'data' => $teacher,
        ]);
    }

    /**
     * Menghapus guru.
     */
    public function destroy(User $teacher)
    {
        $this->ensureTeacher($teacher);

        $teacher->delete();

        return response()->json([
            'message' => 'Guru berhasil dihapus.',
        ]);
    }

    /**
     * Memastikan user adalah guru.
     */
    private function ensureTeacher(User $teacher): void
    {
        abort_if(
            $teacher->role !== 'teacher',
            404,
            'Guru tidak ditemukan.'
        );
    }
}
