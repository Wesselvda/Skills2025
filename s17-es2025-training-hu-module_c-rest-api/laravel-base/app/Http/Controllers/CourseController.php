<?php

namespace App\Http\Controllers;

use App\Models\Chapter;
use App\Models\ChapterCompletion;
use App\Models\Course;
use App\Models\Enrollment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CourseController extends Controller
{
    function index()
    {
        $user = Auth::user();
        $courses = Course::with(['chapters'])->get();
        $mappedCourses = [];

        foreach ($courses as $course) {
            if ($user) $enrolledCourse = Enrollment::with('completed_chapters')->where('course_id', $course->id)->where('user_id', $user->id)->first();
            $totalCredits = 0;

            foreach ($course->chapters as $chapter) {
                $totalCredits += $chapter->credits;
            }

            array_push($mappedCourses, [
                "id" => $course->id,
                "title" => $course->title,
                "description" => $course->description,
                "difficulty" => $course->difficulty,
                "totalChapters" => count($course->chapters),
                "totalCredits" => $totalCredits,
                "isEnrolled" => (isset($enrolledCourse) && $enrolledCourse !== null)
            ]);
        }

        return [
            'courses' => $mappedCourses
        ];
    }

    function course(Request $request, $id)
    {
        $course = Course::with('chapters')->find($id);
        $user = Auth::user();

        if ($course) {
            if ($user) $enrolledCourse = Enrollment::with('completed_chapters')->where('course_id', $course->id)->where('user_id', $user->id)->first();

            $totalCredits = 0;
            $mappedChapters = [];

            foreach ($course->chapters as $chapter) {
                $totalCredits += $chapter->credits;

                $isCompleted = false;

                if (isset($enrolledCourse) && $enrolledCourse !== null) {
                    $chapterCompletion = ChapterCompletion::where('enrollment_id', $enrolledCourse->id)->where('chapter_id', $chapter->id)->first();
                    if ($chapterCompletion) {
                        $isCompleted = true;
                    }
                }

                array_push($mappedChapters, [
                    'id' => $chapter->id,
                    'title' => $chapter->title,
                    'description' => $chapter->description,
                    'credits' => $chapter->credits,
                    'isCompleted' => $isCompleted,
                ]);
            }

            return response([
                "course" => [
                    'id' => $course->id,
                    'title' => $course->title,
                    'description' => $course->description,
                    'difficulty' => $course->difficulty,
                    "totalChapters" => count($course->chapters),
                    "totalCredits" => $totalCredits,
                    "isEnrolled" => (isset($enrolledCourse) && $enrolledCourse !== null),
                    "chapters" => $mappedChapters
                ]
            ]);
        } else {
            return response([
                "message" => "Course not found"
            ], 404);
        }
    }

    function enrollCourse($id)
    {
        $course = Course::find($id);
        $user = Auth::user();

        if ($course) {
            $enrolledCourse = Enrollment::where('course_id', $course->id)->where('user_id', $user->id)->first();

            if ($enrolledCourse) {
                return response([
                    "message" => "Already enrolled in this course"
                ], 409);
            } else {
                Enrollment::create([
                    'course_id' => $course->id,
                    'user_id' => $user->id
                ]);

                return response([
                    "message" => "Successfully enrolled in course"
                ]);
            }
        } else {
            return response([
                "message" => "Course not found"
            ], 404);
        }
    }

    function completeChapter(Request $request, $course_id, $id)
    {
        $chapter = Chapter::find($id);
        $user = $request->user();

        if ($chapter) {
            $enrolledCourse = Enrollment::where('course_id', $chapter->course_id)->where('user_id', $user->id)->first();

            if ($enrolledCourse) {
                $chapterCompletion = ChapterCompletion::where('enrollment_id', $enrolledCourse->id)->where('chapter_id', $chapter->id)->first();

                if ($chapterCompletion) {
                    return response([
                        "message" => "Chapter already completed"
                    ], 409);
                } else {
                    ChapterCompletion::create([
                        'enrollment_id' => $enrolledCourse->id,
                        'chapter_id' => $chapter->id
                    ]);

                    $user->credits += $chapter->credits;
                    $user->save();

                    return response([
                        "message" => "Chapter completed",
                        "creditsEarned" => $chapter->credits,
                        "newBalance" => $user->credits
                    ], 200);
                }
            } else {
                return response([
                    "message" => "Not enrolled in this course"
                ], 403);
            }
        } else {
            return response([
                "message" => "Course not found"
            ], 404);
        }
    }
}
