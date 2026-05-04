import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Select from 'react-select';
import { db, getCurrentUser } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase'; // Your new Supabase client

// Data Options
const TEAMS = [
  { value: 'Mbabane Swallows', label: 'Mbabane Swallows' },
  { value: 'Mbabane Highlanders', label: 'Mbabane Highlanders' },
  { value: 'Manzini Wanderers', label: 'Manzini Wanderers' },
  { value: 'Moneni Pirates', label: 'Moneni Pirates' },
  { value: 'Green Mamba', label: 'Green Mamba' }
];
const LEAGUES = [
  { value: 'Premier League', label: 'MTN PLE' },
  { value: 'Super League', label: 'Super League' },
  { value: 'Regional League', label: 'Regional League' },
  { value: 'NFD', label: 'Mulasport NFD' }
];
const VENUES = [
  { value: 'hhohho', label: 'Hhohho' },
  { value: 'lubombo', label: 'Lubombo' },
  { value: 'manzini', label: 'Manzini' },
  { value: 'shiselweni', label: 'Shiselweni' }
];
const TOURNAMENTS = [
  { value: 'MTN Premier League', label: 'MTN Premier League' },
  { value: 'Mulasport NFD', label: 'Mulasport NFD' },
  { value: 'Ingwenyama Cup', label: 'SMVA Ingwenyama Cup' }
];

const STADIUMS = [{ value: 'Somhlolo National Stadium', label: 'Somhlolo National Stadium' }, { value: 'Mavuso Sports Centre', label: 'Mavuso Sports Centre' }];

const schema = z.object({
  tournament: z.string().min(1, 'Required'),
  officerName: z.string().min(1, 'Required'),
  date: z.string().min(1, 'Required'),
  homeTeam: z.string().min(1, 'Required'),
  awayTeam: z.string().min(1, 'Required'),
  venue: z.string().min(1, 'Required'),
  league: z.string().min(1, 'Required'),
  stadium: z.string().min(1, 'Required'),
  expectedAttendance: z.number({ invalid_type_error: "Required" }).min(0, 'Required'),
  venueMeeting: z.string().min(1, 'Required'),
  stewardsBriefing: z.string().min(1, 'Required'),
  control_measures: z.string().min(1, 'Required'),
  matchCoordination: z.string().min(1, 'Required'),
  teamTrainings: z.string().min(1, 'Required'),
  vocCommanderCooperation: z.string().min(1, 'Required'),
  stadiumAuthorityCooperation: z.string().min(1, 'Required'),
  pleDelegationCooperation: z.string().min(1, 'Required'),
  overallEvaluation: z.string().min(1, 'Required'),
  issuesDescription: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function MatchDayMinus1Report() {
  const location = useLocation();
  //const match = location.state?.matchData;
  const navigate = useNavigate();
  const { matchData: match, mode } = location.state || {}; // Extract mode
  const isViewOnly = mode === 'view';


  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      officerName: match?.assignedOfficerName || 'Unassigned',
      date: match?.date || new Date().toISOString().split('T')[0],
      homeTeam: match?.homeTeam || '',
      awayTeam: match?.awayTeam || '',
      stadium: match?.stadium || '',
      expectedAttendance: 0,
    },
  });

  // Sync data: if match exists, reset the form with all fields
  useEffect(() => { 
    if (match) reset({ ...match, date: match.date, expectedAttendance: 0 }); 
  }, [match, reset]);

  // Use this pattern for all forms
const onSubmit = async (data: FormData) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return alert("You must be logged in.");

  try {
    const { error: reportError } = await supabase
      .from('m1_reports')
      .upsert({
        id: `M1-${match.id}`,
        match_id: match.id,
        officer_email: user.email,
        tournament: data.tournament,
        officer_name: data.officerName,
        date: data.date,
        home_team: data.homeTeam,
        away_team: data.awayTeam,
        venue: data.venue,
        league: data.league,
        stadium: data.stadium,
        expected_attendance: data.expectedAttendance,
        venue_meeting: data.venueMeeting,
        stewards_briefing: data.stewardsBriefing,
        control_measures: data.control_measures,
        match_coordination: data.matchCoordination,
        team_trainings: data.teamTrainings,
  
        voc_commander_cooperation: data.vocCommanderCooperation,
        stadium_authority_cooperation: data.stadiumAuthorityCooperation,
        ple_delegation_cooperation: data.pleDelegationCooperation,
        overall_evaluation: data.overallEvaluation,
        issues_description: data.issuesDescription
      });

    if (reportError) throw reportError;

    // Update match status
    await supabase.from('matches').update({ status: 'Active' }).eq('id', match.id);

    alert('Successfully saved!');
    navigate('/dashboard');
  } catch (error: any) {
    console.error("Supabase Error:", error);
    alert('Error saving data: ' + error.message);
  }
};

  return (
    <div className="w-screen min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* Main Match Day -1 Report Card */}
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden">
        <div className="bg-blue-900 py-8 px-10 text-white text-center rounded-t-2xl">
          <h1 className="text-3xl font-bold">MATCH DAY -1 REPORT</h1>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-8 md:p-12 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <Input 
              label="Tournament" 
              {...register('tournament')} 
              disabled={isViewOnly} // <--- Locks field if mode is 'view'
              error={errors.tournament} 
            />
            <Input label="Officer Name" {...register('officerName')} error={errors.officerName} />
            <Input label="Date" type="date" {...register('date')} error={errors.date} />
            <SearchableDropdown label="League" name="league" control={control} options={LEAGUES} error={errors.league} />
            <SearchableDropdown label="Home Team" name="homeTeam" control={control} options={TEAMS} error={errors.homeTeam} />
            <SearchableDropdown label="Away Team" name="awayTeam" control={control} options={TEAMS} error={errors.awayTeam} />
            <SearchableDropdown label="Venue" name="venue" control={control} options={VENUES} error={errors.venue} />
            <SearchableDropdown label="Stadium" name="stadium" control={control} options={STADIUMS} error={errors.stadium} />
          </div>
          <Input label="Expected Stadium Attendance" type="number" {...register('expectedAttendance', { valueAsNumber: true })} error={errors.expectedAttendance} />
          <div className="space-y-6 mt-8">
            {[
              { label: 'How was the venue Safety and Security meeting? Explain briefly.', field: 'venueMeeting' },
              { label: 'How was the briefing of the stewards’ supervisors? Explain briefly.', field: 'stewardsBriefing' },
              { label: 'What are the control measures? Explain briefly.', field: 'control_measures' },
              { label: 'How was the match coordination meeting? Explain briefly.', field: 'matchCoordination' },
              { label: 'How was the cooperation and team work with organizing committee? Explain briefly.', field: 'teamTrainings' },
              { label: 'How was the cooperation and team work with the Venue Operations Centre Commander? Explain briefly.', field: 'vocCommanderCooperation' },
              { label: 'How was the cooperation and teamwork with the stadium authority? Explain briefly.', field: 'stadiumAuthorityCooperation' },
              { label: 'How was the cooperation and teamwork with the PLE Office? Explain briefly.', field: 'pleDelegationCooperation' },
              { label: 'What is your overall evaluation? Explain briefly.', field: 'overallEvaluation' },
            ].map((item) => (
              <TextArea 
                key={item.field}
                label={item.label} 
                {...register(item.field as any)} 
                error={errors[item.field as keyof FormData]} 
              />
            ))}
            
            <TextArea 
              label="Issues & Resolutions" 
              {...register('issuesDescription')} 
              error={errors.issuesDescription} 
              rows={4} 
            />
          </div>
          {!isViewOnly && (
          <div className="flex gap-4 justify-end pt-6">           
            <button type="button" className="px-8 py-3 !bg-gray-600 text-white rounded-xl hover:!bg-gray-700">Save Draft</button>
            <button type="submit" disabled={isSubmitting} className="px-10 py-3 !bg-green-600 text-white rounded-xl hover:!bg-green-700">{isSubmitting ? 'Submitting...' : 'Submit Report'}</button>
          </div>
          )}

        </form>
      </div>
    </div>
  );
}
// Helpers
function SearchableDropdown({ label, name, control, options, error }: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <Controller name={name} control={control} render={({ field }) => (
        <Select {...field} options={options} menuPortalTarget={document.body} 
          onChange={(v: any) => field.onChange(v.value)} 
          value={options.find((o: any) => o.value === field.value)} 
          styles={{ 
            control: (base) => ({ ...base, borderColor: error ? '#dc2626' : '#d1d5db' }),
            option: (base) => ({ ...base, color: 'black' }), singleValue: (base) => ({ ...base, color: 'black' }) 
          }} 
        />
      )} />
      {error && <p className="text-red-600 text-xs mt-1">{error.message}</p>}
    </div>
  );
}
// Fixed Components with Red Error borders

function TextArea({ label, error, ...props }: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <textarea 
        {...props} 
        rows={3} 
        className={`w-full px-4 py-3 border rounded-lg text-black focus:ring-2 outline-none transition duration-200 
        ${error ? 'border-red-600 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`} 
      />
      {error && <p className="text-red-600 text-xs mt-1">{error.message}</p>}
    </div>
  );
}

function Input({ label, error, ...props }: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input {...props} className={`w-full px-4 py-3 border rounded-lg text-black ${error ? 'border-red-600' : 'border-gray-300'}`} />
      {error && <p className="text-red-600 text-xs mt-1">{error.message}</p>}
    </div>
  );
}