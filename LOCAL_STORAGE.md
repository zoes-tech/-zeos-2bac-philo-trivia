# Zeos 2Bac Trivia - Local Storage System

## Overview

All user progress and game data is stored locally on the user's device using browser localStorage. No cloud database is required - everything stays on the device.

## Storage Keys

The app uses two localStorage keys:

### 1. `zeos-stats` (Scoring System)
```json
{
  "score": 1250,
  "currentStreak": 5,
  "highestStreak": 12,
  "dailyStreak": 3,
  "lastPlayedDate": "2026-05-02T10:30:00.000Z",
  "rank": "Géologue Amateur",
  "rankEmoji": "🏔️",
  "multiplier": 1.5,
  "isGodMode": false,
  "totalTimeBonus": 15
}
```

### 2. `zeos-game-storage` (Game Progress)
```json
{
  "state": {
    "currentLevel": "common-core",
    "xp": 250,
    "unlockedConcepts": ["myth-logos", "nature-culture"],
    "completedQuizzes": ["intro-philosophy"],
    "unlockedPhilosophers": ["thales"]
  },
  "_expires": "2026-06-02T10:30:00.000Z"
}
```

### 3. `zeos-progress-storage` (Detailed Progress)
```json
{
  "xp": 250,
  "level": "common-core",
  "unlockedModules": ["common-core", "1st-bac"],
  "completedModules": ["intro-philosophy"],
  "quizProgress": {
    "intro-philosophy": {
      "moduleId": "intro-philosophy",
      "completedQuestions": ["q1", "q2", "q3"],
      "lastQuestionIndex": 2,
      "attempts": 5,
      "bestScore": 80
    }
  },
  "philosophersUnlocked": ["thales"],
  "lastPlayed": "2026-05-02",
  "totalQuestionsAnswered": 50,
  "totalCorrectAnswers": 40,
  "studyStreak": 3,
  "lastStudyDate": "2026-05-02"
}
```

## Data Stored

### Scoring System (`zeos-stats`)
- Total score points
- Current streak count
- Highest streak achieved
- Daily streak count (consecutive days played)
- Last played timestamp
- Current rank and emoji
- Active multiplier
- God Mode status
- Total time bonus earned

### Game Progress (`zeos-game-storage`)
- Current level (common-core, 1st-bac, 2nd-bac)
- XP points
- Unlocked concepts
- Completed quizzes
- Unlocked philosophers

### Detailed Progress (`zeos-progress-storage`)
- Module unlock status
- Quiz completion progress
- Per-question completion tracking
- Best score per quiz
- Total questions answered
- Total correct answers
- Study streak (consecutive days)
- Overall accuracy rate

## Privacy

- **All data stays on user's device**
- No data is sent to any server
- No account or login required
- Data persists across browser sessions
- No third-party access

## Managing Data

### Clear All Data
Users can clear all progress by:
1. Opening browser settings
2. Going to "Clear browsing data" or "Clear site data"
3. Selecting "All time" or the time range
4. Checking "Local data" or "Site data"
5. Clicking "Clear data"

### Manual Reset
The app includes a reset function accessible in developer mode.

## Export/Import (Future Enhancement)

Potential future feature:
- Export progress as JSON file
- Import from file on new device

## Storage Limits

localStorage has approximately 5-10MB limit:
- Text data: ~5MB (plenty for our app)
- Quiz questions: ~1MB
- User progress: ~50KB
- **Estimated usage: < 1% of limit**

## Browser Support

Works in all modern browsers:
- Chrome/Edge 80+
- Firefox 75+
- Safari 14+
- No IE support (outdated)

## Offline Support

Since data is stored locally:
- App works fully offline
- PWA can be installed
- No internet required after initial load

## Future: Cloud Sync (Optional)

If cloud sync is requested later:
- User would create account
- Data would sync to cloud
- Existing local data could be imported
- Manual sync option available