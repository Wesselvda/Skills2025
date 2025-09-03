<?php

namespace App\Http\Controllers;

use App\Models\Enrollment;
use App\Models\SessionBooking;
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

        $enrolledCourses = Enrollment::with('completed_chapters.chapter')->where('user_id', $user->id)->get();

        $recentActivity = [];
        $completedChapters = [];
        $totalCreditsEarned = 0;

        foreach ($enrolledCourses as $enrolledCourse) {
            array_push($completedChapters, $enrolledCourse->completed_chapters);

            foreach ($enrolledCourse->completed_chapters as $completedChapter) {
                $totalCreditsEarned += $completedChapter->chapter->credits;

                array_push($recentActivity, [
                    "type" => "chapter_completed",
                    "description" => "Completed chapter " . $completedChapter->chapter->id,
                    "creditsEarned" => $completedChapter->chapter->credits,
                    "timestamp" => $completedChapter->created_at
                ]);
            }
        }

        $upcomingBookings = SessionBooking::with('session')->where('user_id', $user->id)->get();

        foreach ($upcomingBookings as $booking) {
            array_push($recentActivity, [
                "type" => "session_booked",
                "description" => "Booked session with " . $booking->session->mentorName,
                "creditsEarned" => $booking->session->creditCost,
                "timestamp" => $booking->created_at
            ]);
        }

        return response([
            "user" => [
                "id" => $user->id,
                "email" => $user->email,
                "name" => $user->name,
                "creditBalance" => $user->credits
            ],
            "stats" => [
                "enrolledCourses" => count($enrolledCourses),
                "completedChapters" => count($completedChapters),
                "totalCreditsEarned" => $totalCreditsEarned,
                "upcomingBookings" => count($upcomingBookings)
            ],
            "recentActivity" => $recentActivity
        ]);
    }
}
