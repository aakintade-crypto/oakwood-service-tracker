'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Home() {
  const [formData, setFormData] = useState({
    student_name: '',
    student_email: '',
    organization_name: '',
    hours_logged: '',
    service_date: '',
    supervisor_name: '',
    supervisor_email: '',
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    const { data, error } = await supabase
      .from('service_logs')
      .insert([{ ...formData, status: 'pending' }])
      .select()
      .single();

    if (error) {
      setMessage(`Error saving hours: ${error.message}`);
      setSubmitting(false);
      return;
    }

    await fetch('/api/send-approval', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentName: formData.student_name,
        studentEmail: formData.student_email,
        organizationName: formData.organization_name,
        hoursLogged: formData.hours_logged,
        serviceDate: formData.service_date,
        supervisorName: formData.supervisor_name,
        supervisorEmail: formData.supervisor_email,
        description: formData.description,
        verificationToken: data.verification_token,
      }),
    });

    setMessage('Service hours logged! A verification email has been sent to your supervisor.');
    setFormData({
      student_name: '',
      student_email: '',
      organization_name: '',
      hours_logged: '',
      service_date: '',
      supervisor_name: '',
      supervisor_email: '',
      description: '',
    });
    setSubmitting(false);
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    marginBottom: '12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    boxSizing: 'border-box',
  };

  return (
    <main style={{ maxWidth: '540px', margin: '40px auto', padding: '24px', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', fontFamily: 'sans-serif' }}>
      <h1 style={{ marginTop: 0 }}>Oakwood Service Tracker</h1>
      <p style={{ color: '#4b5563' }}>Log your community service hours below:</p>
      <h2>Log Service Hours</h2>
      <form onSubmit={handleSubmit}>
        <input style={inputStyle} name="student_name" placeholder="Student Name *" value={formData.student_name} onChange={handleChange} required />
        <input style={inputStyle} type="email" name="student_email" placeholder="Student Email *" value={formData.student_email} onChange={handleChange} required />
        <input style={inputStyle} name="organization_name" placeholder="Organization Name *" value={formData.organization_name} onChange={handleChange} required />
        <input style={inputStyle} type="number" step="0.5" name="hours_logged" placeholder="Hours Logged *" value={formData.hours_logged} onChange={handleChange} required />
        <input style={inputStyle} type="date" name="service_date" value={formData.service_date} onChange={handleChange} required />
        <input style={inputStyle} name="supervisor_name" placeholder="Supervisor Name *" value={formData.supervisor_name} onChange={handleChange} required />
        <input style={inputStyle} type="email" name="supervisor_email" placeholder="Supervisor Email *" value={formData.supervisor_email} onChange={handleChange} required />
        <textarea style={inputStyle} rows={3} name="description" placeholder="Description of work... *" value={formData.description} onChange={handleChange} required />
        <button
          type="submit"
          disabled={submitting}
          style={{ width: '100%', padding: '12px', backgroundColor: '#111827', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          {submitting ? 'Submitting...' : 'Submit Hours'}
        </button>
      </form>
      {message && <p style={{ marginTop: '16px', fontWeight: 'bold', color: '#16a34a' }}>{message}</p>}
    </main>
  );
}
