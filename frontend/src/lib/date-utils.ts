const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export type WeekDate = {
  date: string;
  day: string;
  displayDate: string;
};

export function getCurrentUtcWeekDates(daysOfWeek: string[]): WeekDate[] {
  const today = new Date();
  const currentDay = today.getUTCDay();
  const monday = new Date(
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()),
  );

  monday.setUTCDate(
    monday.getUTCDate() - (currentDay === 0 ? 6 : currentDay - 1),
  );

  return daysOfWeek.map((day, index) => {
    const date = new Date(monday);
    date.setUTCDate(monday.getUTCDate() + index);

    return {
      date: date.toISOString().split("T")[0],
      day,
      displayDate: `${monthNames[date.getUTCMonth()]} ${date.getUTCDate()}`,
    };
  });
}

export function formatMockDate(dateString: string) {
  const [year, month, day] = dateString.split("-");

  if (!year || !month || !day) {
    return dateString;
  }

  return `${monthNames[Number(month) - 1]} ${Number(day)}, ${year}`;
}

export function formatMockDateTime(dateTimeString: string) {
  const [datePart, timePart = ""] = dateTimeString.split("T");
  const [hours = "00", minutes = "00"] = timePart.split(":");
  const formattedDate = formatMockDate(datePart);
  const hourNumber = Number(hours);
  const meridiem = hourNumber >= 12 ? "PM" : "AM";
  const displayHour = hourNumber % 12 || 12;

  return `${formattedDate}, ${displayHour}:${minutes} ${meridiem}`;
}
