<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('username')->unique()->nullable();
            $table->dropUnique('users_email_unique');
            $table->dropColumn('name');
            $table->dropColumn('email');
            $table->dropColumn('email_verified_at');
            $table->dropRememberToken();
        });
        $pass = $random = Str::random(40);
        DB::table('users')->insert([
            'username' => 'admin',
            'password' => Hash::make($pass),
        ]);
        file_put_contents('/tmp/ADMIN_PASS',$pass);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('username');
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->rememberToken();
        });
    }
};