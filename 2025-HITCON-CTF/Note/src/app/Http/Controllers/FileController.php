<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth; // To get the authenticated user

class FileController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|file|max:5', // Max 10MB file size
        ]);

        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Unauthenticated.'], 401);
        }

        // Sanitize username
        $username = basename($user->username); // Ensure no path traversal in username

        // Determine disk and path based on admin status
        $disk = 'local';
        $basePath = 'uploads/' . $username;
        $publicUrl = null; // To store the public URL if applicable
        // Assuming 'is_admin' property exists on the User model
        if ($user->username === 'admin') {
            $disk = 'local'; // Corrected disk for admin
            $basePath = 'admin/';
        }

        if (!Storage::disk($disk)->exists($basePath)) {
            Storage::disk($disk)->makeDirectory($basePath);
        }

        $filePath = $request->file('file')->store($basePath); // Corrected storeAs parameter

        if (isset($user->is_admin) && $user->is_admin) { // Corrected publicUrl logic
            $publicUrl = "/api/announcement/".basename($filePath);
        }

        return response()->json([
            'message' => 'File uploaded successfully',
            'path' => basename($filePath),
            'disk' => $disk,
            'public_url' => $publicUrl // Will be null if not public
        ], 200);
    }

    public function getAllFiles()
    {
        $user = Auth::user();

        // Sanitize username
        $username = basename($user->username); // Ensure no path traversal in username

        $basePath = 'uploads/' . $username;
        if ($user->username === 'admin') {
            $basePath = 'admin/';
        }

        $files = Storage::disk('local')->files($basePath);
        $fileContents = [];
        foreach ($files as $file) {
            $fileContents[] = [
                'name' => basename($file),
                'content' => Storage::disk('local')->get($file)
            ];
        }

        return response()->json($fileContents);
    }

    public function download($filename = null)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Unauthenticated.'], 401);
        }

        // Sanitize username
        $username = basename($user->username); // Ensure no path traversal in username

        // Sanitize filename
        $filename = basename($filename); // Extract actual filename

        $filePath = 'uploads/' . $username . '/' . $filename; // Always from private storage for download API

        if (!Storage::disk('local')->exists($filePath)) {
            return response()->json(['error' => 'File not found.'], 404);
        }

        return Storage::disk('local')->download($filePath);
    }

    public function servePublicAdminFile($filename = null)
    {
        $filename = basename($filename); // Extract actual filename

        $filePath = 'admin/'  . $filename;

        if (!Storage::disk('local')->exists($filePath)) {
            return response()->json(['error' => 'File not found.'], 404);
        }

        return Storage::disk('local')->response($filePath); // Changed to response()
    }

    public function serveAllPublicAdminFile()
    {
        $basePath = 'admin/';
        $files = Storage::disk('local')->files($basePath);
        $fileContents = [];
        foreach ($files as $file) {
            $fileContents[] = [
                'name' => basename($file),
                'content' => Storage::disk('local')->get($file)
            ];
        }

        return response()->json($fileContents);
    }

}