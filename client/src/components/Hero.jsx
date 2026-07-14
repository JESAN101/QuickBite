const scrollToSection = (id) => {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#2A1F1A] to-[#1D1512]">
      {/* subtle warm glow, kept low-key so it doesn't fight the content */}
      <div className="pointer-events-none absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-[#F0A438]/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 py-20 md:py-28 lg:grid-cols-2">
        {/* ---------- LEFT: copy ---------- */}
        <div className="text-center lg:text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#F0A438]/30 bg-[#F0A438]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-[#F0A438]">
            QuickBite · Kathmandu
          </span>

          <h1 className="mt-6 font-['Plus_Jakarta_Sans',sans-serif] text-5xl font-bold leading-[1.1] text-[#F7ECD9] md:text-6xl">
            Real food,
            <br />
            made by{" "}
            <span className="font-['Fraunces',serif] italic font-normal text-[#F0A438]">
              real
            </span>{" "}
            kitchens.
          </h1>

          <p className="mx-auto mt-6 max-w-md text-lg text-[#C9B8A3] lg:mx-0">
            From your favorite momo joint to the newak restaurant everyone's
            talking about — ordered in seconds, delivered hot.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
            <button
              onClick={() => scrollToSection("foods-section")}
              className="rounded-xl bg-[#D64933] px-8 py-3.5 font-semibold text-[#F7ECD9] shadow-lg shadow-[#D64933]/20 transition hover:bg-[#c03e2a] hover:shadow-xl hover:shadow-[#D64933]/30"
            >
              Order Now
            </button>
            <button
              onClick={() => scrollToSection("restaurants-section")}
              className="rounded-xl border border-[#C9B8A3]/25 px-8 py-3.5 font-semibold text-[#F7ECD9] transition hover:bg-white/5"
            >
              Browse Restaurants
            </button>
          </div>

          {/* trust row — quiet, small caps, no icons overload */}
          <div className="mt-12 flex items-center justify-center gap-8 lg:justify-start">
            <div>
              <p className="font-['Fraunces',serif] text-2xl text-[#F7ECD9]">200+</p>
              <p className="text-xs uppercase tracking-wide text-[#C9B8A3]/70">Restaurants</p>
            </div>
            <div className="h-8 w-px bg-[#C9B8A3]/20" />
            <div>
              <p className="font-['Fraunces',serif] text-2xl text-[#F7ECD9]">25–30 min</p>
              <p className="text-xs uppercase tracking-wide text-[#C9B8A3]/70">Avg. delivery</p>
            </div>
            <div className="h-8 w-px bg-[#C9B8A3]/20" />
            <div>
              <p className="font-['Fraunces',serif] text-2xl text-[#F7ECD9]">4.7★</p>
              <p className="text-xs uppercase tracking-wide text-[#C9B8A3]/70">Avg. rating</p>
            </div>
          </div>
        </div>

        {/* ---------- RIGHT: photo stack + signature badge ---------- */}
        <div className="relative mx-auto hidden h-[420px] w-full max-w-md lg:block">
          <img
            src="https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&q=80"
            alt="Momo plate"
            className="absolute left-0 top-6 h-72 w-56 rotate-[-6deg] rounded-2xl object-cover shadow-2xl ring-4 ring-[#1D1512]"
          />
          <img
            src="https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&q=80"
            alt="Curry bowl"
            className="absolute right-0 top-0 h-72 w-56 rotate-[7deg] rounded-2xl object-cover shadow-2xl ring-4 ring-[#1D1512]"
          />

          {/* signature: rotating stamp badge */}
          <div className="absolute bottom-2 left-1/2 flex h-28 w-28 -translate-x-1/2 items-center justify-center">
            <svg viewBox="0 0 100 100" className="absolute h-28 w-28 animate-[spin_14s_linear_infinite] text-[#F7ECD9]/80">
              <defs>
                <path id="stampCircle" d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
              </defs>
              <text fontSize="9" letterSpacing="3" fill="currentColor">
                <textPath href="#stampCircle">FRESH • HOT • FAST •</textPath>
              </text>
            </svg>
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F0A438] text-lg font-bold text-[#1D1512] shadow-lg">
              QB
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;