export function generateUserId() {
  const timestamp = Date.now().toString(36);
  const randompart = Math.random().toString(36).substring(2, 10);

  return `${timestamp}${randompart}`
}
