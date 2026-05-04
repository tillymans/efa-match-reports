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
  { value: 'Premier League', label: 'PLE' },
  { value: 'Super League', label: 'Super League' },
  { value: 'Regional League', label: 'Regional League' },
  { value: 'NFD', label: 'NFD' }
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
  homeScore: z.number({ invalid_type_error: "Required" }).min(0, 'Required'),
  awayScore: z.number({ invalid_type_error: "Required" }).min(0, 'Required'),
  league: z.string().min(1, 'Required'),
  venue: z.string().min(1, 'Required'),
  stadium: z.string().min(1, 'Required'),
  attendance: z.number({ invalid_type_error: "Required" }).min(0, 'Required'),
  accessControl: z.string().min(1, 'Required'),
  staircases: z.string().min(1, 'Required'),
  supporterBehavior: z.string().min(1, 'Required'),
  officialBehavior: z.string().min(1, 'Required'),
  vocInteraction: z.string().min(1, 'Required'),
  stadiumCleanliness: z.string().min(1, 'Required'),
  securityDebrief: z.string().min(1, 'Required'),
  locCooperation: z.string().min(1, 'Required'),
  stadiumAuthority: z.string().min(1, 'Required'),
  pleDelegation: z.string().min(1, 'Required'),
  overallEvaluation: z.string().min(1, 'Required'),
  issuesDescription: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function MatchDayReport() {
  const location = useLocation();
  const navigate = useNavigate();
  //const match = location.state?.matchData;
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
      venue: match?.venue || '',
      tournament: match?.tournament || '',
      league: match?.league || '',
      homeScore: 0,
      awayScore: 0,
      attendance: 0
    }
  });

  const onSubmit = async (data: any) => {
    // 1. Get user from Supabase Auth
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return alert("You must be logged in.");
    if (!match?.id) return alert("Match ID missing!");

    try {
      // 2. Save to 'matchday_reports' table
      const { error: reportError } = await supabase
        .from('matchday_reports')
        .upsert({
          id: `MD-${match.id}`,
          match_id: match.id,
          officer_email: user.email,
          tournament: data.tournament,
          officer_name: data.officerName,
          date: data.date,
          home_team: data.homeTeam,
          away_team: data.awayTeam,
          home_score: data.homeScore,
          away_score: data.awayScore,
          league: data.league,
          venue: data.venue,
          stadium: data.stadium,
          attendance: data.attendance,
          access_control: data.accessControl,
          staircases: data.staircases,
          supporter_behavior: data.supporterBehavior,
          official_behavior: data.officialBehavior,
          voc_interaction: data.vocInteraction,
          stadium_cleanliness: data.stadiumCleanliness,
          security_debrief: data.securityDebrief,
          loc_cooperation: data.locCooperation,
          stadium_authority: data.stadiumAuthority,
          ple_delegation: data.pleDelegation,
          overall_evaluation: data.overallEvaluation,
          issues_description: data.issuesDescription,
          submitted_at: new Date().toISOString()
        });

      if (reportError) throw reportError;

      // 3. Update Match Status
      const { error: updateError } = await supabase
        .from('matches')
        .update({ status: 'Completed' })
        .eq('id', match.id);

      if (updateError) throw updateError;

      alert('Successfully saved Match Day Report!');
      navigate('/dashboard');
    } catch (error: any) {
      console.error(error);
      alert('Error saving data: ' + error.message);
    }
  };

  return (
    <div className="w-screen min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* Main Match Day -1 Report Card */}
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden">
        <div className="bg-blue-900 py-8 px-10 text-white text-center rounded-t-2xl">
          <h1 className="text-3xl font-bold">MATCH DAY REPORT</h1>
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
            <Input label="Home Score" type="number" {...register('homeScore', { valueAsNumber: true })} error={errors.homeScore} />
            <Input label="Away Score" type="number" {...register('awayScore', { valueAsNumber: true })} error={errors.awayScore} />
            <SearchableDropdown label="Venue" name="venue" control={control} options={VENUES} error={errors.venue} />
            <SearchableDropdown label="Stadium" name="stadium" control={control} options={STADIUMS} error={errors.stadium} />
            <Input label="Actual Stadium Attendance" type="number" {...register('attendance', { valueAsNumber: true })} error={errors.attendance} />
          </div>
          <div className="space-y-6 mt-8">
            {[
              { label: 'How was the access control operation during the match day? Explain briefly.', field: 'accessControl' },
              { label: 'Were staircases and gangways clear of spectators? Explain briefly.', field: 'staircases' },
              { label: 'How was the general behavior of the supporters? Explain briefly.', field: 'supporterBehavior' },
              { label: 'How was the behaviour of team officials? Explain briefly.', field: 'officialBehavior' },
              { label: 'How was the interaction with the venue operation centre (VOC)? Explain briefly.', field: 'vocInteraction' },
              { label: 'Were the stadium surroundings clean? Explain briefly.', field: 'stadiumCleanliness' },
              { label: 'How was the general security debriefing? Explain briefly.', field: 'securityDebrief' },
              { label: 'How was the cooperation and teamwork with the organizing committee? Explain briefly.', field: 'locCooperation' },
              { label: 'How was the cooperation and teamwork with the stadium authority? Explain briefly.', field: 'stadiumAuthority' },
              { label: 'How was the cooperation and teamwork with the PLE office? Explain briefly.', field: 'pleDelegation' },
              { label: 'What is your overall evaluation? Explain briefly.', field: 'overallEvaluation' },
              { label: 'If the were any issues/concerns, please provide a description and evaluation of the resolution for each of the issues.', field: 'issuesDescription' },
            ].map((item) => (
              <TextArea 
                key={item.field}
                label={item.label} 
                {...register(item.field as any)} 
                error={errors[item.field as keyof FormData]} 
              />
            ))}
            
          </div>
          <div className="flex gap-4 justify-end pt-6">
           
            <button type="button" className="px-8 py-3 !bg-gray-600 text-white rounded-xl hover:!bg-gray-700">Save Draft</button>
            <button type="submit" disabled={isSubmitting} className="px-10 py-3 !bg-green-600 text-white rounded-xl hover:!bg-green-700">{isSubmitting ? 'Submitting...' : 'Submit Report'}</button>
          </div>

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