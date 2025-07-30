<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class ContentController extends Controller
{
    protected $base;

    public function __construct()
    {
        $this->base = storage_path('app/public/content-pages');
    }

    public function index()
    {
        return $this->list($this->base, '');
    }

    public function show($path)
    {
        $full = $this->base . '/' . $path;

        if (File::isDirectory($full)) {
            return $this->list($full, $path);
        }

        $folder = dirname($this->base . '/' . str_replace('-', ' ', $path));
        $slug = basename($full);

        $match = null;

        foreach (File::files($folder) as $f) {
            $filenameWithoutExt = pathinfo($f->getFilename(), PATHINFO_FILENAME);
            $normalized = str_replace(' ', '-', $filenameWithoutExt);

            if ($normalized === $slug) {
                $match = $f->getPathname();
                break;
            }
        }

        if (!$match) {
            abort(404);
        }

        $raw = File::get($match);
        $front = [];
        $body = $raw;

        if (Str::startsWith($raw, "---")) {
            $parts = explode("---", $raw, 3);
            if (count($parts) === 3) {
                $body = $parts[2];
                $lines = explode("\n", trim($parts[1]));
                foreach ($lines as $line) {
                    if (strpos($line, ':') !== false) {
                        [$key, $val] = explode(':', $line, 2);
                        $front[trim($key)] = trim($val);
                    }
                }
            }
        }

        $ext = pathinfo($match, PATHINFO_EXTENSION);
        $filename = basename($match);
        $title = $front['title'] ?? '';

        if (!$title && $ext === 'html') {
            $lower = strtolower($body);
            if (strpos($lower, '<h1>') !== false) {
                $start = strpos($lower, '<h1>') + 4;
                $end = strpos($lower, '</h1>');
                $title = trim(strip_tags(substr($body, $start, $end - $start)));
            }
        }

        if (!$title) {
            $slug = substr($filename, 11, strrpos($filename, '.') - 11);
            $title = ucwords(str_replace('-', ' ', $slug));
        }

        $cover = isset($front['cover']) ? $front['cover'] : pathinfo($filename, PATHINFO_FILENAME) . '.jpg';
        $cover = '/storage/content-pages/images/' . $cover;

        $aside = [
            'date' => substr($filename, 0, 10),
            'tags' => isset($front['tags']) ? array_map('trim', explode(',', $front['tags'])) : [],
            'draft' => $front['draft'] ?? 'false'
        ];

        $html = '';

        if ($ext === 'html') {
            $html = str_replace(
                ['src="', "src='"],
                ['src="/storage/content-pages/images/', "src='/storage/content-pages/images/"],
                $body
            );
        } else {
            $lines = explode("\n", $body);
            foreach ($lines as $line) {
                $line = trim($line);
                if (!$line) continue;
                if (
                    substr_count($line, ' ') === 0 &&
                    (Str::endsWith($line, '.jpg') || Str::endsWith($line, '.jpeg') || Str::endsWith($line, '.png') || Str::endsWith($line, '.gif') || Str::endsWith($line, '.webp'))
                ) {
                    $html .= '<img src="/storage/content-pages/images/' . e($line) . '">';
                } else {
                    $html .= '<p>' . e($line) . '</p>';
                }
            }
        }

        return view('page', compact('title', 'cover', 'aside', 'html'));
    }


    public function tag($tag)
    {
        $pages = $this->collect($this->base);
        $matches = [];

        foreach ($pages as $page) {
            if (in_array($tag, $page['tags'])) {
                $matches[] = $page;
            }
        }

        return view('tag', ['tag' => $tag, 'pages' => $matches]);
    }

    public function search(Request $request)
    {
        $query = strtolower($request->input('q', ''));
        $keywords = array_filter(explode('/', $query));

        $pages = $this->collect($this->base);
        $results = [];

        foreach ($pages as $page) {
            foreach ($keywords as $key) {
                if (
                    strpos(strtolower($page['title']), $key) !== false ||
                    strpos(strtolower($page['raw']), $key) !== false
                ) {
                    $results[] = $page;
                    break;
                }
            }
        }

        return view('search', compact('query', 'results'));
    }

    private function list($folder, $relPath)
    {
        $subfolders = [];
        $files = [];

        foreach (File::directories($folder) as $dir) {
            if (basename($dir) === 'images') continue;
            $subfolders[] = basename($dir);
        }

        foreach (File::files($folder) as $file) {
            if (Str::contains(str_replace('\\', '/', $file->getPathname()), '/content-pages/images')) {
                continue;
            }

            $name = $file->getFilename();

            

            if (strlen($name) < 12 || substr($name, 4, 1) !== '-' || substr($name, 7, 1) !== '-' || substr($name, 10, 1) !== '-') {
                continue;
            }

            $date = substr($name, 0, 10);
            if (strtotime($date) > time()) continue;

            $raw = File::get($file);
            $front = [];
            $body = $raw;

            if (Str::startsWith($raw, "---")) {
                $parts = explode("---", $raw, 3);
                if (count($parts) === 3) {
                    $body = $parts[2];
                    $lines = explode("\n", trim($parts[1]));
                    foreach ($lines as $line) {
                        if (strpos($line, ':') !== false) {
                            [$key, $val] = explode(':', $line, 2);
                            $front[trim($key)] = trim($val);
                        }
                    }
                }
            }

            if (isset($front['draft']) && $front['draft'] === 'true') continue;

            $title = $front['title'] ?? ucwords(str_replace('-', ' ', substr($name, 11, strrpos($name, '.') - 11)));
            $summary = $front['summary'] ?? '';
            $tags = isset($front['tags']) ? array_map('trim', explode(',', $front['tags'])) : [];

            $fileBase = pathinfo($name, PATHINFO_FILENAME);
            $slug = str_replace(' ', '-', $fileBase);

            $files[] = [
                'path' => trim($relPath . '/' . $slug, '/'),
                'title' => $title,
                'summary' => $summary,
                'tags' => $tags,
                'raw' => $body
            ];
        }

        sort($subfolders);
        usort($files, function ($a, $b) {
            return strcmp($b['path'], $a['path']);
        });

        return view('index', [
            'folders' => $subfolders,
            'pages' => $files,
            'relativePath' => $relPath
        ]);
    }

    private function collect($dir)
    {
        $all = [];

        foreach (File::allFiles($dir) as $file) {
            $name = $file->getFilename();

            if (Str::contains(str_replace('\\', '/', $file->getPathname()), '/content-pages/images')) {
                continue;
            }

            if (strlen($name) < 12 || substr($name, 4, 1) !== '-' || substr($name, 7, 1) !== '-' || substr($name, 10, 1) !== '-') {
                continue;
            }

            $date = substr($name, 0, 10);
            if (strtotime($date) > time()) continue;

            $raw = File::get($file);
            $front = [];
            $body = $raw;

            if (Str::startsWith($raw, "---")) {
                $parts = explode("---", $raw, 3);
                if (count($parts) === 3) {
                    $body = $parts[2];
                    $lines = explode("\n", trim($parts[1]));
                    foreach ($lines as $line) {
                        if (strpos($line, ':') !== false) {
                            [$key, $val] = explode(':', $line, 2);
                            $front[trim($key)] = trim($val);
                        }
                    }
                }
            }

            if (isset($front['draft']) && $front['draft'] === 'true') continue;

            $title = $front['title'] ?? ucwords(str_replace('-', ' ', substr($name, 11, strrpos($name, '.') - 11)));
            $summary = $front['summary'] ?? '';
            $tags = isset($front['tags']) ? array_map('trim', explode(',', $front['tags'])) : [];

            $rel = Str::after(str_replace('\\', '/', $file->getPathname()), str_replace('\\', '/', $this->base . '/'));
            $fileBase = substr($rel, 0, strrpos($rel, '.'));

            $slug = str_replace(' ', '-', $fileBase);

            $all[] = [
                'title' => $title,
                'summary' => $summary,
                'tags' => $tags,
                'path' => $slug,
                'raw' => $body
            ];
        }

        return $all;
    }
}
