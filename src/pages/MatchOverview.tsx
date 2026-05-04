import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, ClipboardList, ShieldAlert, FileText, ChevronRight } from 'lucide-react';

export default function MatchOverview() {
  const navigate = useNavigate();
  const location = useLocation();
  const match = location.state?.matchData;

  if (!match) {
    navigate('/dashboard');
    return null;
  }

  const startReport = (path: string) => {
    navigate(path, { state: { matchData: match } });
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate('/dashboard')} className="flex items-center text-gray-500 hover:text-blue-900 mb-6 font-medium">
          <ArrowLeft size={20} className="mr-2" /> Back to Dashboard
        </button>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 mb-8">
          <h1 className="text-3xl font-bold text-blue-900">{match.homeTeam} vs {match.awayTeam}</h1>
          <p className="text-gray-500 mt-2">{match.date} • {match.stadium}</p>
        </div>

        <div className="space-y-4">
          <WorkflowStep 
            title="Pre-Match Assessment (M-1)" 
            desc="Complete security requirements"
            icon={<ClipboardList className="text-blue-600" />} 
            onClick={() => startReport('/match-day-minus1')} 
          />
          <WorkflowStep 
            title="Match Day Report" 
            desc="Operational security reporting"
            icon={<FileText className="text-indigo-600" />} 
            onClick={() => startReport('/match-day')} 
          />
          <WorkflowStep 
            title="Incident Report" 
            desc="File any security breaches"
            icon={<ShieldAlert className="text-red-600" />} 
            onClick={() => startReport('/incident-report')} 
          />
        </div>
      </div>
    </div>
  );
}

function WorkflowStep({ title, desc, icon, onClick }: any) {
  return (
    <button onClick={onClick} className="w-full flex items-center justify-between p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:border-blue-500 transition-all">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-gray-50 rounded-lg">{icon}</div>
        <div className="text-left">
          <h3 className="font-bold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500">{desc}</p>
        </div>
      </div>
      <ChevronRight className="text-gray-300" />
    </button>
  );
}