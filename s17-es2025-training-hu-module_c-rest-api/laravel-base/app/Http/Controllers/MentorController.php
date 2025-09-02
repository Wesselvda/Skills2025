<?php

namespace App\Http\Controllers;

use App\Models\MentorSessions;
use App\Models\SessionBooking;
use Illuminate\Http\Request;

class MentorController extends Controller
{
    function sessions() {
        $sessions = MentorSessions::all();
        $mappedSessions = [];

        foreach ($sessions as $session) {
            $bookedSession = SessionBooking::where('mentor_session_id', $session->id)->first();
            $isAvailable = !(isset($bookedSession) && $bookedSession != null);

            array_push($mappedSessions, [
                'id' => $session->id,
                'mentorName' => $session->mentorName,
                'expertise' => $session->expertise,
                'experienceLevel' => $session->experienceLevel,
                'sessionDate' => $session->sessionDate,
                'durationMinutes' => $session->durationMinutes,
                'creditCost' => $session->creditCost,
                'isAvailable' => $isAvailable
            ]);
        }

        return $mappedSessions;
    }

    function book(Request $request, $id) {
        $session = MentorSessions::find($id);
        $user = $request->user();

        if ($session) {
            $bookedSession = SessionBooking::where('mentor_session_id', $session->id)->first();

            if (!$bookedSession) {
                if ($user->credits <= $session->creditCost) {
                    return response([
                        "message" => "Insufficient credits"
                    ], 403);
                }

                $booking = SessionBooking::create([
                    'mentor_session_id' => $session->id,
                    'user_id' => $user->id,
                    'status' => 'pending',
                ]);

                return response([
                    "message" => "Session booked successfully",
                    "booking" => [
                        "id" => $booking->id,
                        "sessionId" => $booking->mentor_session_id,
                        "status" => $booking->status,
                        "creditsPaid" => $session->creditCost,
                        "bookedAt" => $booking->created_at
                    ]
                ], 200);
            }
        }

        return response([
            "message" => "Session not available"
        ], 409);
    }
}
