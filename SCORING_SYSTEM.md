# Zeos 2Bac Trivia - Scoring System Documentation

## Overview

The scoring system is a robust, high-performance gamification engine designed to incentivize daily learning and accuracy. It uses React Context for state management and persists data via localStorage.

## Features

### 🎯 Base Scoring Logic

- **Correct Answer**: +100 points
- **Speed Bonus**: Answer within < 5 seconds = 1.5x multiplier
- **Streak Multiplier**:
  - 3 correct answers: 1.2x
  - 5 correct answers: 1.5x
  - 10+ correct answers: 2.0x ("God Mode")

### 🔥 Streak System

- **Current Streak**: Tracks consecutive correct answers
- **Highest Streak**: Records personal best
- **Daily Streak**: Tracks consecutive days of play
- **Reset Logic**: Wrong answer resets current streak to 0 immediately

### 🏆 Ranking System

| Score Range | Rank | Emoji |
|-------------|------|-------|
| 0-1000 | Novice Philosophe | 📜 |
| 1001-5000 | Géologue Amateur | 🏔️ |
| 5001-20000 | Savant de l'Atlas | 🦁 |
| 20000+ | Maître de l'Anatexie | 💎 |

## Technical Architecture

### Components

1. **ScoringProvider** (`src/contexts/ScoringProvider.tsx`)
   - Main context provider
   - Manages all scoring state
   - Handles localStorage persistence

2. **useScoring** Hook
   - Provides scoring API to components
   - Returns: score, streaks, multiplier, rank, submitAnswer()

3. **useScoreAnimation** Hook
   - Animates score counter
   - Pure JS implementation (no external libraries)

4. **useStreakAnimation** Hook
   - Animates streak counter with "pop" effect
   - Visual feedback for streak increments

### State Structure

```typescript
interface ScoringState {
  score: number;
  currentStreak: number;
  highestStreak: number;
  dailyStreak: number;
  lastPlayedDate: string | null;
  rank: string;
  rankEmoji: string;
  multiplier: number;
  isGodMode: boolean;
}
```

## Usage

### Basic Usage

```tsx
import { useScoring } from '@/contexts/ScoringProvider';

function MyComponent() {
  const { score, currentStreak, multiplier, submitAnswer } = useScoring();

  const handleAnswer = (isCorrect: boolean, timeTaken: number) => {
    submitAnswer(isCorrect, timeTaken);
  };

  return (
    <div>
      <p>Score: {score}</p>
      <p>Streak: {currentStreak}</p>
      <p>Multiplier: x{multiplier}</p>
    </div>
  );
}
```

### With Animations

```tsx
import { useScoring, useScoreAnimation, useStreakAnimation } from '@/contexts/ScoringProvider';

function ScoreDisplay() {
  const { score, currentStreak } = useScoring();
  const displayScore = useScoreAnimation(score);
  const { displayStreak, isPopping } = useStreakAnimation(currentStreak);

  return (
    <div>
      <motion.div animate={{ scale: isPopping ? 1.2 : 1 }}>
        <Flame /> {displayStreak}
      </motion.div>
      <div>{displayScore}</div>
    </div>
  );
}
```

## Performance Optimizations

1. **useMemo**: Score calculations are memoized to prevent unnecessary re-renders
2. **Pure JS Animations**: Counter animations use requestAnimationFrame for optimal performance
3. **Efficient State Updates**: Only relevant state portions are updated on each action
4. **LocalStorage Batching**: State is persisted efficiently without blocking UI

## Persistence

Data is stored in localStorage under the key `'zeos-stats'`:

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
  "isGodMode": false
}
```

## Daily Streak Logic

The daily streak system checks:
1. If last played date is today → Continue streak
2. If last played date was yesterday → Continue streak
3. If last played date was older → Reset streak to 0

## Edge Cases Handled

- `timeTaken` is null or undefined → No speed bonus applied
- localStorage is full → Graceful degradation (state not persisted)
- Invalid data in localStorage → Falls back to default state
- SSR/Server-side → Returns default state (no localStorage access)

## Visual Feedback

### Streak Indicators

- **0-2 streak**: Gray badge
- **3-4 streak**: Yellow/Orange gradient with flame animation
- **5-9 streak**: Orange/Red gradient with enhanced effects
- **10+ streak**: Purple/Pink gradient ("God Mode")

### Multiplier Display

- Shows current multiplier (e.g., "x1.5")
- Only visible when multiplier > 1.0
- Cyan color scheme for visibility

### God Mode

- Activated at 10+ streak
- Purple/Pink gradient effects
- Special badge and animations
- 2.0x multiplier applied

## Integration Points

### QuizCard Component

- Tracks question start time
- Calculates time taken for each answer
- Displays earned points after correct answer
- Shows streak and multiplier in real-time

### Header Component

- Displays current score with animation
- Shows streak counter with visual feedback
- Displays current rank and emoji
- Shows multiplier when active

### StatsCard Component

- Comprehensive stats display
- Progress bar for God Mode
- Historical data (highest streak, daily streak)
- Visual rank indicator

## Future Enhancements

Potential improvements for future versions:

1. **Leaderboards**: Compare scores with other players
2. **Achievements**: Unlock badges for milestones
3. **Power-ups**: Temporary score boosts
4. **Difficulty Scaling**: Adjust points based on question difficulty
5. **Time Attack Mode**: Special scoring for timed challenges

## Troubleshooting

### Score Not Updating

- Ensure `ScoringProvider` wraps your app
- Check that `submitAnswer()` is called with correct parameters
- Verify localStorage is not disabled

### Streak Not Resetting

- Check that wrong answers call `submitAnswer(false)`
- Verify daily streak logic with date calculations
- Ensure `lastPlayedDate` is being updated correctly

### Animations Not Working

- Verify Framer Motion is installed
- Check that animation hooks are used correctly
- Ensure component is not being unmounted/remounted too frequently

## Performance Notes

- The scoring system is optimized for low-spec hardware (i3 13th gen)
- No external animation libraries used
- Minimal re-renders through careful state management
- Efficient localStorage operations

## License

This scoring system is part of the Zeos Knowledge Platform project.
