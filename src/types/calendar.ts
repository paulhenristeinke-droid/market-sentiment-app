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

export interface FinnhubCalendarEvent {
  country: string;
  date: string;
  event: string;
  impact: string;
  actual: number | null;
  estimate: number | null;
  prev: number | null;
  time: string;
  unit: string;
}

export interface FinnhubCalendarResponse {
  economicCalendar: FinnhubCalendarEvent[];
}
