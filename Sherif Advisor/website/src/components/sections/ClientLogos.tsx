export function ClientLogos() {
  const logos = Array.from({ length: 7 }, (_, i) => `CLIENT LOGO ${i + 1}`);

  return (
    <section className="bg-white py-12 border-b border-surface-muted">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <p className="font-mono text-[10px] tracking-[0.24em] text-text-muted mb-8">
          موثوق به من شركات نامية
        </p>
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-5">
          {logos.map((label, i) => (
            <div
              key={i}
              className="h-14 flex items-center justify-center font-mono text-[9px] tracking-wider text-text-muted bg-surface-light rounded"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(135deg, #EEF0F3 0px, #EEF0F3 8px, #F6F7F9 8px, #F6F7F9 16px)',
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
