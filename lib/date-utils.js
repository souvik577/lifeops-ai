export function normalizeDueDate(value) {
  if (!value) {
    return null;
  }

  const text = value.trim().toLowerCase();

  const today = new Date();

  // Remove time so we work only with the date
  today.setHours(0, 0, 0, 0);

  if (text === "today") {
    return today;
  }

  if (text === "tomorrow") {
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  }

  const weekdays = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  };

  if (weekdays[text] !== undefined) {
    const targetDay = weekdays[text];
    const currentDay = today.getDay();

    let daysUntil = targetDay - currentDay;

    if (daysUntil <= 0) {
      daysUntil += 7;
    }

    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + daysUntil);

    return targetDate;
  }

  const parsedDate = new Date(value);

  if (!Number.isNaN(parsedDate.getTime())) {
    return parsedDate;
  }

  return null;
}