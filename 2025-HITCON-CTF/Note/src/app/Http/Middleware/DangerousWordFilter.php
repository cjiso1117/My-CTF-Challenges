<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class DangerousWordFilter
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if($request->path()==="api/login") {
            return $next($request);
        }
        $dangerousWords = ['badword1', 'badword2', 'badword3', '..', 'admin']; // Added '..'
        $rawBody = $request->getContent();
        if (is_string($rawBody)) {
            foreach ($dangerousWords as $word) {
                if (stripos($rawBody, $word) !== false) {
                    return response()->json(['error' => 'Request contains dangerous words.'], 403);
                }
            }
        }

        return $next($request);
    }
}
