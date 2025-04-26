import { create } from 'zustand';

interface StudyGoals {
  studyHours: {
    current: number;
    target: number;
  };
  questions: {
    current: number;
    target: number;
  };
}

interface StudyGoalsStore extends StudyGoals {
  updateStudyHoursTarget: (target: number) => void;
  updateStudyHoursCurrent: (current: number) => void;
  updateQuestionsTarget: (target: number) => void;
  updateQuestionsCurrent: (current: number) => void;
}

export const useStudyGoalsStore = create<StudyGoalsStore>((set) => ({
  studyHours: {
    current: 0,
    target: 40,
  },
  questions: {
    current: 0,
    target: 200,
  },
  updateStudyHoursTarget: (target) =>
    set((state) => ({
      studyHours: { ...state.studyHours, target },
    })),
  updateStudyHoursCurrent: (current) =>
    set((state) => ({
      studyHours: { ...state.studyHours, current },
    })),
  updateQuestionsTarget: (target) =>
    set((state) => ({
      questions: { ...state.questions, target },
    })),
  updateQuestionsCurrent: (current) =>
    set((state) => ({
      questions: { ...state.questions, current },
    })),
}));