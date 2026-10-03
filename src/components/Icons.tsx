export function Arrow({ diagonal = false, className = '' }: { diagonal?: boolean; className?: string }) {
  return <svg className={`arrow-icon ${className}`} width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={diagonal ? 'M5 19 19 5M5 5h14v14' : 'M4 12h15m-6-6 6 6-6 6'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export function Spark({ className = '' }: { className?: string }) {
  return <svg className={className} width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="M24 2v44M2 24h44M8.4 8.4l31.2 31.2M8.4 39.6 39.6 8.4" stroke="currentColor" strokeWidth="4" /></svg>;
}

export function BenefitIcon({ name }: { name: 'spark' | 'loop' | 'sun' | 'heart' }) {
  if (name === 'spark') return <Spark />;
  return <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    {name === 'loop' ? <><rect x="7" y="12" width="21" height="27" rx="10.5" transform="rotate(-25 7 12)" /><rect x="22" y="6" width="21" height="27" rx="10.5" transform="rotate(25 22 6)" /></> : name === 'sun' ? <><circle cx="24" cy="24" r="10" /><path d="M24 1v7m0 32v7M1 24h7m32 0h7M8 8l5 5m22 22 5 5M8 40l5-5m22-22 5-5" /></> : <path d="M24 40 7.5 24C-5 11 13-1 24 13 35-1 53 11 40.5 24Z" />}
  </svg>;
}
