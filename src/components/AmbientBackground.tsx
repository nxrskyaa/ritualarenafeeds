export default function AmbientBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Base gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #0A0A0F 0%, #0A1A0F 40%, #0A0F0A 70%, #0A0A0F 100%)',
        }}
      />

      {/* Ambient light at top - neon green */}
      <div
        className="absolute top-0 left-0 right-0 h-[60vh]"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(57,255,20,0.15) 0%, transparent 60%)',
        }}
      />

      {/* Bottom ambient - subtle green */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[40vh]"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at 50% 100%, rgba(34,197,94,0.06) 0%, transparent 60%)',
        }}
      />

      {/* Floating orb 1 - neon green */}
      <div
        className="absolute w-[400px] h-[400px] rounded-full animate-orb-float-1"
        style={{
          top: '10%',
          left: '60%',
          background: 'radial-gradient(circle, rgba(57,255,20,0.2) 0%, transparent 70%)',
          filter: 'blur(100px)',
        }}
      />

      {/* Floating orb 2 - emerald green */}
      <div
        className="absolute w-[350px] h-[350px] rounded-full animate-orb-float-2"
        style={{
          top: '50%',
          left: '10%',
          background: 'radial-gradient(circle, rgba(34,197,94,0.18) 0%, transparent 70%)',
          filter: 'blur(100px)',
        }}
      />

      {/* Floating orb 3 - light green */}
      <div
        className="absolute w-[300px] h-[300px] rounded-full animate-orb-float-3"
        style={{
          top: '70%',
          right: '15%',
          background: 'radial-gradient(circle, rgba(134,239,172,0.12) 0%, transparent 70%)',
          filter: 'blur(100px)',
        }}
      />

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '256px 256px',
        }}
      />
    </div>
  )
}
