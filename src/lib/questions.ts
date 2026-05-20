// Daily romantic questions pool — 120+ questions across categories

export interface QuestionEntry {
  question: string;
  category: "deep" | "fun" | "romantic" | "nostalgic" | "spicy" | "dream";
}

export const QUESTIONS: QuestionEntry[] = [
  // Deep
  { question: "What moment made you realize you were in love with me?", category: "deep" },
  { question: "What's something about our relationship that you're most proud of?", category: "deep" },
  { question: "If you could relive one moment we've shared, which would it be?", category: "deep" },
  { question: "What's the hardest thing you've overcome because of our love?", category: "deep" },
  { question: "What does 'home' mean to you when you think of us?", category: "deep" },
  { question: "What's a fear you have about our future that you haven't shared?", category: "deep" },
  { question: "How has loving me changed who you are?", category: "deep" },
  { question: "What do you think is our greatest strength as a couple?", category: "deep" },
  { question: "What's something you wish I understood better about you?", category: "deep" },
  { question: "When do you feel most emotionally connected to me?", category: "deep" },
  { question: "What's a sacrifice you've made for us that I might not know about?", category: "deep" },
  { question: "What would you tell your younger self about our relationship?", category: "deep" },
  { question: "What's the most important lesson our love has taught you?", category: "deep" },
  { question: "How do you want to grow together in the next year?", category: "deep" },
  { question: "What makes you feel safe with me?", category: "deep" },
  { question: "What's a part of yourself you only show to me?", category: "deep" },
  { question: "What moment with me do you replay in your mind most often?", category: "deep" },
  { question: "When did you first feel truly understood by me?", category: "deep" },
  { question: "What do you think we need to work on together?", category: "deep" },
  { question: "How would you describe our love in three words?", category: "deep" },

  // Romantic
  { question: "What's your favorite thing to hear me say?", category: "romantic" },
  { question: "Where's the most romantic place you'd love to visit with me?", category: "romantic" },
  { question: "What's the most romantic thing I've ever done for you?", category: "romantic" },
  { question: "If we could have a perfect date tonight, what would it look like?", category: "romantic" },
  { question: "What song reminds you of us?", category: "romantic" },
  { question: "What small gesture of mine makes your heart melt?", category: "romantic" },
  { question: "What's your favorite way to show love?", category: "romantic" },
  { question: "Describe our love as a movie — what genre would it be?", category: "romantic" },
  { question: "What's something simple I do that makes you fall for me all over?", category: "romantic" },
  { question: "What's a love letter you've always wanted to write me?", category: "romantic" },
  { question: "What does my touch make you feel?", category: "romantic" },
  { question: "If our love had a color, what would it be?", category: "romantic" },
  { question: "What's the sweetest dream you've had about us?", category: "romantic" },
  { question: "What physical feature of mine do you love most?", category: "romantic" },
  { question: "What love language speaks to your heart the most?", category: "romantic" },
  { question: "What's a romantic tradition you'd love us to start?", category: "romantic" },
  { question: "What moment today made you think of me?", category: "romantic" },
  { question: "How would you propose to me if we met again for the first time?", category: "romantic" },
  { question: "What's the most beautiful thing about us being together?", category: "romantic" },
  { question: "What poem or quote perfectly describes how you feel about me?", category: "romantic" },

  // Fun
  { question: "If we were a TV couple, who would we be?", category: "fun" },
  { question: "What's the funniest thing that's happened to us?", category: "fun" },
  { question: "If we swapped lives for a day, what would surprise you most?", category: "fun" },
  { question: "What's a weird habit of mine that you secretly love?", category: "fun" },
  { question: "If we had a couple's superpower, what would it be?", category: "fun" },
  { question: "What food reminds you of me and why?", category: "fun" },
  { question: "What's the most embarrassing thing you've done to impress me?", category: "fun" },
  { question: "If we could teleport anywhere right now, where would we go?", category: "fun" },
  { question: "What's a hobby you'd love us to try together?", category: "fun" },
  { question: "If you could give our love story a title, what would it be?", category: "fun" },
  { question: "What animal would I be and why?", category: "fun" },
  { question: "What's the silliest argument we've ever had?", category: "fun" },
  { question: "If we were stranded on an island, what three things would you bring?", category: "fun" },
  { question: "What would our couple name be?", category: "fun" },
  { question: "If we competed on a game show, what would we win at?", category: "fun" },
  { question: "What's a skill I have that secretly impresses you?", category: "fun" },
  { question: "What Disney movie is most like our relationship?", category: "fun" },
  { question: "Would you rather have a love potion or a truth serum for a day?", category: "fun" },
  { question: "What's the most random thing you know about me?", category: "fun" },
  { question: "If we had to survive a zombie apocalypse together, what's our strategy?", category: "fun" },

  // Nostalgic
  { question: "What was your very first impression of me?", category: "nostalgic" },
  { question: "What's your favorite memory from our first month together?", category: "nostalgic" },
  { question: "When did you first know you wanted to be with me?", category: "nostalgic" },
  { question: "What's something from our early days that you miss?", category: "nostalgic" },
  { question: "What was the best trip or adventure we've had?", category: "nostalgic" },
  { question: "What's a conversation we had that changed everything?", category: "nostalgic" },
  { question: "What gift from me do you treasure most?", category: "nostalgic" },
  { question: "What's your favorite photo of us and why?", category: "nostalgic" },
  { question: "Do you remember what you were wearing when we first met?", category: "nostalgic" },
  { question: "What season of our relationship has been your favorite so far?", category: "nostalgic" },
  { question: "What's a small moment with me that you'll never forget?", category: "nostalgic" },
  { question: "What's the first meal we ever shared?", category: "nostalgic" },
  { question: "What was the first compliment you gave me?", category: "nostalgic" },
  { question: "What's the oldest text from me you still have saved?", category: "nostalgic" },
  { question: "What milestone in our relationship are you most proud of?", category: "nostalgic" },
  { question: "What was playing in the background during a special moment with us?", category: "nostalgic" },
  { question: "What's a tradition from our past you'd like to bring back?", category: "nostalgic" },
  { question: "What's the first thing you told your friends about me?", category: "nostalgic" },
  { question: "What was the moment you knew this was real love?", category: "nostalgic" },
  { question: "What's a forgotten memory of us that deserves to be remembered?", category: "nostalgic" },

  // Spicy
  { question: "What's something you've always wanted to try with me?", category: "spicy" },
  { question: "What outfit of mine drives you the most wild?", category: "spicy" },
  { question: "What's the most attractive thing I do without realizing it?", category: "spicy" },
  { question: "What scent reminds you of an intimate moment with me?", category: "spicy" },
  { question: "What's a secret fantasy you haven't told me about yet?", category: "spicy" },
  { question: "Where's the most unexpected place you'd want us to go on a date?", category: "spicy" },
  { question: "What's the boldest thing you'd do to get my attention?", category: "spicy" },
  { question: "If you could plan a surprise evening for us, what would happen?", category: "spicy" },
  { question: "What's the most daring text you'd send me right now?", category: "spicy" },
  { question: "What does my smile do to you?", category: "spicy" },

  // Dream
  { question: "Where do you see us in five years?", category: "dream" },
  { question: "What's your dream home with me like?", category: "dream" },
  { question: "What adventure do you dream of us going on someday?", category: "dream" },
  { question: "If money was no object, what gift would you give me?", category: "dream" },
  { question: "What tradition would you love to start for our future family?", category: "dream" },
  { question: "What's a goal you want us to achieve together?", category: "dream" },
  { question: "If we could live anywhere in the world, where would it be?", category: "dream" },
  { question: "What's your dream vacation with me?", category: "dream" },
  { question: "What's one thing on your couple's bucket list?", category: "dream" },
  { question: "How do you picture us growing old together?", category: "dream" },
  { question: "What would our perfect Sunday morning look like?", category: "dream" },
  { question: "If we could build something together, what would it be?", category: "dream" },
  { question: "What skill do you wish we could learn together?", category: "dream" },
  { question: "What's a project you'd love to create with me?", category: "dream" },
  { question: "What would you name a star after us?", category: "dream" },
  { question: "If we could freeze one moment in time forever, which would you choose?", category: "dream" },
  { question: "What kind of love story do you want us to have?", category: "dream" },
  { question: "What legacy do you want our love to leave?", category: "dream" },
  { question: "What does 'forever' look like to you?", category: "dream" },
  { question: "If our love was a garden, what would grow in it?", category: "dream" },
];

/** Get today's question based on the date — deterministic, cycles through all questions */
export function getTodaysQuestion(): QuestionEntry {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  );
  const index = (dayOfYear + today.getFullYear()) % QUESTIONS.length;
  return QUESTIONS[index];
}

/** Get the date string for today in YYYY-MM-DD format */
export function getTodayDateString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Romantic quotes for the dashboard */
export const ROMANTIC_QUOTES = [
  "Every love story is beautiful, but ours is my favorite.",
  "In all the world, there is no heart for me like yours.",
  "I have found the one whom my soul loves.",
  "You are my today and all of my tomorrows.",
  "My heart is, and always will be, yours.",
  "I love you more than yesterday, less than tomorrow.",
  "Together is a beautiful place to be.",
  "You are the reason I believe in love.",
  "Every moment with you is a moment I treasure.",
  "Love is not about how many days you've been together, it's about how much you love each other every single day.",
  "I fell in love with your courage, your sincerity, and your self-respect.",
  "In you, I've found the love of my life and my closest friend.",
  "The best thing to hold onto in life is each other.",
  "You are my sun, my moon, and all of my stars.",
  "Love is composed of a single soul inhabiting two bodies.",
];

export function getRandomQuote(): string {
  const dayIndex = new Date().getDate() % ROMANTIC_QUOTES.length;
  return ROMANTIC_QUOTES[dayIndex];
}
