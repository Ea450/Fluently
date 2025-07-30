# 🚀 Fluently - Feedback & Rating System Setup Guide

## 📋 Prerequisites

Before you can test the feedback and rating system, you need to set up the following services:

### 1. **Supabase Database** 🗄️

You'll need to create the following tables in your Supabase database:

#### **lessons** table:
```sql
CREATE TABLE lessons (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id text NOT NULL,
  language text NOT NULL,
  level text NOT NULL,
  topic text NOT NULL,
  duration integer NOT NULL,
  rate decimal DEFAULT 0,
  feedback text,
  created_at timestamptz DEFAULT now()
);
```

#### **quizzes** table:
```sql
CREATE TABLE quizzes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  author text NOT NULL,
  language text NOT NULL,
  level text NOT NULL,
  score integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
```

#### **quiz_questions** table:
```sql
CREATE TABLE quiz_questions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  category text NOT NULL,
  question text NOT NULL,
  question_en text NOT NULL,
  choices text[] NOT NULL,
  correct_answer_index integer NOT NULL,
  language text NOT NULL,
  level text NOT NULL,
  created_at timestamptz DEFAULT now()
);
```

#### **quiz_question_links** table:
```sql
CREATE TABLE quiz_question_links (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_id uuid REFERENCES quizzes(id) ON DELETE CASCADE,
  question_id uuid REFERENCES quiz_questions(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);
```

### 2. **Environment Variables** ⚙️

Update the `.env.local` file with your actual credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_secret_here

# VAPI Configuration (for AI conversations)
VAPI_API_KEY=your_vapi_api_key_here
NEXT_PUBLIC_VAPI_PUBLIC_KEY=your_vapi_public_key_here

# OpenAI Configuration
OPENAI_API_KEY=sk-your_openai_key_here
```

## 🛠️ Setup Instructions

### Step 1: Install Dependencies
```bash
npm install --legacy-peer-deps
```

### Step 2: Configure Environment
1. Copy the `.env.local` file and fill in your actual credentials
2. Make sure your Supabase tables are created (see SQL above)

### Step 3: Start Development Server
```bash
npm run dev
```

### Step 4: Access the Application
Open your browser and go to: **http://localhost:3000**

## 🧪 Testing the Feedback & Rating System

### 1. **Sign Up/Sign In** 👤
- Go to `http://localhost:3000`
- Sign up for a new account or sign in
- You'll be redirected to the dashboard

### 2. **Create Test Lessons** 📚
- Go to "Create Lesson" or use the existing lesson creation flow
- Create a few lessons with different languages and levels
- This will give you data to work with

### 3. **Test Feedback Features** 💬

#### **Automatic Feedback** (AI Generated):
- Complete a lesson with AI conversation
- The system automatically extracts and saves feedback at the end
- Check the database to see the stored feedback

#### **Manual Feedback**:
1. Go to `/feedback` page
2. Click "Add Feedback" button
3. Fill out the manual feedback form:
   - Select a lesson
   - Rate it (1-5 stars)
   - Write feedback text
4. Submit and see it appear in your feedback list

### 4. **Test Analytics Dashboard** 📊
- Visit `/feedback` to see:
  - Overall progress metrics
  - Average ratings
  - Language-specific breakdowns
  - Visual analytics with progress bars

### 5. **Test Export Functionality** 📤
- On the feedback page, click "Export CSV"
- Download your feedback data as a CSV file

### 6. **Test Enhanced UI** 🎨
- Check the improved lesson cards with:
  - Star ratings
  - Performance badges
  - Color-coded progress bars
- Navigate through different sections using the navbar

## 🌐 URLs to Test

- **Dashboard**: `http://localhost:3000/`
- **Lessons**: `http://localhost:3000/lessons`
- **Practice**: `http://localhost:3000/practice`
- **Feedback**: `http://localhost:3000/feedback` ⭐ **NEW!**
- **Create Lesson**: `http://localhost:3000/createLesson`

## 🔧 Troubleshooting

### Common Issues:

1. **500 Error on Startup**:
   - Check that all environment variables are set correctly
   - Verify Supabase connection and table creation

2. **Authentication Issues**:
   - Make sure Clerk keys are configured properly
   - Check that redirect URLs are set correctly

3. **Database Errors**:
   - Verify all tables exist in Supabase
   - Check Row Level Security (RLS) policies if enabled

4. **Missing Data**:
   - Create some test lessons first
   - Add manual feedback to see the system working

## 🎯 Key Features to Test

### ✅ **Feedback System**:
- [ ] AI-generated feedback after lessons
- [ ] Manual feedback submission
- [ ] Feedback display with ratings and stars
- [ ] Date formatting and timestamps

### ✅ **Analytics Dashboard**:
- [ ] Overall progress metrics
- [ ] Language-specific breakdowns
- [ ] Visual charts and progress bars
- [ ] Average rating calculations

### ✅ **Enhanced UI**:
- [ ] Improved lesson cards with badges
- [ ] Star rating displays
- [ ] Color-coded progress indicators
- [ ] Responsive design

### ✅ **Export Features**:
- [ ] CSV export functionality
- [ ] Data formatting and structure
- [ ] File download mechanism

## 📞 Need Help?

If you encounter any issues:
1. Check the browser console for errors
2. Verify your environment variables
3. Make sure your Supabase tables are set up correctly
4. Check the Next.js development server logs

---

**🎉 Enjoy testing your new feedback and rating system!**