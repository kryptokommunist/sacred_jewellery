import { useRef, useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';

interface ThreeJS3DViewerProps {
  jewelryType: string;
  patternType: string;
  parameters: any;
  onGeometryUpdate?: (geometry: any) => void;
}

// Simple 3D viewer component that will display jewelry with CSS 3D transforms
// This is a lightweight alternative to Three.js that doesn't require React 19
export default function ThreeJS3DViewer({ 
  jewelryType, 
  patternType, 
  parameters,
  onGeometryUpdate 
}: ThreeJS3DViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRotating, setIsRotating] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(false);

  // Mock geometry generation based on parameters
  useEffect(() => {
    const generateMockGeometry = () => {
      setIsLoading(true);
      
      // Simulate API call to generate 3D geometry
      setTimeout(() => {
        const mockGeometry = {
          vertexCount: Math.floor(parameters.complexity * 1000) + 100,
          faceCount: Math.floor(parameters.complexity * 500) + 50,
          boundingBox: {
            min: { x: -parameters.size, y: -parameters.size, z: 0 },
            max: { x: parameters.size, y: parameters.size, z: parameters.thickness }
          }
        };
        
        onGeometryUpdate?.(mockGeometry);
        setIsLoading(false);
      }, 800);
    };

    generateMockGeometry();
  }, [parameters, patternType, jewelryType, onGeometryUpdate]);

  // Auto-rotation effect
  useEffect(() => {
    if (!isRotating) return;

    const interval = setInterval(() => {
      setRotation(prev => ({
        ...prev,
        y: (prev.y + 1) % 360
      }));
    }, 50);

    return () => clearInterval(interval);
  }, [isRotating]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsRotating(false);
    const startX = e.clientX;
    const startY = e.clientY;
    const startRotation = { ...rotation };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      
      setRotation({
        x: Math.max(-90, Math.min(90, startRotation.x + deltaY * 0.5)),
        y: (startRotation.y + deltaX * 0.5) % 360
      });
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      setTimeout(() => setIsRotating(true), 2000); // Resume auto-rotation after 2s
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.max(0.5, Math.min(3, prev * delta)));
  };

  // Generate visual representation based on jewelry type and pattern
  const getJewelryVisualization = () => {
    const baseSize = 120 * parameters.size;
    const thickness = 20 * parameters.thickness;
    
    switch (jewelryType) {
      case 'necklace':
        return (
          <div className="relative">
            {/* Main pendant */}
            <div 
              className="absolute border-2 border-primary/60 bg-gradient-to-br from-primary/20 to-primary/40"
              style={{
                width: baseSize,
                height: baseSize,
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                borderRadius: patternType === 'mandala' ? '50%' : patternType === 'islamic' ? '0' : '30%',
                clipPath: patternType === 'islamic' ? 'polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)' : undefined
              }}
            >
              {/* Pattern overlay */}
              {patternType === 'mandala' && (
                <div className="absolute inset-2 border border-primary/40 rounded-full">
                  <div className="absolute inset-2 border border-primary/30 rounded-full">
                    <div className="absolute inset-2 border border-primary/20 rounded-full" />
                  </div>
                </div>
              )}
              {patternType === 'fibonacci' && (
                <div className="absolute inset-0 overflow-hidden rounded-full">
                  <div 
                    className="absolute w-full h-full border-l-2 border-primary/40"
                    style={{ 
                      transformOrigin: 'center',
                      transform: 'rotate(0deg)',
                      borderRadius: '50% 0 50% 0'
                    }}
                  />
                  <div 
                    className="absolute w-full h-full border-l-2 border-primary/30"
                    style={{ 
                      transformOrigin: 'center',
                      transform: 'rotate(72deg)',
                      borderRadius: '50% 0 50% 0'
                    }}
                  />
                </div>
              )}
            </div>
            
            {/* Chain attachment points */}
            <div 
              className="absolute w-3 h-3 bg-primary/60 rounded-full"
              style={{ left: '35%', top: '25%' }}
            />
            <div 
              className="absolute w-3 h-3 bg-primary/60 rounded-full"
              style={{ right: '35%', top: '25%' }}
            />
          </div>
        );
        
      case 'earrings':
        return (
          <div className="relative">
            {/* Earring body */}
            <div 
              className="absolute border-2 border-primary/60 bg-gradient-to-br from-primary/20 to-primary/40"
              style={{
                width: baseSize * 0.7,
                height: baseSize * 0.7,
                left: '50%',
                top: '55%',
                transform: 'translate(-50%, -50%)',
                borderRadius: patternType === 'mandala' ? '50%' : '20%'
              }}
            >
              {/* Pattern details */}
              {Array.from({ length: parameters.symmetry }, (_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-4 bg-primary/40"
                  style={{
                    left: '50%',
                    top: '10%',
                    transformOrigin: '50% 200%',
                    transform: `translateX(-50%) rotate(${(i / parameters.symmetry) * 360}deg)`
                  }}
                />
              ))}
            </div>
            
            {/* Ear wire */}
            <div 
              className="absolute w-1 h-12 bg-primary/60 rounded-full"
              style={{ left: '50%', top: '15%', transform: 'translateX(-50%)' }}
            />
            <div 
              className="absolute w-6 h-6 border-2 border-primary/60 rounded-full"
              style={{ left: '50%', top: '10%', transform: 'translateX(-50%)' }}
            />
          </div>
        );
        
      case 'ring':
        return (
          <div className="relative">
            {/* Ring band */}
            <div 
              className="absolute border-4 border-primary/60 bg-gradient-to-br from-primary/10 to-primary/30 rounded-full"
              style={{
                width: baseSize * 1.2,
                height: baseSize * 1.2,
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)'
              }}
            >
              <div 
                className="absolute bg-transparent rounded-full border-2 border-primary/20"
                style={{
                  width: baseSize * 0.6,
                  height: baseSize * 0.6,
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)'
                }}
              />
            </div>
            
            {/* Ring top design */}
            <div 
              className="absolute border-2 border-primary/80 bg-gradient-to-br from-primary/40 to-primary/60"
              style={{
                width: baseSize * 0.5,
                height: baseSize * 0.3,
                left: '50%',
                top: '35%',
                transform: 'translate(-50%, -50%)',
                borderRadius: patternType === 'mandala' ? '50%' : '20%'
              }}
            />
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full bg-gradient-to-br from-muted/30 to-muted/60 rounded-lg overflow-hidden cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onWheel={handleWheel}
      data-testid="3d-viewer"
    >
      {/* 3D Scene Container */}
      <div 
        className="absolute inset-0 flex items-center justify-center"
        style={{
          transform: `
            perspective(1000px) 
            rotateX(${rotation.x}deg) 
            rotateY(${rotation.y}deg) 
            scale(${zoom})
          `,
          transformStyle: 'preserve-3d',
          transition: isRotating ? 'none' : 'transform 0.1s ease-out'
        }}
      >
        {/* Base plane */}
        <div 
          className="absolute w-64 h-64 bg-gradient-to-br from-muted/10 to-muted/20 rounded-full"
          style={{ 
            transform: 'rotateX(90deg) translateZ(-50px)',
            opacity: 0.3
          }}
        />
        
        {/* Jewelry model */}
        <div 
          style={{
            transform: `translateZ(${parameters.thickness * 10}px)`,
            transformStyle: 'preserve-3d'
          }}
        >
          {getJewelryVisualization()}
        </div>
      </div>

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <span className="text-sm text-muted-foreground">Generating geometry...</span>
          </div>
        </div>
      )}

      {/* Controls overlay */}
      <div className="absolute top-4 left-4 flex flex-col gap-2">
        <Badge variant="secondary" className="text-xs">
          Zoom: {(zoom * 100).toFixed(0)}%
        </Badge>
        <Badge variant="secondary" className="text-xs">
          {isRotating ? 'Auto-rotating' : 'Manual control'}
        </Badge>
      </div>

      {/* Help text */}
      <div className="absolute bottom-4 right-4 text-xs text-muted-foreground">
        <div>Drag to rotate • Scroll to zoom</div>
      </div>
    </div>
  );
}