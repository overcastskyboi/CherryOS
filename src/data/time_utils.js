/**
 * Converts time into a formatted string (Days, Hours, Minutes)
 * @param {number} totalMinutes Total time in minutes
 * @returns {object} Formatted time components and string
 */
export const formatTime = (totalMinutes) => {
  const d = Math.floor(totalMinutes / (24 * 60));
  const h = Math.floor((totalMinutes % (24 * 60)) / 60);
  const m = Math.floor(totalMinutes % 60);

  const parts = [];
  if (d > 0) parts.push(`${d}d`);
  if (h > 0) parts.push(`${h}h`);
  if (m > 0 || parts.length === 0) parts.push(`${m}m`);

  return {
    days: d,
    hours: h,
    minutes: m,
    label: parts.join(' ')
  };
};

/**
 * Converts total hours into a formatted string (Days, Hours)
 * @param {number} totalHours Total time in hours
 * @returns {object} Formatted time components and string
 */
export const formatHours = (totalHours) => {
  const d = Math.floor(totalHours / 24);
  const h = Math.round(totalHours % 24);

  const parts = [];
  if (d > 0) parts.push(`${d}d`);
  if (h > 0 || parts.length === 0) parts.push(`${h}h`);

  return {
    days: d,
    hours: h,
    label: parts.join(' ')
  };
};
