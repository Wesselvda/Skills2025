<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    function register(Request $request) {
        $credentials = $request->validate([
            'email' => 'required',
            'password' => 'required',
            'name' => 'required'
        ]);

        $user = User::create($credentials);

        if ($user) {
            return response([
                "message" => "User created successfully",
                "user" => [
                    "id" => $user->id,
                    "email" => $user->email,
                    "name" => $user->name,
                    "credits" => $user->credits
                ]
            ], 201);
        } else {
            return response([
                "message" => "Failed to register user"
            ], 400);
        }
    }

    function login(Request $request) {
        $credentials = $request->validate([
            'email' => 'required',
            'password' => 'required'
        ]);

        if (Auth::attempt($credentials)) {
            $user = Auth::user();

            return response([
                "message" => "Login successful",
                "user" => [
                    "id" => $user->id,
                    "email" => $user->email,
                    "name" => $user->name,
                    "credits" => $user->credits
                ],
                "token" => $user->createToken("user")->plainTextToken
            ]);
        } else {
            return response([
                "message" => "Invalid email or password"
            ], 401);
        }
    }

    function logout(Request $request) {
        $request->user()->currentAccessToken()->delete();

        return response([
            "message" => "Logout successful"
        ], 200);
    }

    function me() {
        $user = Auth::user();

        return response([
            "user" => [
                "id" => $user->id,
                "email" => $user->email,
                "name" => $user->name,
                "creditBalance" => $user->credits
            ],
            "stats" => [
                "enrolledCourses" => null, // TODO
                "completedChapters" => null,
                "totalCreditsEarned" => null,
                "upcomingBookings" => null
            ],
            "recentActivity" => []
        ]);
    }
}
