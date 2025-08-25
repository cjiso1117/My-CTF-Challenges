<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use App\Http\Middleware\DangerousWordFilter;
use App\Http\Controllers\FileController;

Route::post('/register', [AuthController::class, 'register'])->middleware(DangerousWordFilter::class);
Route::post('/login',    [AuthController::class, 'login'])->middleware(DangerousWordFilter::class);

// New public route for serving admin files
Route::get('/announcement/{filename}', [FileController::class, 'servePublicAdminFile'])->where('filename', '.*');
Route::get('/announcements', [FileController::class, 'serveAllPublicAdminFile']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->middleware(DangerousWordFilter::class);
    Route::get('/user', function (Request $request) {
        return $request->user();
    })->middleware(DangerousWordFilter::class);

    // File Upload and Download Routes
    Route::post('/upload', [FileController::class, 'upload'])->middleware(DangerousWordFilter::class);
    Route::get('/download/{filename}', [FileController::class, 'download'])->middleware(DangerousWordFilter::class);
    Route::get('/files', [FileController::class, 'getAllFiles']);

    // Admin command execution
    Route::post('/admin/testFile', [\App\Http\Controllers\AdminController::class, 'testFile']);
    Route::post('/admin/report', [\App\Http\Controllers\AdminController::class, 'report'])->middleware(DangerousWordFilter::class);

});
