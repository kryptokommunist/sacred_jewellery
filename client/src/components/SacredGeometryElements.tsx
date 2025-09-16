import sacredPattern from "@assets/generated_images/Sacred_geometry_background_pattern_937a286e.png";

interface SacredGeometryElementsProps {
  variant?: "background" | "divider" | "accent";
  className?: string;
}

export default function SacredGeometryElements({ 
  variant = "background", 
  className = "" 
}: SacredGeometryElementsProps) {
  
  if (variant === "background") {
    return (
      <div className={`absolute inset-0 opacity-5 pointer-events-none ${className}`}>
        <div 
          className="w-full h-full bg-repeat"
          style={{ 
            backgroundImage: `url(${sacredPattern})`,
            backgroundSize: '400px 400px'
          }}
        />
      </div>
    );
  }

  if (variant === "divider") {
    return (
      <div className={`flex justify-center py-8 ${className}`}>
        <div className="relative">
          <div className="w-32 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border border-primary rounded-full bg-background rotate-45" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === "accent") {
    return (
      <div className={`relative ${className}`}>
        {/* Golden Ratio Spiral */}
        <div className="absolute top-4 right-4 w-16 h-16 opacity-20">
          <svg viewBox="0 0 100 100" className="w-full h-full text-primary">
            <path
              d="M50 10 A40 40 0 0 1 90 50 A40 40 0 0 1 50 90 A40 40 0 0 1 10 50 A40 40 0 0 1 50 10"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </div>
        
        {/* Geometric Pattern */}
        <div className="absolute bottom-4 left-4 w-12 h-12 opacity-20">
          <svg viewBox="0 0 100 100" className="w-full h-full text-primary">
            <polygon
              points="50,15 85,75 15,75"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
            <circle
              cx="50"
              cy="50"
              r="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>
    );
  }

  return null;
}