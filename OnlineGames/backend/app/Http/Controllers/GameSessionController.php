<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Game;
use App\Models\User;
use App\Models\GameSession;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class GameSessionController extends Controller
{
    public function start($id)
    {
        $user = User::findOrFail(Auth::user()->id);
        $game = Game::findOrFail($id);

        if ($user->credits < $game->credit_cost) {
            return response()->json(['message' => 'Not enough credits'], 403);
        }

        if ($user->gameSessions()->whereNull('ended_at')->exists()) {
            return response()->json(['message' => 'You are already in a game'], 403);
        }

        $user->credits -= $game->credit_cost;
        $user->save();

        $session = GameSession::create([
            'user_id' => $user->id,
            'game_id' => $game->id,
            'started_at' => now(),
        ]);

        return response()->json($session);
    }

    public function end($id)
    {
        $session = GameSession::findOrFail($id);
        $session->ended_at = now();
        $session->save();

        return response()->json(['message' => 'Game session ended']);
    }

    public function activeSession()
    {
        $session = GameSession::where('user_id', Auth::id())
            ->whereNull('ended_at')
            ->with('game')
            ->first();

        return response()->json(['session' => $session]);
    }
}
