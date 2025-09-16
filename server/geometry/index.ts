// Sacred geometry pattern generation engine
// This module contains mathematical algorithms for generating sacred geometry patterns

export interface Point2D {
  x: number;
  y: number;
}

export interface Point3D {
  x: number;
  y: number;
  z: number;
}

export interface GeometryParameters {
  size: number;
  thickness: number;
  complexity: number;
  symmetry: number;
  spiralTurns?: number;
  fingerSize?: number;
}

export interface PatternResult {
  vertices: Point3D[];
  faces: number[][]; // Indices into vertices array
  edges?: Point3D[][]; // Line segments for wireframe view
}

// Golden ratio constant
export const PHI = (1 + Math.sqrt(5)) / 2; // ≈ 1.618033988749895

// Mathematical helper functions
export function polarToCartesian(radius: number, angle: number): Point2D {
  return {
    x: radius * Math.cos(angle),
    y: radius * Math.sin(angle)
  };
}

export function rotatePoint2D(point: Point2D, angle: number): Point2D {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: point.x * cos - point.y * sin,
    y: point.x * sin + point.y * cos
  };
}

export function extrudeToZ(point2D: Point2D, z: number): Point3D {
  return { ...point2D, z };
}

// Sacred Geometry Pattern Generators

export function generateMandalaPattern(params: GeometryParameters): PatternResult {
  const { size, thickness, complexity, symmetry } = params;
  const vertices: Point3D[] = [];
  const faces: number[][] = [];
  
  const layers = Math.floor(complexity * 5) + 1; // 1-6 layers based on complexity
  const petalCount = symmetry;
  const centerRadius = size * 0.1;
  
  // Center circle vertices
  for (let i = 0; i <= petalCount; i++) {
    const angle = (i / petalCount) * 2 * Math.PI;
    const point = polarToCartesian(centerRadius, angle);
    vertices.push(extrudeToZ(point, 0));
    vertices.push(extrudeToZ(point, thickness));
  }
  
  // Generate concentric layers with petal patterns
  for (let layer = 1; layer <= layers; layer++) {
    const layerRadius = size * (layer / layers) * 0.8;
    const layerPetals = petalCount * layer; // More petals in outer layers
    
    for (let i = 0; i < layerPetals; i++) {
      const angle = (i / layerPetals) * 2 * Math.PI;
      const petalAngle = angle + Math.sin(angle * petalCount) * 0.3; // Sacred geometry wave
      
      // Create petal shape using golden ratio proportions
      const innerRadius = layerRadius * (1 - 1/PHI);
      const outerRadius = layerRadius;
      
      const innerPoint = polarToCartesian(innerRadius, petalAngle);
      const outerPoint = polarToCartesian(outerRadius, petalAngle);
      
      vertices.push(extrudeToZ(innerPoint, 0));
      vertices.push(extrudeToZ(innerPoint, thickness));
      vertices.push(extrudeToZ(outerPoint, 0));
      vertices.push(extrudeToZ(outerPoint, thickness));
    }
  }
  
  // Generate faces (simplified triangulation)
  for (let i = 0; i < vertices.length - 3; i += 4) {
    // Top face triangles
    faces.push([i, i + 2, i + 1]);
    faces.push([i + 1, i + 2, i + 3]);
    
    // Bottom face triangles (reversed winding)
    faces.push([i + 4, i + 5, i + 6]);
    faces.push([i + 5, i + 7, i + 6]);
  }
  
  return { vertices, faces };
}

export function generateFibonacciSpiral(params: GeometryParameters): PatternResult {
  const { size, thickness, spiralTurns = 3 } = params;
  const vertices: Point3D[] = [];
  const faces: number[][] = [];
  
  const segments = spiralTurns * 20; // Smooth spiral
  const maxRadius = size * 0.8;
  
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const angle = t * spiralTurns * 2 * Math.PI;
    
    // Fibonacci spiral: radius grows according to golden ratio
    const radius = maxRadius * Math.pow(t, 1/PHI);
    const spiralPoint = polarToCartesian(radius, angle);
    
    // Create cross-section at each point
    const width = thickness * (1 - t * 0.3); // Taper towards end
    const perpAngle = angle + Math.PI / 2;
    const offset = polarToCartesian(width / 2, perpAngle);
    
    vertices.push(extrudeToZ({
      x: spiralPoint.x + offset.x,
      y: spiralPoint.y + offset.y
    }, 0));
    
    vertices.push(extrudeToZ({
      x: spiralPoint.x - offset.x,
      y: spiralPoint.y - offset.y
    }, 0));
    
    vertices.push(extrudeToZ({
      x: spiralPoint.x + offset.x,
      y: spiralPoint.y + offset.y
    }, thickness));
    
    vertices.push(extrudeToZ({
      x: spiralPoint.x - offset.x,
      y: spiralPoint.y - offset.y
    }, thickness));
  }
  
  // Generate faces for spiral tube
  for (let i = 0; i < segments; i++) {
    const base = i * 4;
    const next = (i + 1) * 4;
    
    if (next < vertices.length) {
      // Side faces
      faces.push([base, base + 1, next]);
      faces.push([base + 1, next + 1, next]);
      faces.push([base + 2, next + 2, base + 3]);
      faces.push([base + 3, next + 2, next + 3]);
      
      // Top and bottom faces
      faces.push([base, next, base + 2]);
      faces.push([next, next + 2, base + 2]);
      faces.push([base + 1, base + 3, next + 1]);
      faces.push([base + 3, next + 3, next + 1]);
    }
  }
  
  return { vertices, faces };
}

export function generateFlowerOfLife(params: GeometryParameters): PatternResult {
  const { size, thickness, complexity } = params;
  const vertices: Point3D[] = [];
  const faces: number[][] = [];
  
  const circleRadius = size * 0.15;
  const generations = Math.floor(complexity * 3) + 1; // 1-4 generations
  
  // Central circle
  const centerPoints = generateCirclePoints(0, 0, circleRadius, 12);
  addCircleVertices(vertices, centerPoints, thickness);
  
  // Generate surrounding circles in hexagonal pattern
  for (let gen = 1; gen <= generations; gen++) {
    const distance = circleRadius * 2 * gen;
    const circlesInRing = gen * 6;
    
    for (let i = 0; i < circlesInRing; i++) {
      const angle = (i / circlesInRing) * 2 * Math.PI;
      const centerX = distance * Math.cos(angle);
      const centerY = distance * Math.sin(angle);
      
      const circlePoints = generateCirclePoints(centerX, centerY, circleRadius, 12);
      addCircleVertices(vertices, circlePoints, thickness);
    }
  }
  
  // Generate faces for all circles
  const pointsPerCircle = 12;
  const circleCount = vertices.length / (pointsPerCircle * 2);
  
  for (let circle = 0; circle < circleCount; circle++) {
    const baseIndex = circle * pointsPerCircle * 2;
    addCircleFaces(faces, baseIndex, pointsPerCircle);
  }
  
  return { vertices, faces };
}

export function generateIslamicStar(params: GeometryParameters): PatternResult {
  const { size, thickness, symmetry } = params;
  const vertices: Point3D[] = [];
  const faces: number[][] = [];
  
  const points = symmetry; // Usually 8 for Islamic stars
  const outerRadius = size * 0.8;
  const innerRadius = outerRadius * 0.6;
  
  // Generate star points
  for (let i = 0; i < points * 2; i++) {
    const angle = (i / (points * 2)) * 2 * Math.PI;
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const point = polarToCartesian(radius, angle);
    
    vertices.push(extrudeToZ(point, 0));
    vertices.push(extrudeToZ(point, thickness));
  }
  
  // Add center point for proper tessellation
  vertices.push(extrudeToZ({ x: 0, y: 0 }, 0));
  vertices.push(extrudeToZ({ x: 0, y: 0 }, thickness));
  
  // Generate faces
  const starPoints = points * 2;
  const centerBottomIndex = starPoints * 2;
  const centerTopIndex = centerBottomIndex + 1;
  
  for (let i = 0; i < starPoints; i++) {
    const current = i * 2;
    const next = ((i + 1) % starPoints) * 2;
    
    // Bottom face triangles
    faces.push([centerBottomIndex, current, next]);
    
    // Top face triangles
    faces.push([centerTopIndex, next + 1, current + 1]);
    
    // Side face quads
    faces.push([current, next, current + 1]);
    faces.push([next, next + 1, current + 1]);
  }
  
  return { vertices, faces };
}

export function generateCelticKnot(params: GeometryParameters): PatternResult {
  const { size, thickness, complexity } = params;
  const vertices: Point3D[] = [];
  const faces: number[][] = [];
  
  const loops = Math.floor(complexity * 4) + 2; // 2-6 loops
  const knotRadius = size * 0.7;
  const tubeRadius = thickness * 0.8;
  
  // Generate Celtic knot path using parametric equations
  const segments = loops * 32; // Smooth curves
  
  for (let i = 0; i <= segments; i++) {
    const t = (i / segments) * 2 * Math.PI;
    
    // Celtic knot parametric equations (simplified trefoil-like pattern)
    const x = knotRadius * Math.cos(t) * (1 + 0.3 * Math.cos(loops * t));
    const y = knotRadius * Math.sin(t) * (1 + 0.3 * Math.cos(loops * t));
    const z = knotRadius * 0.2 * Math.sin(loops * t); // Vertical weaving
    
    // Create circular cross-section around the path
    const tangentAngle = Math.atan2(
      Math.cos(t) * (1 + 0.3 * Math.cos(loops * t)) - 0.3 * loops * Math.sin(loops * t) * Math.sin(t),
      -Math.sin(t) * (1 + 0.3 * Math.cos(loops * t)) - 0.3 * loops * Math.sin(loops * t) * Math.cos(t)
    );
    
    for (let j = 0; j < 8; j++) { // 8-sided tube
      const circleAngle = (j / 8) * 2 * Math.PI;
      const offset = polarToCartesian(tubeRadius, tangentAngle + circleAngle);
      
      vertices.push({
        x: x + offset.x,
        y: y + offset.y,
        z: z + thickness
      });
    }
  }
  
  // Generate faces for knot tube
  const sidesPerSegment = 8;
  for (let i = 0; i < segments; i++) {
    const base = i * sidesPerSegment;
    const next = ((i + 1) % (segments + 1)) * sidesPerSegment;
    
    for (let j = 0; j < sidesPerSegment; j++) {
      const currentSide = base + j;
      const nextSide = base + ((j + 1) % sidesPerSegment);
      const currentNext = next + j;
      const nextNext = next + ((j + 1) % sidesPerSegment);
      
      faces.push([currentSide, nextSide, currentNext]);
      faces.push([nextSide, nextNext, currentNext]);
    }
  }
  
  return { vertices, faces };
}

// Helper functions
function generateCirclePoints(centerX: number, centerY: number, radius: number, segments: number): Point2D[] {
  const points: Point2D[] = [];
  for (let i = 0; i < segments; i++) {
    const angle = (i / segments) * 2 * Math.PI;
    points.push({
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    });
  }
  return points;
}

function addCircleVertices(vertices: Point3D[], circlePoints: Point2D[], thickness: number): void {
  circlePoints.forEach(point => {
    vertices.push(extrudeToZ(point, 0));
    vertices.push(extrudeToZ(point, thickness));
  });
}

function addCircleFaces(faces: number[][], baseIndex: number, pointsPerCircle: number): void {
  for (let i = 0; i < pointsPerCircle; i++) {
    const current = baseIndex + i * 2;
    const next = baseIndex + ((i + 1) % pointsPerCircle) * 2;
    
    // Bottom face
    if (i < pointsPerCircle - 2) {
      faces.push([baseIndex, current + 2, next]);
    }
    
    // Top face
    if (i < pointsPerCircle - 2) {
      faces.push([baseIndex + 1, next + 1, current + 3]);
    }
    
    // Side faces
    faces.push([current, next, current + 1]);
    faces.push([next, next + 1, current + 1]);
  }
}

// Main pattern generator function
export function generatePattern(patternType: string, params: GeometryParameters): PatternResult {
  switch (patternType) {
    case 'mandala':
      return generateMandalaPattern(params);
    case 'fibonacci':
      return generateFibonacciSpiral(params);
    case 'flower-of-life':
      return generateFlowerOfLife(params);
    case 'islamic':
      return generateIslamicStar(params);
    case 'celtic':
      return generateCelticKnot(params);
    default:
      return generateMandalaPattern(params); // Default fallback
  }
}