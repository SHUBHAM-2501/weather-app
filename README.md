# Weather App

A modern weather application built with Next.js and shadcn/ui that allows users to search for locations and view current weather conditions.

## Features

- Search for locations worldwide using the Open Meteo Geocoding API
- View detailed weather information including temperature, wind speed, humidity, and cloud cover
- Clean and intuitive user interface with dark mode support
- Responsive design that works on mobile and desktop devices

## Technologies Used

- Next.js 14+ with App Router
- TypeScript
- Tailwind CSS for styling
- shadcn/ui component library
- Open Meteo API for geocoding and weather data

## Getting Started

First, clone the repository and install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## How It Works

1. **Location Search**: Enter a city or location name in the search bar
2. **Select Location**: Click on a location from the search results
3. **View Weather**: See detailed current weather conditions for the selected location
4. **Back to Search**: Use the back button to return to the search page

## API Information

This project uses the following free APIs from Open Meteo:

- Geocoding API: `https://geocoding-api.open-meteo.com/v1/search`
- Weather API: `https://api.open-meteo.com/v1/forecast`

No API key is required to use these services.

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Open Meteo API Documentation](https://open-meteo.com/en/docs)
