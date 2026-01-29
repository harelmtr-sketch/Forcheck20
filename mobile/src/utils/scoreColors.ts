// Helper function to get color classes based on score
// Uses green-to-red gradient for performance feedback
export function getScoreColor(score: number): string {
  if (score >= 90) return 'text-green-400';
  if (score >= 80) return 'text-green-500';
  if (score >= 70) return 'text-yellow-400';
  if (score >= 60) return 'text-orange-400';
  if (score >= 50) return 'text-orange-500';
  return 'text-red-400';
}

export function getScoreGlow(score: number): string {
  if (score >= 90) return 'drop-shadow-[0_0_24px_rgba(74,222,128,0.7)]';
  if (score >= 80) return 'drop-shadow-[0_0_24px_rgba(34,197,94,0.7)]';
  if (score >= 70) return 'drop-shadow-[0_0_24px_rgba(250,204,21,0.7)]';
  if (score >= 60) return 'drop-shadow-[0_0_24px_rgba(251,146,60,0.7)]';
  if (score >= 50) return 'drop-shadow-[0_0_24px_rgba(249,115,22,0.7)]';
  return 'drop-shadow-[0_0_24px_rgba(248,113,113,0.7)]';
}

export function getScoreBgColor(score: number): string {
  if (score >= 90) return 'bg-green-500/20';
  if (score >= 80) return 'bg-green-500/20';
  if (score >= 70) return 'bg-yellow-500/20';
  if (score >= 60) return 'bg-orange-500/20';
  if (score >= 50) return 'bg-orange-500/20';
  return 'bg-red-500/20';
}

export function getScoreBorderColor(score: number): string {
  if (score >= 90) return 'border-green-500/40';
  if (score >= 80) return 'border-green-500/40';
  if (score >= 70) return 'border-yellow-500/40';
  if (score >= 60) return 'border-orange-500/40';
  if (score >= 50) return 'border-orange-500/40';
  return 'border-red-500/40';
}

export function getScoreShadowColor(score: number): string {
  if (score >= 90) return 'shadow-green-500/20';
  if (score >= 80) return 'shadow-green-500/20';
  if (score >= 70) return 'shadow-yellow-500/20';
  if (score >= 60) return 'shadow-orange-500/20';
  if (score >= 50) return 'shadow-orange-500/20';
  return 'shadow-red-500/20';
}
