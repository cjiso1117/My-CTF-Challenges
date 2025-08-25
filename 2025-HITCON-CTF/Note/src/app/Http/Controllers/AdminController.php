<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
class AdminController extends Controller
{
    public function testFile(Request $request)
    {
        $user = Auth::user();
        if ($user->username !== 'admin') {
            return response()->json( ['error' => 'Unauthenticated.'], 401);
        }
        $file = basename($request->input("file"));
        $dst = uniqid();
        if(preg_match('/[\$;\n\r`\.&|<>#\'"()*?:]|flag/', $file)) {
            return response()->json(['error'=>"Be a nice hacker"]);
        }
        $file = "../storage/app/private/admin/" . $file;

        if(!file_exists($file)){
            return response()->json(['error'=>"$file not exist"]);
        }
        exec("cp $file $dst");
        
        return response()->json(['output' => "/$dst"]);
    }


    public function report(Request $request) {
        $user = Auth::user();
        if ($user->username === 'admin') {
            return response()->json( ['error' => 'lonely?'], 400);
        }
        $url = $request->input("url");
        $cmd = "node ../visitor.js ".escapeshellarg($url);
        exec($cmd);
        return response()->json(['message'=>'ok', "cmd"=>$cmd]);
    }
}