import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

interface ReminderStore {
  checklists: ChecklistItem[];
  addChecklist: (text: string) => void;
  toggleChecklist: (id: string) => void;
  removeChecklist: (id: string) => void;
  editChecklist: (id: string, text: string) => void;
}

export const useReminderStore = create<ReminderStore>((set) => ({
  checklists: [],
  addChecklist: (text) => 
    set((state) => ({
      checklists: [...state.checklists, { id: uuidv4(), text, completed: false }]
    })),
  toggleChecklist: (id) =>
    set((state) => ({
      checklists: state.checklists.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    })),
  removeChecklist: (id) =>
    set((state) => ({
      checklists: state.checklists.filter((item) => item.id !== id)
    })),
  editChecklist: (id, text) =>
    set((state) => ({
      checklists: state.checklists.map((item) =>
        item.id === id ? { ...item, text } : item
      )
    }))
}));