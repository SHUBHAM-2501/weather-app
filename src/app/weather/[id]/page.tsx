"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { ArrowLeft, Loader2 } from "lucide-react";

interface WeatherData {
  location: {
    name: string;
    country: string;
    admin1?: string;
    latitude: number;
    longitude: number;
  };
  temperature: number;
  windSpeed: number;
  humidity: number;
  cloudCover: number;
  units: {
    temperature: string;
    windSpeed: string;
    humidity: string;
    cloudCover: string;
  };
  time: string;
}

export default function WeatherPage() {
  const router = useRouter();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // First, retrieve the location data from localStorage
        const locationData = localStorage.getItem(`location-${params.id}`);
        if (!locationData) {
          throw new Error("Location data not found");
        }

        const location = JSON.parse(locationData);
        
        // Then fetch the weather data for this location
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,wind_speed_10m,relative_humidity_2m,cloud_cover`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch weather data");
        }

        const data = await response.json();
        
        setWeatherData({
          location: {
            name: location.name,
            country: location.country,
            admin1: location.admin1,
            latitude: location.latitude,
            longitude: location.longitude,
          },
          temperature: data.current.temperature_2m,
          windSpeed: data.current.wind_speed_10m,
          humidity: data.current.relative_humidity_2m,
          cloudCover: data.current.cloud_cover,
          units: {
            temperature: data.current_units.temperature_2m,
            windSpeed: data.current_units.wind_speed_10m,
            humidity: data.current_units.relative_humidity_2m,
            cloudCover: data.current_units.cloud_cover,
          },
          time: data.current.time,
        });
      } catch (err) {
        console.error("Error fetching weather data:", err);
        setError("Failed to load weather information. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  const handleBack = () => {
    router.push("/");
  };

  return (
    <div className="flex min-h-screen flex-col p-4 md:p-8">
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Weather Details</h1>
        </div>
        <ThemeToggle />
      </header>

      <main className="flex flex-col gap-6 max-w-3xl mx-auto w-full">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <Card>
            <CardContent className="pt-6">
              <div className="bg-destructive/10 text-destructive p-4 rounded-md">
                <p>{error}</p>
                <Button onClick={handleBack} className="mt-4">
                  Go back to search
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : weatherData && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>
                  {weatherData.location.name}
                </CardTitle>
                <p className="text-muted-foreground">
                  {[weatherData.location.admin1, weatherData.location.country]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </CardHeader>
              <CardContent>
                <div className="text-sm mb-2">
                  Coordinates: {weatherData.location.latitude.toFixed(2)}, {weatherData.location.longitude.toFixed(2)}
                </div>
                <p className="text-sm text-muted-foreground">
                  Updated at: {new Date(weatherData.time).toLocaleString()}
                </p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Temperature</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">{weatherData.temperature}{weatherData.units.temperature}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Wind Speed</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">{weatherData.windSpeed}{weatherData.units.windSpeed}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Humidity</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">{weatherData.humidity}{weatherData.units.humidity}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Cloud Cover</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">{weatherData.cloudCover}{weatherData.units.cloudCover}</p>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </main>
    </div>
  );
}