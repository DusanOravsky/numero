export interface City {
  name: string;
  lat: number;
  lon: number;
  timezone: number;
}

export const CITIES: City[] = [
  { name: 'Bratislava', lat: 48.15, lon: 17.11, timezone: 1 },
  { name: 'Košice', lat: 48.72, lon: 21.26, timezone: 1 },
  { name: 'Prešov', lat: 48.99, lon: 21.24, timezone: 1 },
  { name: 'Žilina', lat: 49.22, lon: 18.74, timezone: 1 },
  { name: 'Banská Bystrica', lat: 48.74, lon: 19.15, timezone: 1 },
  { name: 'Nitra', lat: 48.31, lon: 18.09, timezone: 1 },
  { name: 'Trnava', lat: 48.38, lon: 17.59, timezone: 1 },
  { name: 'Trenčín', lat: 48.89, lon: 18.04, timezone: 1 },
  { name: 'Martin', lat: 49.07, lon: 18.92, timezone: 1 },
  { name: 'Poprad', lat: 49.06, lon: 20.30, timezone: 1 },
  { name: 'Zvolen', lat: 48.58, lon: 19.13, timezone: 1 },
  { name: 'Považská Bystrica', lat: 49.12, lon: 18.42, timezone: 1 },
  { name: 'Michalovce', lat: 48.76, lon: 21.92, timezone: 1 },
  { name: 'Piešťany', lat: 48.59, lon: 17.83, timezone: 1 },
  { name: 'Komárno', lat: 47.76, lon: 18.13, timezone: 1 },
  { name: 'Levice', lat: 48.22, lon: 18.60, timezone: 1 },
  { name: 'Humenné', lat: 48.93, lon: 21.91, timezone: 1 },
  { name: 'Bardejov', lat: 49.29, lon: 21.28, timezone: 1 },
  { name: 'Liptovský Mikuláš', lat: 49.08, lon: 19.61, timezone: 1 },
  { name: 'Ružomberok', lat: 49.08, lon: 19.31, timezone: 1 },
  { name: 'Praha', lat: 50.08, lon: 14.42, timezone: 1 },
  { name: 'Brno', lat: 49.19, lon: 16.61, timezone: 1 },
  { name: 'Ostrava', lat: 49.84, lon: 18.29, timezone: 1 },
  { name: 'Plzeň', lat: 49.75, lon: 13.38, timezone: 1 },
  { name: 'Olomouc', lat: 49.59, lon: 17.25, timezone: 1 },
  { name: 'Liberec', lat: 50.77, lon: 15.06, timezone: 1 },
  { name: 'České Budějovice', lat: 48.97, lon: 14.47, timezone: 1 },
  { name: 'Hradec Králové', lat: 50.21, lon: 15.83, timezone: 1 },
  { name: 'Pardubice', lat: 50.04, lon: 15.78, timezone: 1 },
  { name: 'Zlín', lat: 49.23, lon: 17.67, timezone: 1 },
  { name: 'Viedeň', lat: 48.21, lon: 16.37, timezone: 1 },
  { name: 'Budapešť', lat: 47.50, lon: 19.04, timezone: 1 },
  { name: 'Varšava', lat: 52.23, lon: 21.01, timezone: 1 },
  { name: 'Berlín', lat: 52.52, lon: 13.41, timezone: 1 },
  { name: 'Londýn', lat: 51.51, lon: -0.13, timezone: 0 },
  { name: 'Paríž', lat: 48.86, lon: 2.35, timezone: 1 },
  { name: 'Rím', lat: 41.90, lon: 12.50, timezone: 1 },
  { name: 'Madrid', lat: 40.42, lon: -3.70, timezone: 1 },
  { name: 'New York', lat: 40.71, lon: -74.01, timezone: -5 },
  { name: 'Los Angeles', lat: 34.05, lon: -118.24, timezone: -8 },
  { name: 'Moskva', lat: 55.76, lon: 37.62, timezone: 3 },
  { name: 'Sydney', lat: -33.87, lon: 151.21, timezone: 10 },
  { name: 'Tokio', lat: 35.68, lon: 139.69, timezone: 9 },
];

export function findCity(name: string): City | undefined {
  const lower = name.toLowerCase().trim();
  return CITIES.find(c => c.name.toLowerCase() === lower);
}

export function searchCities(query: string): City[] {
  if (!query || query.length < 2) return [];
  const lower = query.toLowerCase();
  return CITIES.filter(c => c.name.toLowerCase().includes(lower)).slice(0, 5);
}
