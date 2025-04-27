# How open the project:

1. Copy .env.example to .env

2. Create the database by making a 'database.sqlite' file in the database directory or making a database in mysql and changing the connection settings in the .env file.

3. Run these commands in order:
```
npm i
composer install
php artisan key:gen
php artisan migrate:fresh --seed
php artisan storage:link
php artisan serve
```