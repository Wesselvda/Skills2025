<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Game;
use App\Models\GameSession;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class AdminController extends Controller
{
    public function checkToken(Request $request) {
        if ($request->header('X-Admin-Token') !== 'A3D09C62636CEA57A676D5D6F0B246A1') {
            return response()->json(['message' => 'Invalid token'], 401);
        }
    }

    public function login(Request $request) {
        $validated = $request->validate([
            'username' => 'required',
            'password' => 'required',
        ]);

        if ($validated['username'] === "Admin" && $validated['password'] === "aDmin123!HasH") {
            return response()->json(['token' => 'A3D09C62636CEA57A676D5D6F0B246A1']);
        } else {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }
    }

    public function checkLoggedIn(Request $request) {
        $this->checkToken($request);

        return response()->json(['success' => true]);
    }

    public function getData(Request $request) {
        $this->checkToken($request);

        $users = User::withCount('gameSessions')->withSum('creditTransactions', 'amount')->get();
        $games = Game::orderBy('order')->get();

        $currentlyAvailableGames = Game::count();
        $gamesEveryPlayedCount = GameSession::count();
        $creditSpendCount = $users->sum('credit_transactions_sum_amount');
        $userCount = $users->count();

        $avaragePlayPerUser = round($games->count() / $userCount, 2);
        $avarageCreditUse = round($creditSpendCount / $userCount, 2);

        return response()->json([
            'users' => $users,
            'games' => $games,
            'gameData' => [
                'currentlyAvailableGames' => $currentlyAvailableGames,
                'gamesEveryPlayedCount' => $gamesEveryPlayedCount,
                'creditSpendCount' => $creditSpendCount,
                'userCount' => $userCount,
                'avaragePlayPerUser' => $avaragePlayPerUser,
                'avarageCreditUse' => $avarageCreditUse,
            ]
        ]);
    }

    public function deactivateUser(Request $request, $id) {
        $this->checkToken($request);

        $user = User::findOrFail($id);
        $user->active = false;
        $user->save();

        return response()->json(['message' => 'User deactivated successfully']);
    }

    public function anonymizeUser(Request $request, $id) {
        $this->checkToken($request);

        $user = User::findOrFail($id);
        $user->active = false;
        $user->email = null;
        $user->name = null;
        $user->save();

        return response()->json(['message' => 'User anonymized successfully']);
    }

    public function toggleGameActive(Request $request, $id) {
        $this->checkToken($request);

        $request->validate([
            'active' => 'required|boolean',
        ]);

        $game = Game::findOrFail($id);
        $game->active = $request->input('active');
        $game->save();

        return response()->json(['message' => 'Game status updated']);
    }

    public function reorderGames(Request $request)
    {
        $this->checkToken($request);

        $request->validate([
            'game_ids' => 'required|array',
        ]);

        foreach ($request->game_ids as $index => $gameId) {
            Game::where('id', $gameId)->update(['order' => $index]);
        }

        return response()->json(['message' => 'Games reordered successfully']);
    }

    public function addGame(Request $request)
    {
        $this->checkToken($request);

        $request->validate([
            'title' => 'required|string',
            'subtitle' => 'required|string',
            'credit_cost' => 'required|integer|min:0',
            'image' => 'required|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $file = $request->file('image');
        $hashedName = Str::random(40) . '.' . $file->getClientOriginalExtension();
        $file->storeAs('game-images', $hashedName, 'public');

        $game = \App\Models\Game::create([
            'title' => $request->title,
            'subtitle' => $request->subtitle,
            'credit_cost' => $request->credit_cost,
            'image_path' => $hashedName,
            'active' => true,
            'order' => \App\Models\Game::max('order') + 1
        ]);

        return response()->json(['message' => 'Game added successfully', 'game' => $game]);
    }

    public function editGame(Request $request, $id)
    {
        $this->checkToken($request);

        $game = Game::findOrFail($id);

        $request->validate([
            'title' => 'required|string',
            'subtitle' => 'required|string',
            'credit_cost' => 'required|integer|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $hashedName = Str::random(40) . '.' . $file->getClientOriginalExtension();
            $file->storeAs('game-images', $hashedName, 'public');
            $game->image_path = $hashedName;
        }

        $game->title = $request->title;
        $game->subtitle = $request->subtitle;
        $game->credit_cost = $request->credit_cost;
        $game->save();

        return response()->json(['message' => 'Game updated successfully', 'game' => $game]);
    }
}
