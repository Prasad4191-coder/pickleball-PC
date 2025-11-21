'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MiniGameMatch } from '@/app/page';

interface MiniGameScorerProps {
  game: MiniGameMatch;
  onSubmit: (score: { t1: number; t2: number }) => void;
}

export default function MiniGameScorer({ game, onSubmit }: MiniGameScorerProps) {
  const [t1Score, setT1Score] = useState('');
  const [t2Score, setT2Score] = useState('');

  const handleSubmit = () => {
    if (t1Score === '' || t2Score === '') {
      alert('Please enter both scores');
      return;
    }

    const t1 = parseInt(t1Score);
    const t2 = parseInt(t2Score);

    if (isNaN(t1) || isNaN(t2)) {
      alert('Please enter valid numbers');
      return;
    }

    onSubmit({ t1, t2 });
    setT1Score('');
    setT2Score('');
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-1 block">{game.team1Name}</label>
          <Input
            type="number"
            min="0"
            placeholder="Score (max 7)"
            value={t1Score}
            onChange={(e) => setT1Score(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">{game.team2Name}</label>
          <Input
            type="number"
            min="0"
            placeholder="Score (max 7)"
            value={t2Score}
            onChange={(e) => setT2Score(e.target.value)}
          />
        </div>
      </div>
      <Button
        onClick={handleSubmit}
        className="w-full bg-green-600 hover:bg-green-700"
      >
        Submit Score
      </Button>
    </div>
  );
}
