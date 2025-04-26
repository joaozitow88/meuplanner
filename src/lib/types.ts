export interface Database {
  public: {
    Tables: {
      plans: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          created_at: string;
          updated_at: string;
        };
      };
      weeks: {
        Row: {
          id: string;
          plan_id: string;
          name: string;
          created_at: string;
          updated_at: string;
        };
      };
      topics: {
        Row: {
          id: string;
          week_id: string;
          name: string;
          total_questions: number;
          correct_answers: number;
          wrong_answers: number;
          accuracy_percentage: number;
          study_time_minutes: number;
          completed: boolean;
          created_at: string;
          updated_at: string;
        };
      };
      exam_dates: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          created_at: string;
          updated_at: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          message: string;
          type: 'revision' | 'exam' | 'general';
          date: string;
          read: boolean;
          created_at: string;
        };
      };
      themes: {
        Row: {
          user_id: string;
          is_dark_mode: boolean;
          created_at: string;
          updated_at: string;
        };
      };
    };
  };
}

export interface Topic {
  id: string;
  name: string;
  total_questions: number;
  correct_answers: number;
  wrong_answers: number;
  accuracy_percentage: number;
  study_time_minutes: number;
  completed: boolean;
}

export interface Week {
  id: string;
  name: string;
  topics: Topic[];
  created_at: string;
}

export interface WeekWithStats extends Week {
  totalTopics: number;
  completedTopics: number;
  questionsCompleted: number;
  accuracy_percentage?: number;
}