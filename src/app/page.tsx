"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";

interface Location {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
}

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          searchQuery
        )}&count=10&language=en&format=json`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch locations");
      }

      const data = await response.json();
      if (data.results) {
        setLocations(data.results);
      } else {
        setLocations([]);
        setError("No locations found. Please try a different search term.");
      }
    } catch (err) {
      console.error("Error searching for locations:", err);
      setError("An error occurred while searching for locations. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationSelect = (location: Location) => {
    // Store the location data in localStorage so we can access it on the weather page
    localStorage.setItem(`location-${location.id}`, JSON.stringify(location));
    
    // Navigate to the weather details page for this location
    router.push(`/weather/${location.id}`);
  };

  return (
    <div className="flex min-h-screen flex-col p-4 md:p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Weather Search</h1>
        <ThemeToggle />
      </header>

      <main className="flex flex-col gap-6 max-w-3xl mx-auto w-full">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Find a Location</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for a city..."
                className="flex-1"
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  "Searching..."
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {error && (
          <div className="bg-destructive/10 text-destructive p-3 rounded-md">
            {error}
          </div>
        )}

        {locations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                {locations.map((location) => (
                  <Card 
                    key={location.id} 
                    className="p-4 hover:bg-accent/50 cursor-pointer transition-colors"
                    onClick={() => handleLocationSelect(location)}
                  >
                    <div>
                      <h3 className="font-medium">{location.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {[
                          location.admin1,
                          location.country
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      Lat: {location.latitude.toFixed(2)}, Lon: {location.longitude.toFixed(2)}
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
