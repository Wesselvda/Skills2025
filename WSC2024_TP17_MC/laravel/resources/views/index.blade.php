@extends('layouts.layout')

@section('content')
<div class="page-title big">
    <h2>Listing {{ $relativePath ?: 'Root' }}</h2>
</div>

<div class="content-wrapper">
    <div class="content">
        @if ($folders || $pages)
            <ul>
                @foreach ($folders as $folder)
                    <li><a href="{{ url('heritages/' . trim($relativePath . '/' . $folder, '/')) }}">{{ $folder }}</a></li>
                @endforeach
                @foreach ($pages as $page)
                    <li class="page-item">
                        <h4><a href="{{ url('heritages/' . $page['path']) }}">{{ $page['title'] }}</a></h4>
                        <p>{{ $page['summary'] }}</p>
                    </li>
                @endforeach
            </ul>
        @else
            <p>No items found.</p>
        @endif
    </div>
    <aside class="aside">
        <form action="{{ url('/search') }}" method="get">
            <label for="q" class="search-label">Search</label>
            <input id="q" type="text" name="q" placeholder="KEYWORD" value="{{ request('q') }}">
            <input type="submit" value="Search">
        </form>
    </aside>
</div>
@endsection
