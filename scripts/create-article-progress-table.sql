-- Create user article progress table
CREATE TABLE IF NOT EXISTS user_article_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  article_id UUID REFERENCES "articles module"(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  reading_time INTEGER DEFAULT 0, -- in seconds
  completion_percentage INTEGER DEFAULT 0,
  last_read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, article_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_article_progress_user_id ON user_article_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_article_progress_article_id ON user_article_progress(article_id);
CREATE INDEX IF NOT EXISTS idx_user_article_progress_completed ON user_article_progress(completed);

-- Enable RLS
ALTER TABLE user_article_progress ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own progress" ON user_article_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress" ON user_article_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" ON user_article_progress
  FOR UPDATE USING (auth.uid() = user_id);
