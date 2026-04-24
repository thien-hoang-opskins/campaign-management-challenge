type RateBarProps = {
  label: string;
  value: number;
};

export function RateBar({ label, value }: RateBarProps) {
  const percentage = Math.max(0, Math.min(100, Math.round(value * 100)));
  return (
    <div className="rate">
      <div className="rate-label">
        <span>{label}</span>
        <strong>{percentage}%</strong>
      </div>
      <div className="rate-track" aria-hidden>
        <div className="rate-fill" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
