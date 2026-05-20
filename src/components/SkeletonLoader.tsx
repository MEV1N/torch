"use client";

export default function SkeletonLoader({ className = "", count = 1 }: { className?: string; count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`skeleton ${className}`} />
      ))}
    </>
  );
}

export function SkeletonCard() {
  return (
    <div className="card-romantic p-5 space-y-3">
      <div className="skeleton h-4 w-3/4" />
      <div className="skeleton h-4 w-1/2" />
      <div className="skeleton h-20 w-full mt-2" />
    </div>
  );
}

export function SkeletonAvatar({ size = "w-12 h-12" }: { size?: string }) {
  return <div className={`skeleton rounded-full ${size}`} />;
}
