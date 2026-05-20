"use client";

interface AvatarProps {
  src?: string;
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  glow?: boolean;
  className?: string;
}

const sizes = {
  sm: "w-8 h-8 text-xs",
  md: "w-11 h-11 text-sm",
  lg: "w-16 h-16 text-lg",
  xl: "w-24 h-24 text-2xl",
};

export default function Avatar({ src, name, size = "md", glow = false, className = "" }: AvatarProps) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={`relative rounded-full flex items-center justify-center overflow-hidden shrink-0 ${sizes[size]} ${
        glow ? "ring-2 ring-rose-primary/50 shadow-lg shadow-rose-glow/20" : "ring-1 ring-border-light"
      } ${className}`}
    >
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-rose-primary/30 to-romantic-purple/30 text-foreground font-bold">
          {initials}
        </div>
      )}
    </div>
  );
}
