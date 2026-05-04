import { useState } from 'react';
import { db, getCurrentUser } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export const useReportSubmission = (collectionName: string) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const submitReport = async (data: any, matchId: string, nextStatus: string) => {
    setIsSubmitting(true);
    try {
      const user = await getCurrentUser();
      if (!user) return alert('You must be logged in.');

      const reportId = `${collectionName}-${matchId}`;
      const { error: reportError } = await db
        .from(collectionName)
        .upsert({ id: reportId, ...data, submittedAt: new Date().toISOString(), officerEmail: user.email }, { onConflict: 'id' });
      if (reportError) throw reportError;

      const { error: matchError } = await db
        .from('matches')
        .update({ status: nextStatus })
        .eq('id', matchId);
      if (matchError) throw matchError;

      alert('Report Submitted Successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      console.error(error);
      alert('Error saving: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitReport, isSubmitting };
};