<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\ProfilePicture;
use Illuminate\Http\File;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules\Password;

class LoginController extends Controller
{
    function showLoginForm() {
        return inertia('Login');
    }

    function login(Request $request) {
        $validated = $request->validate([
            'email' => 'email|required',
            'password' => 'required',
        ]);

        if (Auth::attempt($validated)) {
            $request->session()->regenerate();

            return redirect()->route('home');
        }

        return redirect()->back()->withErrors([
            'email' => 'The entered credentials are incorrect.'
        ])->onlyInput('email');
    }

    function logout(Request $request) {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }


    function updateProfile(Request $request) {

        $validated = $request->validate([
            'name' => 'max:10|required',
            'email' => 'email|required',
            'password' => ['nullable', 'confirmed', Password::min(8)->mixedCase()->symbols()],
            'availabilityMo' => 'nullable|boolean',
            'availabilityTu' => 'nullable|boolean',
            'availabilityWe' => 'nullable|boolean',
            'availabilityTh' => 'nullable|boolean',
            'availabilityFr' => 'nullable|boolean',
        ]);

        $user = $request->user()->with('availability')->first();

        if ($user->name !== $validated["name"]) {
            $request->validate([
                'name' => 'unique:users'
            ]);
        }
        
        if (
            $validated["availabilityMo"] ||
            $validated["availabilityTu"] ||
            $validated["availabilityWe"] ||
            $validated["availabilityTh"] ||
            $validated["availabilityFr"]
        ) {
            $user->availability->mo = $validated["availabilityMo"];
            $user->availability->tu = $validated["availabilityTu"];
            $user->availability->we = $validated["availabilityWe"];
            $user->availability->th = $validated["availabilityTh"];
            $user->availability->fr = $validated["availabilityFr"];

            $user->availability->save();
        } else {
            return back()->withErrors([
                'availabilityFr' => 'At least one day should be checked.'
            ]);
        }

        $user->name = $validated["name"];
        $user->email = $validated["email"];
        if ($validated["password"]) $user->password = Hash::make($validated["password"]);

        $user->save();

        return back(303);
    }

    function updateProfilePicture(Request $request) {
        $request->validate([
            'profilePicture' => 'required|file|extensions:jpg,jpeg,png'
        ]);

        $inputImage = null;

        if ($request->file('profilePicture')->extension() === 'png') {
            $inputImage = imagecreatefrompng($request->file('profilePicture'));
        } else {
            $inputImage = imagecreatefromjpeg($request->file('profilePicture'));
        }

        $imageSize = getimagesize($_FILES['profilePicture']['tmp_name']);

        $minSize = min($imageSize[0], $imageSize[1]);

        $cropX = ($imageSize[0] - $minSize) / 2;
        $cropY = ($imageSize[1] - $minSize) / 2;

        $outputImage = imagecreatetruecolor(500, 500);
        imagealphablending($outputImage, false);
        imagesavealpha($outputImage, true);
        imagecopyresampled($outputImage, $inputImage, 0, 0, $cropX, $cropY, 500, 500, $minSize, $minSize);

        $currentProfilePicture = ProfilePicture::where('user_id', $request->user()->id)->first();

        if($currentProfilePicture->imgurl) {
            Storage::disk('public')->delete($currentProfilePicture->imgurl);
        }

        imagepng($outputImage, $_FILES['profilePicture']['tmp_name']);

        $path = Storage::disk('public')->put('profilepictures/', new File($_FILES['profilePicture']['tmp_name']));
        $currentProfilePicture->imgurl = $path;
        $currentProfilePicture->save();

        return back(303);
    }
}
