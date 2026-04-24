type SkeletonListProps = {
  rows?: number;
};

export function SkeletonList({ rows = 4 }: SkeletonListProps) {
  return (
    <div className="skeleton-list" aria-busy="true" aria-label="Loading">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="skeleton-row" />
      ))}
    </div>
  );
}
