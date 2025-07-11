<?php

use App\Models\Company;
use App\Models\Contact;
use App\Models\Owner;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/validate-passphrase', function (Request $request) {
    $validated = $request->validate([
        'passphrase' => 'string',
    ]);

    if ($validated['passphrase'] === "admin") {
        return response()->json(["token" => "ashfalsihdfasdfasof"]); // Token
    } else {
        return response()->json(["error" => "Invalid token"], 401);
    }
});

function validateToken($request) {
    $validated = $request->validate([
        'token' => 'string|required',
    ]);

    if ($validated['token'] !== "ashfalsihdfasdfasof") {
        return response()->json(["error" => "Invalid token"], 401);
    }
}

Route::post('/validate-token', function (Request $request) {
    validateToken($request);

    return response()->json(["success" => true]);
});

Route::get('/admin/companies', function (Request $request) {
    validateToken($request);

    return Company::with('owner', 'contact')->get();
});

Route::get('/admin/company/{company_id}', function (Request $request, $company_id) {
    validateToken($request);

    return Company::with('owner', 'contact', 'products', 'products.name', 'products.description', 'products.weight')->findOrFail($company_id);
});


Route::post('/admin/company/create', function (Request $request) {
    validateToken($request);
    $validated = $request->validate([
        'companyName' => "required|string",
        'companyAddress' => "required|string",
        'companyTelephone' => "required|string",
        'companyEmail' => "required|string",
        'owner.name' => "required|string",
        'owner.email' => "required|string",
        'owner.mobileNumber' => "required|string",
        'contact.name' => "required|string",
        'contact.email' => "required|string",
        'contact.mobileNumber' => "required|string",
    ]);

    $company = Company::create([
        'companyName' => $validated["companyName"],
        'companyAddress' => $validated["companyAddress"],
        'companyTelephone' => $validated["companyTelephone"],
        'companyEmail' => $validated["companyEmail"],
    ]);

    $owner = Owner::create([
        'company_id' => $company->id,
        'name' => $validated["owner"]["name"],
        'email' => $validated["owner"]["email"],
        'mobileNumber' => $validated["owner"]["mobileNumber"],
    ]);

    $contact = Contact::create([
        'company_id' => $company->id,
        'name' => $validated["contact"]["name"],
        'email' => $validated["contact"]["email"],
        'mobileNumber' => $validated["contact"]["mobileNumber"],
    ]);

    return $company;
});


Route::post('/admin/company/{company_id}', function (Request $request, $company_id) {
    validateToken($request);
    $validated = $request->validate([
        'companyName' => "required|string",
        'companyAddress' => "required|string",
        'companyTelephone' => "required|string",
        'companyEmail' => "required|string",
        'owner.name' => "required|string",
        'owner.email' => "required|string",
        'owner.mobileNumber' => "required|string",
        'contact.name' => "required|string",
        'contact.email' => "required|string",
        'contact.mobileNumber' => "required|string",
    ]);

    $company = Company::with('owner', 'contact')->findOrFail($company_id);

    $company->companyName = $validated["companyName"];
    $company->companyAddress = $validated["companyAddress"];
    $company->companyTelephone = $validated["companyTelephone"];
    $company->companyEmail = $validated["companyEmail"];

    $company->owner->name = $validated["owner"]["name"];
    $company->owner->email = $validated["owner"]["email"];
    $company->owner->mobileNumber = $validated["owner"]["mobileNumber"];
    $company->owner->save();

    $company->contact->name = $validated["contact"]["name"];
    $company->contact->email = $validated["contact"]["email"];
    $company->contact->mobileNumber = $validated["contact"]["mobileNumber"];
    $company->contact->save();

    $company->save();
    
    return $company;
});

Route::get('/products.json', function (Request $request) {
    $query = $request->input('query');
    if ($query) {
        return Product::with(['name', 'description', 'weight'])->where("name", "LIKE", $query)->get();
    } else {
        return Product::with(['name', 'description', 'weight'])->get();
    }
});

Route::get('/product/{gtin}.json', function (Request $request, $gtin) {
    $product = Product::with(['name', 'description', 'weight'])->where("gtin", $gtin)->first();

    if ($product) {
        return $product;
    } else {
        return response()->json(['error' => "Product not found"], 404);
    }
});

Route::post('/product/{gtin}.json', function (Request $request, $gtin) {
    validateToken($request);
    $validated = $request->validate([
        'brand' => "required|string",
        'countryOfOrigin' => "required|string",
        'name.en' => "required|string",
        'name.fr' => "required|string",
        'description.en' => "required|string",
        'description.fr' => "required|string",
        'weight.gross' => "required|numeric",
        'weight.net' => "required|numeric",
        'weight.unit' => "required|string",
    ]);

    $product = Product::with(['name', 'description', 'weight'])->where("gtin", $gtin)->first();

    if ($product) {
        $product->brand = $validated["brand"];
        $product->countryOfOrigin = $validated["countryOfOrigin"];
        $product->name->en = $validated["name"]["en"];
        $product->name->fr = $validated["name"]["fr"];
        $product->name->save();
        $product->description->en = $validated["description"]["en"];
        $product->description->fr = $validated["description"]["fr"];
        $product->description->save();
        $product->weight->gross = $validated["weight"]["gross"];
        $product->weight->net = $validated["weight"]["net"];
        $product->weight->unit = $validated["weight"]["unit"];
        $product->weight->save();
        $product->save();

        return response()->json(['success' => true]);
    } else {
        return response()->json(['error' => "Product not found"], 404);
    }
});