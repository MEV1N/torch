/**
 * Romantic quotes and affirmations
 */
export const romanticQuotes = [
  "You are my greatest adventure. 💕",
  "Every moment with you is a gift I cherish.",
  "In your eyes, I found my home.",
  "You make my heart skip a beat.",
  "Together, we are unstoppable.",
  "My favorite place is next to you.",
  "You are my person. 💑",
  "Forever doesn't feel like long enough with you.",
  "You are the best decision I've ever made.",
  "I love you more than words can say.",
  "You light up my world. ✨",
  "With you, I am home.",
  "You are my today and all my tomorrows.",
  "I fall for you more each day.",
  "You are my greatest blessing.",
  "Two souls, one heartbeat. 💓",
  "You complete me.",
  "I would choose you in every lifetime.",
  "You are my reason to smile.",
  "Forever with you sounds perfect.",
];

/**
 * Motivational messages for streaks
 */
export const streakMotivations = [
  "Keep the flame alive! 🔥",
  "Your love is unbreakable!",
  "Another day of love! 💕",
  "You're amazing together!",
  "Keep shining! ✨",
  "Love conquers all! 💪",
  "You've got this! 🚀",
  "Best couple ever!",
  "Streak power! ⚡",
  "Love is growing! 🌱",
];

/**
 * Cute greetings based on time of day
 */
export function getTimeBasedGreeting(hour: number = new Date().getHours()) {
  if (hour < 5) return "🌙 You're up late! Go get some rest, love.";
  if (hour < 12) return "🌅 Good morning, lovebirds!";
  if (hour < 17) return "☀️ Afternoon cuddles? Let's connect!";
  if (hour < 21) return "🌆 Evening romance time!";
  return "🌙 Good night, sweetheart!";
}

/**
 * Random mood suggestions
 */
export const moodEmojis = [
  "😊", "😍", "🥰", "😘", "🤗", "😌", "😴", "🔥", "💪", "🎉", "✨", "💕"
];

/**
 * Get random quote
 */
export function getRandomQuote(): string {
  return romanticQuotes[Math.floor(Math.random() * romanticQuotes.length)];
}

/**
 * Get random motivation message
 */
export function getRandomMotivation(): string {
  return streakMotivations[
    Math.floor(Math.random() * streakMotivations.length)
  ];
}

/**
 * Get random mood emoji
 */
export function getRandomMoodEmoji(): string {
  return moodEmojis[Math.floor(Math.random() * moodEmojis.length)];
}
