/**
 * Local history store for generations
 * Stores user generation history in localStorage
 */

export interface Generation {
  id: string;
  type: 'image' | 'video' | 'audio';
  input: string;
  outputUrl: string;
  status: 'success' | 'error';
  createdAt: string;
  processingTime: number;
  error?: string;
}

const STORAGE_KEY = 'echo_avatar_history';
const MAX_HISTORY_ITEMS = 100;

export const historyStore = {
  /**
   * Get all generation history
   */
  getAll(): Generation[] {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    try {
      return JSON.parse(stored) as Generation[];
    } catch (error) {
      console.error('Failed to parse history:', error);
      return [];
    }
  },

  /**
   * Add a generation record
   */
  add(generation: Omit<Generation, 'id' | 'createdAt'>): Generation {
    const record: Generation = {
      ...generation,
      id: `gen_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };

    const history = this.getAll();
    history.unshift(record); // Most recent first
    
    // Keep only the last MAX_HISTORY_ITEMS
    const trimmed = history.slice(0, MAX_HISTORY_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));

    return record;
  },

  /**
   * Get a specific generation by ID
   */
  getById(id: string): Generation | undefined {
    return this.getAll().find(item => item.id === id);
  },

  /**
   * Delete a generation record
   */
  delete(id: string): void {
    const history = this.getAll().filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  },

  /**
   * Clear all history
   */
  clear(): void {
    localStorage.removeItem(STORAGE_KEY);
  },

  /**
   * Get history count
   */
  count(): number {
    return this.getAll().length;
  },
};
