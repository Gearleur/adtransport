import Link from 'next/link'

interface BtnProps {
  children: React.ReactNode
  href?: string
  onClick?: () => void
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  size?: 'sm' | 'md' | 'lg'
  type?: 'button' | 'submit' | 'reset'
}

const sizes = {
  sm: { height: 44, fontSize: 13, padding: '0 20px' },
  md: { height: 54, fontSize: 15, padding: '0 28px' },
  lg: { height: 60, fontSize: 16, padding: '0 36px' },
}

export function BtnPrimary({
  children, href, onClick, disabled, loading, fullWidth, size = 'md', type = 'button',
}: BtnProps) {
  const s = sizes[size]
  const style: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: s.height,
    width: fullWidth ? '100%' : 'auto',
    padding: s.padding,
    borderRadius: 9999,
    background: (disabled || loading) ? 'rgba(255,255,255,0.15)' : '#ffffff',
    color: (disabled || loading) ? 'rgba(0,0,0,0.35)' : '#07090f',
    fontSize: s.fontSize,
    fontWeight: 600,
    fontFamily: "'DM Sans', system-ui, sans-serif",
    letterSpacing: '-0.01em',
    textDecoration: 'none',
    border: 'none',
    cursor: (disabled || loading) ? 'not-allowed' : 'pointer',
    transition: 'all 150ms ease',
    pointerEvents: (disabled || loading) ? 'none' : 'auto',
  }

  /* Disabled → jamais de Link, toujours un <button> */
  if (disabled || loading) {
    return (
      <button disabled={disabled} style={style}>
        {loading ? (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
            style={{ animation: 'spin 0.8s linear infinite' }}>
            <style>{'@keyframes spin { to { transform: rotate(360deg); } }'}</style>
            <circle cx="8" cy="8" r="6" stroke="rgba(0,0,0,0.25)" strokeWidth="2"/>
            <path d="M8 2A6 6 0 0 1 14 8" stroke="rgba(0,0,0,0.6)" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        ) : children}
      </button>
    )
  }

  if (href) return <Link href={href} style={style}>{children}</Link>
  return <button type={type} onClick={onClick} style={style}>{children}</button>
}

export function BtnSecondary({
  children, href, onClick, disabled, loading, fullWidth, size = 'md', type = 'button',
}: BtnProps) {
  const s = sizes[size]
  const isDisabled = disabled || loading
  const style: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: s.height,
    width: fullWidth ? '100%' : 'auto',
    padding: s.padding,
    borderRadius: 9999,
    background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(255,255,255,0.11)',
    color: '#ffffff',
    fontSize: s.fontSize,
    fontWeight: 500,
    fontFamily: "'DM Sans', system-ui, sans-serif",
    textDecoration: 'none',
    cursor: (disabled || loading) ? 'not-allowed' : 'pointer',
    transition: 'all 150ms ease',
    opacity: disabled ? 0.4 : 1,
  }

  if (disabled) return <button disabled style={style}>{children}</button>
  if (href) return <Link href={href} style={style}>{children}</Link>
  return <button type={type} onClick={onClick} style={style}>{children}</button>
}

export function BtnGhost({
  children, href, onClick, disabled, loading, fullWidth, size = 'md', type = 'button',
}: BtnProps) {
  const s = sizes[size]
  const style: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: s.height,
    width: fullWidth ? '100%' : 'auto',
    padding: s.padding,
    borderRadius: 9999,
    background: 'transparent',
    border: 'none',
    color: 'rgba(255,255,255,0.55)',
    fontSize: s.fontSize,
    fontWeight: 500,
    fontFamily: "'DM Sans', system-ui, sans-serif",
    textDecoration: 'none',
    cursor: (disabled || loading) ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.4 : 1,
  }

  if (disabled) return <button disabled style={style}>{children}</button>
  if (href) return <Link href={href} style={style}>{children}</Link>
  return <button type={type} onClick={onClick} style={style}>{children}</button>
}