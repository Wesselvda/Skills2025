<?php

namespace Database\Seeders;

use App\Models\Chapter;
use App\Models\Course;
use App\Models\MentorSessions;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

        $courseOne = Course::create([
            "title" => "Web Development Fundamentals",
            "description" => "Learn the basics of HTML, CSS, and JavaScript",
            "difficulty" => "beginner"
        ]);

        $courseTwo = Course::create([
            "title" => "Advanced React Development",
            "description" => "Master React hooks, context, and advanced patterns",
            "difficulty" => "advanced",
        ]);

        Chapter::create([
            'course_id' => $courseOne->id,
            'title' => 'HTML Structure and Semantics',
            "description" => "Learn proper HTML document structure",
            "credits" => 4,
        ]);
        
        Chapter::create([
            'course_id' => $courseOne->id,
            'title' => 'CSS Styling and Layout',
            "description" => "Master CSS selectors and layout techniques",
            "credits" => 4,
        ]);

        MentorSessions::create([
            "mentorName" => "Sarah Johnson",
            "expertise" => "Frontend Development",
            "experienceLevel" => "senior",
            "sessionDate" => "2025-08-19T14:00:00.000Z",
            "durationMinutes" => 60,
            "creditCost" => 15,
        ]);

        MentorSessions::create([
            "mentorName" => "Michael Brown",
            "expertise" => "Backend Development",
            "experienceLevel" => "senior",
            "sessionDate" => "2025-08-20T10:00:00.000Z",
            "durationMinutes" => 60,
            "creditCost" => 14,
        ]);
    }
}
