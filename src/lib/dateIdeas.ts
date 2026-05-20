// =============================================
// Torch — Date Ideas Generator
// =============================================

import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
  Timestamp,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "./firebase";

export interface DateIdea {
  id?: string;
  idea: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  estimatedTime?: string;
  budget?: "free" | "cheap" | "$" | "$$" | "$$$";
  description?: string;
  tags?: string[];
  rating?: number;
  savedAt?: Timestamp;
  completedAt?: Timestamp;
}

const DATE_IDEAS_DATABASE = [
  {
    idea: "Sunrise picnic by the beach",
    category: "outdoor",
    difficulty: "easy" as const,
    budget: "cheap" as const,
    tags: ["romantic", "nature", "morning"],
  },
  {
    idea: "Cook a new cuisine together",
    category: "cooking",
    difficulty: "medium" as const,
    budget: "cheap" as const,
    tags: ["fun", "creative", "food"],
  },
  {
    idea: "Stargazing night with snacks",
    category: "outdoor",
    difficulty: "easy" as const,
    budget: "free" as const,
    tags: ["romantic", "nature", "evening"],
  },
  {
    idea: "DIY couples massage night",
    category: "relaxation",
    difficulty: "easy" as const,
    budget: "cheap" as const,
    tags: ["romantic", "relaxing", "at-home"],
  },
  {
    idea: "Visit a local market/fair",
    category: "shopping",
    difficulty: "easy" as const,
    budget: "cheap" as const,
    tags: ["fun", "casual", "adventure"],
  },
  {
    idea: "Create a bucket list together",
    category: "planning",
    difficulty: "easy" as const,
    budget: "free" as const,
    tags: ["meaningful", "planning", "couples"],
  },
  {
    idea: "Weekend hiking adventure",
    category: "outdoor",
    difficulty: "hard" as const,
    budget: "free" as const,
    tags: ["active", "nature", "adventure"],
  },
  {
    idea: "Build a blanket fort",
    category: "at-home",
    difficulty: "easy" as const,
    budget: "free" as const,
    tags: ["fun", "playful", "cozy"],
  },
  {
    idea: "Photo shoot together",
    category: "creative",
    difficulty: "medium" as const,
    budget: "free" as const,
    tags: ["creative", "memories", "fun"],
  },
  {
    idea: "Wine tasting night",
    category: "food",
    difficulty: "easy" as const,
    budget: "$$$" as const,
    tags: ["romantic", "food", "adult"],
  },
  {
    idea: "Take a dance class together",
    category: "activity",
    difficulty: "medium" as const,
    budget: "$" as const,
    tags: ["fun", "active", "playful"],
  },
  {
    idea: "Volunteer together",
    category: "social",
    difficulty: "medium" as const,
    budget: "free" as const,
    tags: ["meaningful", "community", "giving"],
  },
  {
    idea: "Road trip adventure",
    category: "travel",
    difficulty: "hard" as const,
    budget: "$$$" as const,
    tags: ["adventure", "exploration", "time-together"],
  },
  {
    idea: "Movie marathon night",
    category: "at-home",
    difficulty: "easy" as const,
    budget: "cheap" as const,
    tags: ["cozy", "casual", "fun"],
  },
  {
    idea: "Plan and book a trip",
    category: "planning",
    difficulty: "medium" as const,
    budget: "free" as const,
    tags: ["adventure", "planning", "excitement"],
  },
];

/**
 * Get random date idea
 */
export function getRandomDateIdea(category?: string): DateIdea {
  let ideas = DATE_IDEAS_DATABASE;

  if (category) {
    ideas = ideas.filter((i) => i.category.toLowerCase() === category.toLowerCase());
  }

  if (ideas.length === 0) {
    ideas = DATE_IDEAS_DATABASE;
  }

  const randomIdea = ideas[Math.floor(Math.random() * ideas.length)];
  return randomIdea as DateIdea;
}

/**
 * Get multiple random date ideas
 */
export function getRandomDateIdeas(
  count: number = 5,
  category?: string
): DateIdea[] {
  const ideas: DateIdea[] = [];
  const usedIndices = new Set<number>();

  let availableIdeas = DATE_IDEAS_DATABASE;
  if (category) {
    availableIdeas = availableIdeas.filter(
      (i) => i.category.toLowerCase() === category.toLowerCase()
    );
  }

  for (let i = 0; i < Math.min(count, availableIdeas.length); i++) {
    let randomIndex = Math.floor(Math.random() * availableIdeas.length);
    while (usedIndices.has(randomIndex)) {
      randomIndex = Math.floor(Math.random() * availableIdeas.length);
    }
    usedIndices.add(randomIndex);
    ideas.push(availableIdeas[randomIndex] as DateIdea);
  }

  return ideas;
}

/**
 * Get all date ideas by category
 */
export function getDateIdeasByCategory(category: string): DateIdea[] {
  return DATE_IDEAS_DATABASE.filter(
    (i) => i.category.toLowerCase() === category.toLowerCase()
  ) as DateIdea[];
}

/**
 * Save date idea to couple's collection
 */
export async function saveDateIdea(
  coupleId: string,
  idea: DateIdea
): Promise<string> {
  try {
    const ideaWithTimestamp = {
      ...idea,
      savedAt: Timestamp.now(),
      completedAt: null,
      rating: 0,
    };

    const ideasRef = collection(db, `couples/${coupleId}/date-ideas`);
    const docRef = await addDoc(ideasRef, ideaWithTimestamp);

    return docRef.id;
  } catch (error) {
    console.error("Error saving date idea:", error);
    throw error;
  }
}

/**
 * Get saved date ideas
 */
export async function getSavedDateIdeas(coupleId: string) {
  try {
    const q = query(
      collection(db, `couples/${coupleId}/date-ideas`),
      orderBy("savedAt", "desc")
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as (DateIdea & { id: string })[];
  } catch (error) {
    console.error("Error getting saved date ideas:", error);
    return [];
  }
}

/**
 * Get completed date ideas
 */
export async function getCompletedDateIdeas(coupleId: string) {
  try {
    const ideas = await getSavedDateIdeas(coupleId);
    return ideas.filter((i) => i.completedAt !== null && i.completedAt !== undefined);
  } catch (error) {
    console.error("Error getting completed ideas:", error);
    return [];
  }
}

/**
 * Mark date idea as completed
 */
export async function completeeDateIdea(
  coupleId: string,
  ideaId: string,
  rating: number = 0
): Promise<void> {
  try {
    const ideaRef = doc(db, `couples/${coupleId}/date-ideas/${ideaId}`);
    await updateDoc(ideaRef, {
      completedAt: Timestamp.now(),
      rating: Math.max(0, Math.min(5, rating)),
    });
  } catch (error) {
    console.error("Error completing date idea:", error);
  }
}

/**
 * Rate a date idea
 */
export async function rateDateIdea(
  coupleId: string,
  ideaId: string,
  rating: number
): Promise<void> {
  try {
    const ideaRef = doc(db, `couples/${coupleId}/date-ideas/${ideaId}`);
    await updateDoc(ideaRef, {
      rating: Math.max(0, Math.min(5, rating)),
    });
  } catch (error) {
    console.error("Error rating date idea:", error);
  }
}

/**
 * Delete a saved date idea
 */
export async function deleteeDateIdea(
  coupleId: string,
  ideaId: string
): Promise<void> {
  try {
    const ideaRef = doc(db, `couples/${coupleId}/date-ideas/${ideaId}`);
    await deleteDoc(ideaRef);
  } catch (error) {
    console.error("Error deleting date idea:", error);
  }
}

/**
 * Get date ideas statistics
 */
export async function getDateIdeasStats(coupleId: string) {
  try {
    const savedIdeas = await getSavedDateIdeas(coupleId);
    const completed = savedIdeas.filter(
      (i) => i.completedAt !== null && i.completedAt !== undefined
    ).length;
    const avgRating =
      savedIdeas.length > 0
        ? (
            savedIdeas.reduce((acc, i) => acc + (i.rating || 0), 0) /
            savedIdeas.length
          ).toFixed(1)
        : "0";

    const byCategory: { [key: string]: number } = {};
    savedIdeas.forEach((i) => {
      byCategory[i.category] = (byCategory[i.category] || 0) + 1;
    });

    return {
      totalSaved: savedIdeas.length,
      completed,
      avgRating,
      byCategory,
      favorite: savedIdeas.sort((a, b) => (b.rating || 0) - (a.rating || 0))[0] ||
        null,
    };
  } catch (error) {
    console.error("Error getting date ideas stats:", error);
    return {
      totalSaved: 0,
      completed: 0,
      avgRating: "0",
      byCategory: {},
      favorite: null,
    };
  }
}

/**
 * Get all categories
 */
export function getAllCategories(): string[] {
  const categories = new Set<string>();
  DATE_IDEAS_DATABASE.forEach((idea) => {
    categories.add(idea.category);
  });
  return Array.from(categories).sort();
}

export default {
  getRandomDateIdea,
  getRandomDateIdeas,
  getDateIdeasByCategory,
  saveDateIdea,
  getSavedDateIdeas,
  getCompletedDateIdeas,
  completeeDateIdea,
  rateDateIdea,
  deleteeDateIdea,
  getDateIdeasStats,
  getAllCategories,
};
