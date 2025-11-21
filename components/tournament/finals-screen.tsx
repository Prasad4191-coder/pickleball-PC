'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Team, Match } from '@/app/page';

interface FinalsScreenProps {
  teams: Team[];
  matches: Match[];
  onFinalsComplete: (winner: Team) => void;
  onBack: () => void;
  teamCount: number;
  getRankings: () => Array<{
    team: Team;
    wins: number;
    losses: number;
    pointDiff: number;
    totalPoints: number;
  }>;
  miniGames?: any[];
  onSemifinalSubmit?: (semifinal: any) => void;
  onFinalSubmit?: (final: any) => void;
}

export default function FinalsScreen({
  teams,
  matches,
  onFinalsComplete,
  onBack,
  teamCount,
  getRankings,
  miniGames,
  onSemifinalSubmit,
  onFinalSubmit,
}: FinalsScreenProps) {
  const [finalMatch, setFinalMatch] = useState<Match | null>(null);
  const [tempScore, setTempScore] = useState<{ t1: string; t2: string }>({ t1: '', t2: '' });

  const rankings = getRankings();

  const determineFinalists = () => {
    if (teamCount === 3) {
      const firstPlaceWins = rankings[0].wins;
      const secondPlaceWins = rankings[1].wins;
      const thirdPlaceWins = rankings[2].wins;

      if (firstPlaceWins === 2 && (secondPlaceWins === 1 || thirdPlaceWins === 1)) {
        // Skip semifinals: 2-win team goes directly to finals with 1-win team
        return {
          needsSemifinal: false,
          finalist1: rankings[0].team,
          finalist2: rankings.find((r) => r.wins === 1)!.team,
        };
      } else if (firstPlaceWins === 1 && secondPlaceWins === 1 && thirdPlaceWins === 1) {
        // All 1-1: Need semifinals
        return {
          needsSemifinal: true,
          semifinalTeam1: rankings[1].team,
          semifinalTeam2: rankings[2].team,
          topSeed: rankings[0].team,
        };
      }
    }

    return null;
  };

  const finalists = determineFinalists();

  useEffect(() => {
    if (
      !finalMatch &&
      finalists &&
      !finalists.needsSemifinal &&
      finalists.finalist1 &&
      finalists.finalist2
    ) {
      const newFinalMatch = {
        id: 1000,
        team1: finalists.finalist1.id,
        team2: finalists.finalist2.id,
        team1Name: finalists.finalist1.teamName,
        team2Name: finalists.finalist2.teamName,
        score: { t1: 0, t2: 0 },
        winner: null,
        finished: false,
      };
      onFinalSubmit?.(newFinalMatch);
      setFinalMatch(newFinalMatch);
    }
  }, [finalMatch, finalists, onFinalSubmit]);

  if (!finalMatch && finalists?.needsSemifinal) {
    const topSeed = finalists.topSeed!;
    const semifinalTeam1 = finalists.semifinalTeam1!;
    const semifinalTeam2 = finalists.semifinalTeam2!;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-green-700">Semifinals</h1>
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
        </div>

        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-base">Tournament Status & Standings</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-3">
            <div className="bg-white p-2 rounded border-2 border-green-300">
              <p className="font-semibold text-green-700 mb-1">
                {topSeed.teamName}
              </p>
              <p className="text-xs">
                Record: 1W-1L | Gets bye to Final (Highest point differential/total points)
              </p>
            </div>

            <p className="text-center text-xs font-semibold text-gray-600">SEMIFINAL MATCH</p>

            <div className="bg-white p-2 rounded border-2 border-purple-300">
              <p className="font-semibold text-purple-700 mb-2">
                {semifinalTeam1.teamName} vs {semifinalTeam2.teamName}
              </p>
              <p className="text-xs text-gray-600 mb-1">{semifinalTeam1.teamName} - Record: 1W-1L</p>
              <p className="text-xs text-gray-600">{semifinalTeam2.teamName} - Record: 1W-1L</p>
              <p className="text-xs text-gray-600 mt-2">Winner advances to Final</p>
            </div>
          </CardContent>
        </Card>

        <Button
          onClick={() => {
            const semifinal = {
              id: 999,
              team1: semifinalTeam1.id,
              team2: semifinalTeam2.id,
              team1Name: semifinalTeam1.teamName,
              team2Name: semifinalTeam2.teamName,
              score: { t1: 0, t2: 0 },
              winner: null,
              finished: false,
            };
            onSemifinalSubmit?.(semifinal);
            setFinalMatch(semifinal);
          }}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold h-12"
        >
          Start Semifinal
        </Button>
      </div>
    );
  }

  const getFinalTeams = () => {
    if (
      finalists?.needsSemifinal === false &&
      finalists.finalist1 &&
      finalists.finalist2
    ) {
      // Direct to finals after semifinals logic
      return { finalist1: finalists.finalist1, finalist2: finalists.finalist2 };
    }
    if (finalMatch?.id === 1000) {
      // After semifinal, get winner
      const topSeed = rankings[0].team;
      const semifinalWinner = teams.find((t) => t.id === finalMatch.team2)!;
      return { finalist1: topSeed, finalist2: semifinalWinner };
    }
    return null;
  };



  const finalTeams = getFinalTeams();
  const isShowingFinal = finalMatch?.id === 1000 || (finalTeams && !finalists?.needsSemifinal);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-green-700">
          {finalMatch?.id === 999 ? 'Semifinal & Final' : 'Final'}
        </h1>
      </div>

      {finalMatch?.id === 1000 &&
        isShowingFinal &&
        finalists &&
        !finalists.needsSemifinal &&
        finalists.finalist1 &&
        finalists.finalist2 && (
          <Card className="border-blue-200 bg-blue-50 mb-4">
            <CardHeader>
              <CardTitle className="text-base">Why These Teams?</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p>
                <span className="font-semibold">
                  {finalists.finalist1.teamName}
                </span>{' '}
                - 2 Wins (Advanced with best record)
              </p>
              <p>
                <span className="font-semibold">
                  {finalists.finalist2.teamName}
                </span>{' '}
                - 1 Win (Highest seed among 1-win teams)
              </p>
            </CardContent>
          </Card>
        )}

      {finalMatch?.id === 999 && (
        <Card>
          <CardHeader className="bg-green-50 py-3">
            <CardTitle className="text-base">
              Semifinal: {finalMatch.team1Name} vs {finalMatch.team2Name}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">{finalMatch.team1Name}</label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="Score"
                    value={tempScore.t1}
                    onChange={(e) =>
                      setTempScore((prev) => ({ ...prev, t1: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">{finalMatch.team2Name}</label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="Score"
                    value={tempScore.t2}
                    onChange={(e) =>
                      setTempScore((prev) => ({ ...prev, t2: e.target.value }))
                    }
                  />
                </div>
              </div>
              <Button
                onClick={() => {
                  if (tempScore.t1 === '' || tempScore.t2 === '') {
                    alert('Please enter both scores');
                    return;
                  }
                  const t1Score = parseInt(tempScore.t1);
                  const t2Score = parseInt(tempScore.t2);
                  const semifinalWinner =
                    t1Score > t2Score
                      ? teams.find((t) => t.id === finalMatch.team1)!
                      : teams.find((t) => t.id === finalMatch.team2)!;

                  // Update semifinal match with results
                  const updatedSemifinal = {
                    ...finalMatch,
                    score: { t1: t1Score, t2: t2Score },
                    winner: semifinalWinner.id,
                    finished: true,
                  };
                  onSemifinalSubmit?.(updatedSemifinal);

                  const topSeed = rankings[0].team;
                  const newFinalMatch = {
                    id: 1000,
                    team1: topSeed.id,
                    team2: semifinalWinner.id,
                    team1Name: topSeed.teamName,
                    team2Name: semifinalWinner.teamName,
                    score: { t1: 0, t2: 0 },
                    winner: null,
                    finished: false,
                  };
                  onFinalSubmit?.(newFinalMatch);
                  setFinalMatch(newFinalMatch);
                  setTempScore({ t1: '', t2: '' });
                }}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Submit Semifinal Score
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {isShowingFinal && finalTeams && (
        <Card>
          <CardHeader className="bg-yellow-50 py-3">
            <CardTitle className="text-base">
              Final: {finalTeams.finalist1.teamName} vs {finalTeams.finalist2.teamName}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    {finalTeams.finalist1.teamName}
                  </label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="Score"
                    value={tempScore.t1}
                    onChange={(e) =>
                      setTempScore((prev) => ({ ...prev, t1: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    {finalTeams.finalist2.teamName}
                  </label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="Score"
                    value={tempScore.t2}
                    onChange={(e) =>
                      setTempScore((prev) => ({ ...prev, t2: e.target.value }))
                    }
                  />
                </div>
              </div>
              <Button
                onClick={() => {
                  if (tempScore.t1 === '' || tempScore.t2 === '') {
                    alert('Please enter both scores');
                    return;
                  }
                  const t1Score = parseInt(tempScore.t1);
                  const t2Score = parseInt(tempScore.t2);
                  const champion =
                    t1Score > t2Score
                      ? finalTeams.finalist1
                      : finalTeams.finalist2;

                  // Update the final match with results
                  if (finalMatch) {
                    const updatedFinalMatch = {
                      ...finalMatch,
                      score: { t1: t1Score, t2: t2Score },
                      winner: champion.id,
                      finished: true,
                    };
                    onFinalSubmit?.(updatedFinalMatch);
                  }

                  onFinalsComplete(champion);
                }}
                className="w-full bg-yellow-600 hover:bg-yellow-700"
              >
                Submit Final Score & Crowning Champion
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
