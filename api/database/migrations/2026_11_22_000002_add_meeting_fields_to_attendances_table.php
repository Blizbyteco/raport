<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('attendances', function (Blueprint $table) {
            if (! Schema::hasColumn('attendances', 'meeting_number')) {
                $table->unsignedInteger('meeting_number')->nullable()->after('date');
            }

            if (! Schema::hasColumn('attendances', 'topic')) {
                $table->string('topic', 150)->nullable()->after('meeting_number');
            }
        });
    }

    public function down(): void
    {
        Schema::table('attendances', function (Blueprint $table) {
            if (Schema::hasColumn('attendances', 'topic')) {
                $table->dropColumn('topic');
            }

            if (Schema::hasColumn('attendances', 'meeting_number')) {
                $table->dropColumn('meeting_number');
            }
        });
    }
};
