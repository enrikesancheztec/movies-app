# Movies App

Frontend application built with Next.js for a movies experience with a visual style inspired by Bootstrap.

## Project Goals

This project was created with the following goals:

- Use colors, typography, spacing, and UI patterns similar to Bootstrap.
- Support i18n with English (US) and Spanish (MX).
- Provide a responsive design adapted to 3 screen sizes: desktop, laptop, and mobile.

## Features

- Bootstrap-like visual direction for layout, buttons, tables, and general UI composition.
- Internationalized routing with support for `en-US` and `es-MX`.
- Responsive movie listing with tailored behavior for mobile, laptop, and desktop screens.
- Movie detail screen with hero banner, metadata card, and color-coded MPAA rating badge.
- Navigation from the movie list to the detail page and back.

## Getting Started

### Local development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Before starting locally, create a `.env.local` file in the project root with your API base URL.

Example (`.env.local`):

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
```

This value is read from the local environment while running `npm run dev`.

The application currently includes localized routes such as:

- [http://localhost:3000/en-US](http://localhost:3000/en-US)
- [http://localhost:3000/es-MX](http://localhost:3000/es-MX)

Movie detail routes follow the pattern:

- `http://localhost:3000/en-US/movies/{id}`
- `http://localhost:3000/es-MX/movies/{id}`

## Docker

The project includes a production Docker image based on the Next.js standalone output.

Build the image by providing the backend API URL as a build argument:

```bash
docker build \
	--build-arg NEXT_PUBLIC_API_BASE_URL=http://localhost:8080 \
	-t movies-app .
```

Run the container locally:

```bash
docker run --rm -p 3000:3000 movies-app
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Important: `NEXT_PUBLIC_API_BASE_URL` is embedded into the frontend bundle during `docker build`.
Changing that variable when starting the container will not change the API target for an already built image.
If you need a different backend URL, build a new image with a different `--build-arg` value.

Optional runtime variables for the container:

- `PORT` to change the internal listening port.
- `HOSTNAME` to override the bind host if needed.

Example with an explicit runtime port:

```bash
docker run --rm -p 3000:3000 -e PORT=3000 movies-app
```

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Axios

## Notes

- The UI is currently focused on frontend structure and visual behavior.
- Internationalization is implemented for English and Spanish.
- The movie list is designed to respond differently across desktop, laptop, and mobile layouts.
- Dynamic params are consumed with React `use()` per the Next.js 16 / React 19 convention.
