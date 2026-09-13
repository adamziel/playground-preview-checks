<?php
/* Plugin Name: Preview my-plugin */
add_action('admin_notices', function () { echo '<div class="notice notice-info"><p>Preview fixture: my-plugin</p></div>'; });

if (file_exists(__DIR__ . '/vendor/autoload.php')) { require_once __DIR__ . '/vendor/autoload.php'; }
add_action('admin_menu', function () {
    add_menu_page('Preview fixture', 'Preview fixture', 'manage_options', 'my-plugin', function () {
        echo '<h1>Preview fixture is active</h1>';
        echo '<p>Composer: ' . (class_exists('Psr\Log\NullLogger') ? 'loaded' : 'not built') . '</p>';
        echo '<p>Vite: ' . (file_exists(__DIR__ . '/dist/preview.js') ? 'built' : 'not built') . '</p>';
    });
});

// Recipe check: current/build-theme
