// Notification utilities (FCM setup for push notifications)
// Note: FCM requires a service worker and Firebase project configuration

export async function requestNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) return false;
  const permission = await Notification.requestPermission();
  return permission === "granted";
}

export function showLocalNotification(title: string, body: string) {
  if (Notification.permission === "granted") {
    new Notification(title, {
      body,
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-72.png",
    });
  }
}

// Time-based greeting generator
export function getGreeting(name: string): string {
  const hour = new Date().getHours();
  if (hour < 6) return `Sweet dreams, ${name} 🌙`;
  if (hour < 12) return `Good morning, ${name} 🌅`;
  if (hour < 17) return `Good afternoon, ${name} ☀️`;
  if (hour < 21) return `Good evening, ${name} 🌆`;
  return `Good night, ${name} ✨`;
}
