import JewelryCard from "./JewelryCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import collectionImage from "@assets/generated_images/Sacred_geometry_jewelry_collection_682cb4a2.png";

// todo: remove mock functionality
const mockJewelry = {
  necklaces: [
    { id: "n1", name: "Mandala Harmony", price: 89, description: "Buddhist-inspired mandala pattern with golden ratio proportions" },
    { id: "n2", name: "Fibonacci Spiral", price: 95, description: "Elegant spiral design following the divine golden sequence" },
    { id: "n3", name: "Sacred Lotus", price: 78, description: "Lotus pattern with sacred geometry elements and meditation symbols" },
    { id: "n4", name: "Flower of Life", price: 102, description: "Ancient symbol representing the fundamental forms of time and space" },
    { id: "n5", name: "Islamic Tessellation", price: 86, description: "Intricate geometric patterns inspired by Islamic art and architecture" },
    { id: "n6", name: "Tree of Life", price: 92, description: "Sacred tree symbol with fractal branches and golden proportions" },
    { id: "n7", name: "Om Symbol Pendant", price: 74, description: "Hindu sacred symbol with geometric embellishments" },
    { id: "n8", name: "Celtic Knot", price: 81, description: "Endless knot pattern representing eternal flow of energy" },
    { id: "n9", name: "Chakra Harmony", price: 97, description: "Seven chakra symbols integrated into geometric mandala design" },
    { id: "n10", name: "Golden Ratio Crown", price: 105, description: "Crown-like design using pure golden ratio mathematical principles" }
  ],
  earrings: [
    { id: "e1", name: "Cosmic Spiral Drops", price: 45, description: "Spiral earrings representing cosmic energy and divine proportion" },
    { id: "e2", name: "Sacred Triangle", price: 52, description: "Triangular sacred geometry with precise mathematical angles" },
    { id: "e3", name: "Mandala Circles", price: 38, description: "Circular mandala patterns for meditative beauty" },
    { id: "e4", name: "Fractal Feathers", price: 41, description: "Feather-like fractal patterns with natural golden curves" },
    { id: "e5", name: "Star Tetrahedron", price: 49, description: "3D sacred geometry representing balance of masculine and feminine" },
    { id: "e6", name: "Vesica Piscis", price: 43, description: "Ancient symbol of duality and unity in perfect mathematical form" },
    { id: "e7", name: "Lotus Petals", price: 47, description: "Delicate lotus petal design with sacred number sequences" },
    { id: "e8", name: "Islamic Stars", price: 44, description: "Eight-pointed star patterns from Islamic geometric tradition" },
    { id: "e9", name: "Celtic Spirals", price: 50, description: "Triple spiral design representing maiden, mother, crone" },
    { id: "e10", name: "Buddha's Knot", price: 46, description: "Endless knot symbolizing wisdom and compassion" }
  ],
  rings: [
    { id: "r1", name: "Fibonacci Band", price: 67, description: "Ring band with Fibonacci sequence carved into the surface" },
    { id: "r2", name: "Merkaba Ring", price: 72, description: "Sacred 3D star tetrahedron geometry for spiritual protection" },
    { id: "r3", name: "Golden Ratio Spiral", price: 59, description: "Perfect spiral following divine mathematical proportions" },
    { id: "r4", name: "Mandala Signet", price: 84, description: "Large mandala pattern for statement ring with personal meaning" },
    { id: "r5", name: "Celtic Trinity", price: 61, description: "Trinity knot representing mind, body, spirit unity" },
    { id: "r6", name: "Sacred Hexagon", price: 75, description: "Hexagonal sacred geometry with natural honeycomb patterns" },
    { id: "r7", name: "Om Meditation Ring", price: 53, description: "Spinning meditation ring with Om symbol and mantras" },
    { id: "r8", name: "Flower of Life Band", price: 79, description: "Continuous flower of life pattern wrapping around finger" },
    { id: "r9", name: "Chakra Alignment", price: 88, description: "Seven chakra stones aligned with sacred geometric settings" },
    { id: "r10", name: "Pythagorean Theorem", price: 65, description: "Mathematical beauty celebrating the famous geometric theorem" }
  ]
};

export default function JewelryGallery() {
  return (
    <section className="py-16 px-6 max-w-7xl mx-auto" id="gallery">
      <div className="text-center mb-12">
        <h2 className="font-serif text-4xl font-bold text-foreground mb-4">
          Sacred Geometry Collection
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Discover our curated collection of parametric jewelry designs inspired by ancient wisdom 
          and mathematical beauty. Each piece can be customized to your preferences.
        </p>
      </div>

      <Tabs defaultValue="necklaces" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8" data-testid="tabs-jewelry-categories">
          <TabsTrigger value="necklaces" data-testid="tab-necklaces">Necklaces</TabsTrigger>
          <TabsTrigger value="earrings" data-testid="tab-earrings">Earrings</TabsTrigger>
          <TabsTrigger value="rings" data-testid="tab-rings">Rings</TabsTrigger>
        </TabsList>

        <TabsContent value="necklaces" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mockJewelry.necklaces.map((item, index) => (
            <JewelryCard
              key={item.id}
              id={item.id}
              name={item.name}
              type="necklace"
              price={item.price}
              description={item.description}
              image={collectionImage}
              featured={index === 0}
            />
          ))}
        </TabsContent>

        <TabsContent value="earrings" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mockJewelry.earrings.map((item, index) => (
            <JewelryCard
              key={item.id}
              id={item.id}
              name={item.name}
              type="earrings"
              price={item.price}
              description={item.description}
              image={collectionImage}
              featured={index === 0}
            />
          ))}
        </TabsContent>

        <TabsContent value="rings" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mockJewelry.rings.map((item, index) => (
            <JewelryCard
              key={item.id}
              id={item.id}
              name={item.name}
              type="ring"
              price={item.price}
              description={item.description}
              image={collectionImage}
              featured={index === 0}
            />
          ))}
        </TabsContent>
      </Tabs>

      <div className="text-center mt-12">
        <Button size="lg" variant="outline" data-testid="button-view-all">
          View All Designs
        </Button>
      </div>
    </section>
  );
}