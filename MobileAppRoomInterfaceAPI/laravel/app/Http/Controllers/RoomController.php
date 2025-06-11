<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Log;
use App\Models\Room;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    public function start(Request $request)
    {
        $user = $request->user();

        $room = Room::create([
            'user_id' => $user->id,
            'room_number' => Room::max('room_number') + 1 ?? 1,
        ]);

        return response()->json($room);
    }

    public function change(Request $request)
    {
        $user = $request->user();
        $room = $user->rooms()->latest()->first();

        if (!$request->has(['service', 'value'])) {
            return response()->json(['message' => 'Bad Request'], 400);
        }

        $service = $request->input('service');
        $value = $request->input('value');

        $valid = [
            'room_colour' => ['green','blue','red','purple','pink','gold','yellow'],
            'curtains' => ['open','closed'],
            'music' => ['off','hiphop','jazz','disco'],
            'locked' => ['0','1'],
            'climate' => range(16,26),
            'do_not_disturb' => ['0','1'],
            'make_up_room' => ['0','1'],
        ];

        if (!isset($valid[$service]) || !in_array($value, array_map('strval', $valid[$service]))) {
            return response()->json(['message' => 'Bad Request'], 400);
        }

        $valueFrom = $room->{$service};
        $room->{$service} = $value;
        $room->save();

        Log::create([
            'room_id' => $room->id,
            'service' => $service,
            'value_from' => $valueFrom,
            'value_to' => $value,
        ]);

        return response()->json(['message' => 'Service updated']);
    }

    public function room(Request $request)
    {
        $user = $request->user();
        $room = $user->rooms()->latest()->first();

        if (!$room) {
            return response()->json(['message' => 'No room found'], 404);
        }

        return response()->json($room);
    }
}
