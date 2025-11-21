'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface FormatSelectionScreenProps {
  onSelectFormat: (format: 'bestOf3' | 'bestOf5') => void;
  onBack: () => void;
}

export default function FormatSelectionScreen({
  onSelectFormat,
  onBack,
}: FormatSelectionScreenProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-green-700">Select Match Format</h1>
          <p className="text-sm text-gray-600 mt-1">
            Choose the format for your 2-team tournament
          </p>
        </div>
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Best of 3 */}
        <Card
          onClick={() => onSelectFormat('bestOf3')}
          className="cursor-pointer border-2 border-green-200 hover:border-green-600 hover:shadow-lg transition-all"
        >
          <CardHeader className="bg-green-50">
            <CardTitle className="text-2xl">Best of 3</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div>
              <p className="font-semibold text-lg text-green-700 mb-2">Match Details:</p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• First team to win <span className="font-bold">2 games</span> wins</li>
                <li>• Maximum of 3 games played</li>
                <li>• Standard pickleball scoring (first to 11, win by 2)</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-lg text-green-700 mb-2">Possible Outcomes:</p>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• 2-0: Winner takes series</li>
                <li>• 2-1: Winner claims victory</li>
              </ul>
            </div>
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold h-12">
              Select Best of 3
            </Button>
          </CardContent>
        </Card>

        {/* Best of 5 */}
        <Card
          onClick={() => onSelectFormat('bestOf5')}
          className="cursor-pointer border-2 border-blue-200 hover:border-blue-600 hover:shadow-lg transition-all"
        >
          <CardHeader className="bg-blue-50">
            <CardTitle className="text-2xl">Best of 5</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div>
              <p className="font-semibold text-lg text-blue-700 mb-2">Match Details:</p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• First team to win <span className="font-bold">3 games</span> wins</li>
                <li>• Maximum of 5 games played</li>
                <li>• Standard pickleball scoring (first to 11, win by 2)</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-lg text-blue-700 mb-2">Possible Outcomes:</p>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• 3-0: Winner dominates</li>
                <li>• 3-1: Winner claims victory</li>
                <li>• 3-2: Winner prevails</li>
              </ul>
            </div>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold h-12">
              Select Best of 5
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
