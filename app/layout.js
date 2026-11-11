export const metadata = {
  title: 'Oakwood Service Tracker',
  description: 'Log and manage community service hours',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'sans-serif' }}>
        {children}
      </body>
    </html>
  )
}
