import LogHoursModal from "../components/log-hours-modal";

export default function Home() {
  return (
    <main style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Oakwood Service Tracker</h1>
      <p>Log your community service hours below:</p>
      <LogHoursModal />
    </main>
  );
}
