<?php

use App\Models\Color;
use App\Models\DesignSymbol;
use App\Models\NavItem;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/navitems', function () {
    return NavItem::select(['id', 'name', 'link'])->orderby('order', 'asc')->get();
});

Route::get('/products', function () {
    return Product::select(['id', 'name', 'imgname', 'price'])->get();
});

Route::get('/designsymbols', function () {
    return DesignSymbol::select(['id', 'img'])->where('active', true)->get();
});

Route::get('/colors', function () {
    return Color::select(['name'])->get();
});

Route::post('/order', function (Request $request) {
    $validated = $request->validate([
        'lastname' => 'string|required',
        'firstname' => 'string|required',
        'email' => 'string|required',
        'items' => 'required',
    ]);

    Order::create([
        'lastname' => $validated['lastname'],
        'firstname' => $validated['firstname'],
        'email' => $validated['email'],
        'items' => $validated['items'],
        'status' => 'open'
    ]);

    return response()->json(['success' => true]);
});

Route::post('/login', function (Request $request) {
    $credentials = $request->validate([
        'name' => 'string|required',
        'password' => 'string|required'
    ]);

    if (Auth::attempt($credentials)) {
        $user = Auth::user();

        $token = $user->createToken("admintoken");

        return response()->json([
            'token' => $token->plainTextToken
        ]);
    } else {
        return response()->json([
            'Invalid credentials'
        ], 401);
    }
});

Route::get('/admindata', function () {
    return response()->json([
        'orders' => Order::all()
    ]);
})->middleware('auth:sanctum');

Route::post('/updateorderstatus', function (Request $request) {
    $validated = $request->validate([
        'orderId' => 'required',
        'status' => 'required',
    ]);

    $order = Order::findOrFail($validated['orderId']);
    $order->status = $validated['status'];
    $order->remark = $request->input('remark');
    $order->save();

    return response()->json([
        'success' => true
    ]);
})->middleware('auth:sanctum');