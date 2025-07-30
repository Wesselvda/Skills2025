@extends('layouts.layout')

@section('content')
<div class="page-title">
    <h2>Search Results for: "{{ $query }}"</h2>
</div>

<div class="content-wrapper">
    <div class="content">
        @if ($results)
            <ul>
                @foreach ($results as $page)
                    <li class="page-item">
                        <h4><a href="{{ url('heritages/' . $page['path']) }}">{{ $page['title'] }}</a></h4>
                        <p>{{ $page['summary'] }}</p>
                    </li>
                @endforeach
            </ul>
        @else
            <p>No pages found</p>
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
