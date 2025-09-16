// Jewelry-specific geometry generation
// This module combines sacred geometry patterns with jewelry-specific structures

import { 
  generatePattern, 
  type GeometryParameters, 
  type PatternResult, 
  type Point3D,
  PHI
} from './index';

export interface JewelryStructure {
  type: 'necklace' | 'earrings' | 'ring';
  chainAttachments?: Point3D[]; // For necklaces
  earWireAttachment?: Point3D; // For earrings
  ringBand?: {
    innerRadius: number;
    outerRadius: number;
    height: number;
  };
}

export interface JewelryGeometry {
  pattern: PatternResult;
  structure: JewelryStructure;
  boundingBox: {
    min: Point3D;
    max: Point3D;
  };
}

// Convert ring size (US) to diameter in mm
export function getRingDiameter(size: number): number {
  // US ring size to inner diameter conversion
  const baseCircumference = 44.2; // Size 0 circumference in mm
  const sizeIncrement = 2.56; // mm per size
  const circumference = baseCircumference + (size * sizeIncrement);
  return circumference / Math.PI;
}

// Generate necklace with chain attachment points
export function generateNecklace(
  patternType: string, 
  params: GeometryParameters,
  chainLength: number = 18
): JewelryGeometry {
  
  const pattern = generatePattern(patternType, params);
  
  // Calculate optimal chain attachment points using golden ratio
  const centerY = 0;
  const attachmentHeight = params.size * 0.8;
  const attachmentSpacing = params.size * PHI * 0.3;
  
  const chainAttachments: Point3D[] = [
    { x: -attachmentSpacing, y: centerY + attachmentHeight, z: params.thickness / 2 },
    { x: attachmentSpacing, y: centerY + attachmentHeight, z: params.thickness / 2 }
  ];
  
  // Add small loops for chain attachment
  chainAttachments.forEach(point => {
    const loopRadius = params.thickness * 0.5;
    const loopSegments = 8;
    
    for (let i = 0; i < loopSegments; i++) {
      const angle = (i / loopSegments) * 2 * Math.PI;
      const x = point.x + loopRadius * Math.cos(angle);
      const y = point.y + loopRadius * Math.sin(angle);
      
      pattern.vertices.push({ x, y, z: point.z });
      pattern.vertices.push({ x, y, z: point.z + params.thickness * 0.2 });
    }
    
    // Add faces for the loops
    const baseIndex = pattern.vertices.length - loopSegments * 2;
    for (let i = 0; i < loopSegments; i++) {
      const current = baseIndex + i * 2;
      const next = baseIndex + ((i + 1) % loopSegments) * 2;
      
      pattern.faces.push([current, next, current + 1]);
      pattern.faces.push([next, next + 1, current + 1]);
    }
  });
  
  const boundingBox = calculateBoundingBox(pattern.vertices);
  
  return {
    pattern,
    structure: {
      type: 'necklace',
      chainAttachments
    },
    boundingBox
  };
}

// Generate earrings with ear wire attachment
export function generateEarrings(
  patternType: string,
  params: GeometryParameters,
  wireType: 'hook' | 'stud' = 'hook'
): JewelryGeometry {
  
  // Scale down for earrings
  const earringParams = {
    ...params,
    size: params.size * 0.6, // Smaller for earrings
    thickness: params.thickness * 0.8
  };
  
  const pattern = generatePattern(patternType, earringParams);
  
  // Add ear wire attachment point
  const attachmentPoint: Point3D = {
    x: 0,
    y: earringParams.size * 0.9,
    z: earringParams.thickness / 2
  };
  
  if (wireType === 'hook') {
    // Generate hook shape using parametric curve
    const hookRadius = earringParams.size * 0.3;
    const wireThickness = earringParams.thickness * 0.3;
    const hookSegments = 16;
    
    for (let i = 0; i <= hookSegments; i++) {
      const t = i / hookSegments;
      const angle = t * Math.PI * 1.2; // Partial circle for hook
      
      const hookX = attachmentPoint.x + hookRadius * Math.cos(angle + Math.PI / 2);
      const hookY = attachmentPoint.y + hookRadius * Math.sin(angle + Math.PI / 2) + hookRadius;
      
      // Create wire cross-section
      for (let j = 0; j < 6; j++) {
        const circleAngle = (j / 6) * 2 * Math.PI;
        const offsetX = wireThickness * Math.cos(circleAngle);
        const offsetZ = wireThickness * Math.sin(circleAngle);
        
        pattern.vertices.push({
          x: hookX + offsetX,
          y: hookY,
          z: attachmentPoint.z + offsetZ
        });
      }
    }
    
    // Add faces for wire
    const wireBaseIndex = pattern.vertices.length - (hookSegments + 1) * 6;
    for (let i = 0; i < hookSegments; i++) {
      const base = wireBaseIndex + i * 6;
      const next = wireBaseIndex + (i + 1) * 6;
      
      for (let j = 0; j < 6; j++) {
        const current = base + j;
        const nextSide = base + ((j + 1) % 6);
        const currentNext = next + j;
        const nextNext = next + ((j + 1) % 6);
        
        pattern.faces.push([current, nextSide, currentNext]);
        pattern.faces.push([nextSide, nextNext, currentNext]);
      }
    }
  } else {
    // Simple stud post
    const postHeight = earringParams.thickness * 2;
    const postRadius = earringParams.thickness * 0.2;
    
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * 2 * Math.PI;
      const x = attachmentPoint.x + postRadius * Math.cos(angle);
      const z = attachmentPoint.z + postRadius * Math.sin(angle);
      
      pattern.vertices.push({ x, y: attachmentPoint.y, z });
      pattern.vertices.push({ x, y: attachmentPoint.y + postHeight, z });
    }
    
    // Add post faces
    const postBaseIndex = pattern.vertices.length - 12;
    for (let i = 0; i < 6; i++) {
      const current = postBaseIndex + i * 2;
      const next = postBaseIndex + ((i + 1) % 6) * 2;
      
      pattern.faces.push([current, next, current + 1]);
      pattern.faces.push([next, next + 1, current + 1]);
    }
  }
  
  const boundingBox = calculateBoundingBox(pattern.vertices);
  
  return {
    pattern,
    structure: {
      type: 'earrings',
      earWireAttachment: attachmentPoint
    },
    boundingBox
  };
}

// Generate ring with proper band
export function generateRing(
  patternType: string,
  params: GeometryParameters,
  fingerSize: number = 7
): JewelryGeometry {
  
  const innerDiameter = getRingDiameter(fingerSize);
  const innerRadius = innerDiameter / 2;
  const bandWidth = params.size * 8; // Band width in mm
  const outerRadius = innerRadius + bandWidth;
  
  // Scale pattern to fit on ring band
  const ringParams = {
    ...params,
    size: params.size * 0.8 * (bandWidth / 10), // Scale based on band width
  };
  
  const pattern = generatePattern(patternType, ringParams);
  
  // Create ring band
  const bandSegments = 32;
  const bandHeight = params.thickness * 2;
  
  // Inner band vertices
  for (let i = 0; i < bandSegments; i++) {
    const angle = (i / bandSegments) * 2 * Math.PI;
    const x = innerRadius * Math.cos(angle);
    const y = innerRadius * Math.sin(angle);
    
    pattern.vertices.push({ x, y, z: 0 });
    pattern.vertices.push({ x, y, z: bandHeight });
  }
  
  // Outer band vertices
  for (let i = 0; i < bandSegments; i++) {
    const angle = (i / bandSegments) * 2 * Math.PI;
    const x = outerRadius * Math.cos(angle);
    const y = outerRadius * Math.sin(angle);
    
    pattern.vertices.push({ x, y, z: 0 });
    pattern.vertices.push({ x, y, z: bandHeight });
  }
  
  // Add band faces
  const innerBaseIndex = pattern.vertices.length - bandSegments * 4;
  const outerBaseIndex = innerBaseIndex + bandSegments * 2;
  
  for (let i = 0; i < bandSegments; i++) {
    const innerCurrent = innerBaseIndex + i * 2;
    const innerNext = innerBaseIndex + ((i + 1) % bandSegments) * 2;
    const outerCurrent = outerBaseIndex + i * 2;
    const outerNext = outerBaseIndex + ((i + 1) % bandSegments) * 2;
    
    // Inner wall
    pattern.faces.push([innerCurrent, innerCurrent + 1, innerNext]);
    pattern.faces.push([innerCurrent + 1, innerNext + 1, innerNext]);
    
    // Outer wall
    pattern.faces.push([outerCurrent, outerNext, outerCurrent + 1]);
    pattern.faces.push([outerNext, outerNext + 1, outerCurrent + 1]);
    
    // Bottom
    pattern.faces.push([innerCurrent, outerCurrent, innerNext]);
    pattern.faces.push([outerCurrent, outerNext, innerNext]);
    
    // Top
    pattern.faces.push([innerCurrent + 1, innerNext + 1, outerCurrent + 1]);
    pattern.faces.push([innerNext + 1, outerNext + 1, outerCurrent + 1]);
  }
  
  // Transform pattern to sit on top of band
  const patternOffset = bandHeight + params.thickness * 0.5;
  pattern.vertices.forEach(vertex => {
    if (vertex.z < bandHeight) { // Only transform pattern vertices, not band
      vertex.z += patternOffset;
      // Position pattern on band surface
      const distance = Math.sqrt(vertex.x * vertex.x + vertex.y * vertex.y);
      if (distance < innerRadius) {
        const scale = (innerRadius + bandWidth * 0.5) / Math.max(distance, 0.1);
        vertex.x *= scale;
        vertex.y *= scale;
      }
    }
  });
  
  const boundingBox = calculateBoundingBox(pattern.vertices);
  
  return {
    pattern,
    structure: {
      type: 'ring',
      ringBand: {
        innerRadius,
        outerRadius,
        height: bandHeight
      }
    },
    boundingBox
  };
}

// Calculate bounding box for geometry
function calculateBoundingBox(vertices: Point3D[]): { min: Point3D; max: Point3D } {
  if (vertices.length === 0) {
    return {
      min: { x: 0, y: 0, z: 0 },
      max: { x: 0, y: 0, z: 0 }
    };
  }
  
  const min = { ...vertices[0] };
  const max = { ...vertices[0] };
  
  vertices.forEach(vertex => {
    min.x = Math.min(min.x, vertex.x);
    min.y = Math.min(min.y, vertex.y);
    min.z = Math.min(min.z, vertex.z);
    max.x = Math.max(max.x, vertex.x);
    max.y = Math.max(max.y, vertex.y);
    max.z = Math.max(max.z, vertex.z);
  });
  
  return { min, max };
}

// Main jewelry generation function
export function generateJewelry(
  type: 'necklace' | 'earrings' | 'ring',
  patternType: string,
  params: GeometryParameters,
  extraParams?: {
    chainLength?: number;
    wireType?: 'hook' | 'stud';
    fingerSize?: number;
  }
): JewelryGeometry {
  
  switch (type) {
    case 'necklace':
      return generateNecklace(patternType, params, extraParams?.chainLength);
    case 'earrings':
      return generateEarrings(patternType, params, extraParams?.wireType);
    case 'ring':
      return generateRing(patternType, params, extraParams?.fingerSize || params.fingerSize || 7);
    default:
      throw new Error(`Unsupported jewelry type: ${type}`);
  }
}