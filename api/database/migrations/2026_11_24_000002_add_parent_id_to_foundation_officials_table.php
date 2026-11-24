<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (Schema::hasColumn('foundation_officials', 'parent_id')) {
            return;
        }

        Schema::table('foundation_officials', function (Blueprint $table) {
            $table->foreignId('parent_id')
                ->nullable()
                ->after('id')
                ->constrained('foundation_officials')
                ->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('foundation_officials', function (Blueprint $table) {
            if (Schema::hasColumn('foundation_officials', 'parent_id')) {
                $table->dropConstrainedForeignId('parent_id');
            }
        });
    }
};
