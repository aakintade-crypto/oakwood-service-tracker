"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function VerifyPage({ params }) {
  const [status, setStatus] = useState(null);

  const handleAction = async (actionStatus) => {
    const { error } = await supabase
      .from("service_logs")
      .update({ status: actionStatus })
      .eq("verification_token", params.token);

    if (error) {
      alert("Error updating status: " + error.message);
    } else {
      setStatus(actionStatus);
    }
  };

  if (status) {
    return (
      <div style={{ padding: '40px', fontFamily: 'sans-serif', textAlign: 'center' }}>
        <h1>Thank You!</h1>
        <p>The service hours request has been marked as <strong>{status}</strong>.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', textAlign: 'center', maxWidth: '500px', margin: '0 auto' }}>
      <h1>Service Hour Verification</h1>
      <p>Please review and verify if the student completed the logged service hours.</p>
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '20px' }}>
        <button 
          onClick={() => handleAction("approved")}
          style={{ padding: '10px 20px', backgroundColor: 'green', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          Approve Hours
        </button>
        <button 
          onClick={() => handleAction("rejected")}
          style={{ padding: '10px 20px', backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          Reject Hours
        </button>
      </div>
    </div>
  );
}
