<?php

namespace App\Http\Controllers;

use App\Models\FoundationOfficial;
use Illuminate\Http\Request;

class FoundationOfficialController extends Controller
{
    public function index()
    {
        $officials = FoundationOfficial::query()
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();

        return response()->json($officials);
    }

    public function store(Request $request)
    {
        $validated = $request->validate($this->rules());
        $validated['sort_order'] = $validated['sort_order'] ?? 0;

        $official = FoundationOfficial::create($validated);

        return response()->json($official, 201);
    }

    public function show(FoundationOfficial $foundationOfficial)
    {
        return response()->json($foundationOfficial);
    }

    public function update(
        Request $request,
        FoundationOfficial $foundationOfficial
    ) {
        $validated = $request->validate($this->rules());
        $validated['sort_order'] = $validated['sort_order'] ?? 0;

        $foundationOfficial->update($validated);

        return response()->json($foundationOfficial);
    }

    public function destroy(FoundationOfficial $foundationOfficial)
    {
        $foundationOfficial->delete();

        return response()->json([
            'message' => 'Pengurus yayasan berhasil dihapus.',
        ]);
    }

    private function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:100'],
            'position' => ['required', 'string', 'max:100'],
            'period' => ['nullable', 'string', 'max:50'],
            'phone' => ['nullable', 'string', 'max:30'],
            'email' => ['nullable', 'email', 'max:100'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
