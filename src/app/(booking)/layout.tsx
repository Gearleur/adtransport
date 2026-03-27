export default function BookingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div style={{ background: '#07090f', minHeight: '100dvh' }}>
      {children}
    </div>
  )
}