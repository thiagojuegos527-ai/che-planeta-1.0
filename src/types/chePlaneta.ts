export interface DiyIdea {
  id: string;
  title: string;
  subtitle: string;
  difficulty: 'Fácil' | 'Media' | 'Avanzada';
  timeMinutes: number;
  materialsNeeded: string[];
  steps: string[];
  ecoBenefit: string;
}

export interface EnvironmentalImpact {
  yearsToDegrade: string;
  yearsNumericRange: [number, number];
  carbonFootprint: string;
  wildlifeDanger: string;
  oceanImpact: string;
  conservationTip: string;
}

export interface DisposalGuide {
  containerColor: 'Verde' | 'Amarillo' | 'Azul' | 'Gris' | 'Punto Especial / Peligroso' | 'Marrón (Orgánico)';
  containerColorHex: string;
  containerName: string;
  preparationSteps: string[];
  warnings: string[];
  recyclingCategory: string;
  recyclingCenterType: string;
}

export interface ReliableSource {
  name: string;
  organization: string;
  url: string;
  topic: string;
  fact: string;
}

export interface EcoAnalysisResult {
  recognized?: boolean;
  unrecognizedReason?: string;
  retakeSuggestions?: string[];
  objectName: string;
  category: string;
  probableMaterial: string;
  materialsBreakdown?: string[];
  materialDetails: string;
  recyclabilityScore: number; // 0 - 100
  recyclabilityBadge: 'Altamente Reciclable' | 'Reciclable con Preparación' | 'Reutilizable / Upcycling' | 'Residuo Especial / Peligroso' | 'No Reciclable';
  badgeColor: string;
  summary: string;
  diyIdeas: DiyIdea[];
  disposalGuide: DisposalGuide;
  environmentalImpact: EnvironmentalImpact;
  reliableSources: ReliableSource[];
  cheConsejo: string;
  matchedGreenPointIds?: string[];
  timestamp: string;
  imageUrl: string;
}

export interface GreenPoint {
  id: string;
  name: string;
  address: string;
  neighborhood: string;
  city: string;
  distanceKm: number;
  acceptedMaterials: string[];
  schedule: string;
  phone?: string;
  coordinates: { lat: number; lng: number };
}
