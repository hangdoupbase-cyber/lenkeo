const S = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export function HeroArt({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 420 360" className={className} aria-hidden {...S}>
      {/* bàn */}
      <path d="M20 318h380" />
      <path d="M60 318v32M360 318v32" />
      {/* ly cà phê phin */}
      <path d="M92 214h96l-9 84a14 14 0 0 1-14 12h-50a14 14 0 0 1-14-12z" />
      <path d="M188 232h14a18 18 0 0 1 0 36h-18" />
      <path d="M84 214h112" />
      <path d="M118 188c-8-14 8-18 0-34M142 188c-8-14 8-18 0-34M166 188c-8-14 8-18 0-34" opacity=".7" />
      <path d="M104 246c16 8 56 8 72 0" opacity=".5" />
      {/* tô phở */}
      <path d="M232 262h150a75 52 0 0 1-150 0z" />
      <path d="M222 262h170" />
      <path d="M262 262c10-14 26-14 36 0M310 262c10-14 26-14 36 0" opacity=".6" />
      <path d="M300 232l70-52M312 238l70-52" />
      <path d="M268 232c-6-12 6-14 0-26M292 228c-6-12 6-14 0-26" opacity=".6" />
      {/* lá cây */}
      <path d="M34 318c-4-40 6-78 30-104" />
      <path d="M44 280c-22-4-30-20-30-34 20 0 32 12 30 34zM52 248c18-6 26-20 24-36-18 4-28 18-24 36zM40 300c18-2 28-14 28-26-16-2-28 8-28 26z" />
      {/* sao lấp lánh */}
      <path d="M330 60v22M319 71h22M60 80v14M53 87h14M250 110v10M245 115h10" opacity=".6" />
      {/* dây đèn */}
      <path d="M10 28c70 40 140 40 210 4s130-40 190 0" opacity=".5" />
      <circle cx="80" cy="52" r="5" /><circle cx="150" cy="60" r="5" /><circle cx="230" cy="40" r="5" /><circle cx="310" cy="32" r="5" /><circle cx="370" cy="44" r="5" />
    </svg>
  );
}

export function Squiggle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 12" className={className} aria-hidden preserveAspectRatio="none" {...S}>
      <path d="M2 6c12-8 24 8 36 0s24 8 36 0 24 8 36 0 24 8 36 0 24 8 36 0 24 8 36 0 24 8 36 0 24 8 36 0" />
    </svg>
  );
}
