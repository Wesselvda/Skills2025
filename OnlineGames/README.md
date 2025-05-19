# How to start the project

I used the react and laravel templates from taitaja and created a docker-compose file to simulate their auto-deploying.

<!-- ## Frontend

Go to the frontend directory

run `npm i`

## Backend

Go to the backend directory

run `composer install` -->

## Start the project

To start the project run `docker compose up`

## Database

When the project is running run this command to migrate the database:
`docker compose exec backend php artisan migrate --seed`

## The project is now running!

Open `http://localhost/` in your browser to visit the website.