<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Game;
use Illuminate\Http\Request;

class GameController extends Controller
{
    public function index()
    {
        return Game::orderBy('order')->where('active', true)->get();
    }

    public function show($id)
    {
        $game = Game::where('active', true)->findOrFail($id);
        return response()->json($game);
    }
}
