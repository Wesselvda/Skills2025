<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    // 'allowed_origins_patterns' => ['http://localhost'],
    'allowed_origins' => ['http://localhost'],
    'allowed_methods' => ['*'],
    'allowed_headers' => ['*'],
    'supports_credentials' => true,
];