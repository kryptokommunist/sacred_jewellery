import SacredGeometryElements from '../SacredGeometryElements'

export default function SacredGeometryElementsExample() {
  return (
    <div className="space-y-8">
      <div className="relative h-32 bg-muted rounded-lg">
        <SacredGeometryElements variant="background" />
        <div className="relative z-10 flex items-center justify-center h-full">
          <span className="text-foreground">Background Pattern</span>
        </div>
      </div>
      
      <SacredGeometryElements variant="divider" />
      
      <div className="relative h-32 bg-card rounded-lg p-4">
        <SacredGeometryElements variant="accent" />
        <span className="text-foreground">Content with accent elements</span>
      </div>
    </div>
  );
}