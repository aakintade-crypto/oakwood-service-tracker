'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function VerifyContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const action = searchParams.get('action');

  const [state, setState] = useState('loading');
  const [logDetails, setLogDetails] = useState(null);

  useEffect(() => {
    async function verifyHours() {
      if (!token || !['approve', 'unapprove'].includes(action)) {
        setState('invalid');
        return;
      }

      const newStatus = action === 'approve' ? 'approved' : 'unapproved';

      const { data, error } = await supabase
        .from('service_logs')
        .update({
          status: newStatus,
          verified_at: new Date().toISOString(),
        })
        .eq('verification_token', token)
        .select()
        .single();

      if (error || !data) {
        setState('error');
        return;
      }

      setLogDetails(data);
      setState(newStatus);
    }

    verifyHours();
  }, [token, action]);

  return (
    <div style={{ maxWidth: '500px', margin: '60px auto', padding: '32px', backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      {state === 'loading' && <p>Updating verification status...</p>}
      {state === 'invalid' && <h2 style={{ color: '#dc2626' }}>Invalid Verification Link</h2>}
      {state === 'error' && <h2 style={{ color: '#dc2626' }}>Could not find or update this service log.</h2>}
      {state === 'approved' && (
        <>
          <h2 style={{ color: '#16a34a' }}>Hours Approved</h2>
          <p>You have approved <strong>{logDetails?.hours_logged} hours</strong> for <strong>{logDetails?.student_name}</strong> at {logDetails?.organization_name}.</p>
        </>
      )}
      {state === 'unapproved' && (
        <>
          <h2 style={{ color: '#dc2626' }}>Hours Unapproved</h2>
          <p>You have marked the submission from <strong>{logDetails?.student_name}</strong> as unapproved.</p>
        </>
      )}
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<p style={{ textAlign: 'center', marginTop: '60px' }}>Loading...</p>}>
      <VerifyContent />
    </Suspense>
  );
}
