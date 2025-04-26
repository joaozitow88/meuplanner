/*
  # Create planner tables

  1. New Tables
    - `plans` - Stores study plans
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `weeks` - Stores weeks within plans
      - `id` (uuid, primary key)
      - `plan_id` (uuid, references plans)
      - `name` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `topics` - Stores topics within weeks
      - `id` (uuid, primary key)
      - `week_id` (uuid, references weeks)
      - `name` (text)
      - `total_questions` (integer)
      - `correct_answers` (integer)
      - `wrong_answers` (integer)
      - `accuracy_percentage` (float)
      - `study_time_minutes` (integer)
      - `completed` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Plans table
CREATE TABLE IF NOT EXISTS plans (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id),
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own plans"
  ON plans
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own plans"
  ON plans
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own plans"
  ON plans
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own plans"
  ON plans
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Weeks table
CREATE TABLE IF NOT EXISTS weeks (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_id uuid REFERENCES plans(id) ON DELETE CASCADE,
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE weeks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own weeks"
  ON weeks
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM plans
      WHERE plans.id = weeks.plan_id
      AND plans.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own weeks"
  ON weeks
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM plans
      WHERE plans.id = plan_id
      AND plans.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own weeks"
  ON weeks
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM plans
      WHERE plans.id = weeks.plan_id
      AND plans.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own weeks"
  ON weeks
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM plans
      WHERE plans.id = weeks.plan_id
      AND plans.user_id = auth.uid()
    )
  );

-- Topics table
CREATE TABLE IF NOT EXISTS topics (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  week_id uuid REFERENCES weeks(id) ON DELETE CASCADE,
  name text NOT NULL,
  total_questions integer DEFAULT 0,
  correct_answers integer DEFAULT 0,
  wrong_answers integer DEFAULT 0,
  accuracy_percentage float DEFAULT 0,
  study_time_minutes integer DEFAULT 0,
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE topics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own topics"
  ON topics
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM weeks
      JOIN plans ON plans.id = weeks.plan_id
      WHERE weeks.id = topics.week_id
      AND plans.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own topics"
  ON topics
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM weeks
      JOIN plans ON plans.id = weeks.plan_id
      WHERE weeks.id = week_id
      AND plans.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own topics"
  ON topics
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM weeks
      JOIN plans ON plans.id = weeks.plan_id
      WHERE weeks.id = topics.week_id
      AND plans.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own topics"
  ON topics
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM weeks
      JOIN plans ON plans.id = weeks.plan_id
      WHERE weeks.id = topics.week_id
      AND plans.user_id = auth.uid()
    )
  );

-- Update triggers
CREATE TRIGGER update_plans_updated_at
  BEFORE UPDATE ON plans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_weeks_updated_at
  BEFORE UPDATE ON weeks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_topics_updated_at
  BEFORE UPDATE ON topics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();