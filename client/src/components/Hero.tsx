import { Button } from "@/components/ui/button";
import heroImage from "@assets/generated_images/Hero_jewelry_model_image_2f7addb1.png";

export default function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Dark Wash */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50" />
      </div>
      
      {/* Sacred Geometry Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-primary/30 rounded-full animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-24 h-24 border border-primary/30 rotate-45" 
             style={{ borderRadius: "30%" }} />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6">
        <h1 className="font-serif text-6xl md:text-8xl font-bold mb-6 leading-tight">
          Sacred Geometry
          <span className="block text-5xl md:text-7xl text-primary/90">Jewelry</span>
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto leading-relaxed">
          Create and customize beautiful 3D printed jewelry with parametric design tools 
          inspired by ancient sacred patterns and golden ratio proportions
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="bg-primary/90 backdrop-blur-sm border border-primary text-lg px-8 py-6"
            data-testid="button-start-designing"
          >
            Start Designing
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="bg-white/10 backdrop-blur-sm text-white border-white/30 text-lg px-8 py-6"
            data-testid="button-browse-collection"
          >
            Browse Collection
          </Button>
        </div>
      </div>
    </section>
  );
}