@extends('layouts.layout')

@push('scripts')
    <script src="{{ asset('js/spotlight.js') }}"></script>
@endpush

@section('content')
@if ($cover)
    <img src="{{ $cover }}" class="cover" alt="Cover image">
@endif

<div class="page-title">
    <h2>{{ $title }}</h2>
</div>

<div class="content-wrapper">
    <div class="content">
        {!! $html !!}
    </div>
    <aside class="aside">
        <p>Date: {{ $aside['date'] }}</p>
        <p>tags:
            @foreach ($aside['tags'] as $tag)
                <a href="{{ url('/tags/' . $tag) }}">{{ $tag }}</a>{{ !$loop->last ? ',' : '' }}
            @endforeach
        </p>
        <p>Draft: {{ $aside['draft'] }}</p>
    </aside>
</div>
@endsection
