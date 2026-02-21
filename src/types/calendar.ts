export interface EconomicEvent {
  id: string;
  event: string;
  country: string;
  date: string;
  time: string;
  impact: "high" | "medium" | "low";
  forecast: string | null;
  actual: string | null;
  previous: string | null;
  unit: string;
}
