"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function LogHoursModal() {
  const [formData, setFormData] = useState({
    studentName: "",
    studentEmail: "",
    organizationName: "",
    hoursLogged: "",
    serviceDate: "",
    supervisorName: "",
    supervisorEmail: "",
    description: "",
  });
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.studentEmail.endsWith("@theoakwoodschool.org")) {
      setMessage("Please use your @theoakwoodschool.org email address.");
      return;
    }

    const { error } = await supabase.from("service_logs").insert([
      {
        student_name: formData.studentName,
        student_email: formData.studentEmail,
        organization_name: formData.organizationName,
        hours_logged: parseFloat(formData.hoursLogged),
        service_date: formData.serviceDate,
        supervisor_name: formData.supervisorName,
        supervisor_email: formData.supervisorEmail,
        description: formData.description,
      },
    ]);

    if (error) {
      setMessage(`Error submitting hours: ${error.message}`);
    } else {
      setMessage("Hours submitted successfully! Verification link generated.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '20px', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <h2>Log Service Hours</h2>
      {message && <p style={{ color: 'blue' }}>{message}</p>}
      <input type="text" placeholder="Full Name" required onChange={(e) => setFormData({ ...formData, studentName: e.target.value })} />
      <input type="email" placeholder="Student Email (@theoakwoodschool.org)" required onChange={(e) => setFormData({ ...formData, studentEmail: e.target.value })} />
      <input type="text" placeholder="Organization Name" required onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })} />
      <input type="number" step="0.5" placeholder="Hours Logged" required onChange={(e) => setFormData({ ...formData, hoursLogged: e.target.value })} />
      <input type="date" required onChange={(e) => setFormData({ ...formData, serviceDate: e.target.value })} />
      <input type="text" placeholder="Supervisor Name" required onChange={(e) => setFormData({ ...formData, supervisorName: e.target.value })} />
      <input type="email" placeholder="Supervisor Email" required onChange={(e) => setFormData({ ...formData, supervisorEmail: e.target.value })} />
      <textarea placeholder="Description of work..." required onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
      <button type="submit">Submit Hours</button>
    </form>
  );
}
