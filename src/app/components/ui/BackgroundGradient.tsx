// Consistent background gradient for all screens
export function BackgroundGradient() {
  return (
    <>
      {/* Base gradient: subtle but noticeable */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950 to-black z-0" />
      
      {/* Top radial accent: very subtle blue glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-950/10 via-transparent to-transparent z-0" />
    </>
  );
}
