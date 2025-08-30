import { get, set, del, clear, keys } from 'idb-keyval';

interface StorageData {
  soilData: any;
  cropSuggestions: any;
  marketPrices: any;
  userProfile: any;
  settings: any;
  offlineQueue: any[];
}

class OfflineStorage {
  private prefix = 'smartAg_';

  async setItem<T>(key: keyof StorageData, value: T): Promise<void> {
    try {
      await set(`${this.prefix}${key}`, value);
    } catch (error) {
      console.error('Failed to store data:', error);
      // Fallback to localStorage
      localStorage.setItem(`${this.prefix}${key}`, JSON.stringify(value));
    }
  }

  async getItem<T>(key: keyof StorageData): Promise<T | null> {
    try {
      const value = await get(`${this.prefix}${key}`);
      return value || null;
    } catch (error) {
      console.error('Failed to retrieve data:', error);
      // Fallback to localStorage
      const fallback = localStorage.getItem(`${this.prefix}${key}`);
      return fallback ? JSON.parse(fallback) : null;
    }
  }

  async removeItem(key: keyof StorageData): Promise<void> {
    try {
      await del(`${this.prefix}${key}`);
    } catch (error) {
      console.error('Failed to remove data:', error);
      localStorage.removeItem(`${this.prefix}${key}`);
    }
  }

  async clear(): Promise<void> {
    try {
      const allKeys = await keys();
      const prefixedKeys = allKeys.filter(key => 
        typeof key === 'string' && key.startsWith(this.prefix)
      );
      await Promise.all(prefixedKeys.map(key => del(key)));
    } catch (error) {
      console.error('Failed to clear data:', error);
      // Clear localStorage items as fallback
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
    }
  }

  async addToQueue(action: any): Promise<void> {
    const queue = (await this.getItem('offlineQueue') as any[]) || [];
    queue.push({
      ...action,
      timestamp: Date.now()
    });
    await this.setItem('offlineQueue', queue);
  }

  async getQueue(): Promise<any[]> {
    return (await this.getItem('offlineQueue') as any[]) || [];
  }

  async clearQueue(): Promise<void> {
    await this.setItem('offlineQueue', []);
  }

  async processQueue(): Promise<void> {
    const queue = await this.getQueue();
    if (queue.length === 0) return;

    // Process offline actions when back online
    for (const action of queue) {
      try {
        // Here you would dispatch the action to your API
        console.log('Processing offline action:', action);
        // await api.processAction(action);
      } catch (error) {
        console.error('Failed to process offline action:', error);
      }
    }

    await this.clearQueue();
  }
}

export const storage = new OfflineStorage();

// Voice storage utilities
export const voiceStorage = {
  async saveVoiceNote(id: string, audioBlob: Blob): Promise<void> {
    try {
      await set(`voice_${id}`, audioBlob);
    } catch (error) {
      console.error('Failed to save voice note:', error);
    }
  },

  async getVoiceNote(id: string): Promise<Blob | null> {
    try {
      return await get(`voice_${id}`) || null;
    } catch (error) {
      console.error('Failed to retrieve voice note:', error);
      return null;
    }
  },

  async deleteVoiceNote(id: string): Promise<void> {
    try {
      await del(`voice_${id}`);
    } catch (error) {
      console.error('Failed to delete voice note:', error);
    }
  }
};