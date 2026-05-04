import React from 'react';

export const PrintArea = React.forwardRef<HTMLDivElement, any>(({ match }, ref) => {
  return (
    <div ref={ref} className="hidden print:block p-8 bg-white text-black">
      <h1 className="text-2xl font-bold mb-4">Official Match Report: {match.homeTeam} vs {match.awayTeam}</h1>
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(match).map(([k, v]: any) => (
          <div key={k} className="border-b pb-2">
            <p className="font-bold text-gray-500 capitalize">{k}</p>
            <p>{String(v)}</p>
          </div>
        ))}
      </div>
    </div>
  );
});