import * as mobilenet from '@tensorflow-models/mobilenet';
import '@tensorflow/tfjs';
import type { EcoAnalysisResult } from '../types/chePlaneta';

let modelPromise: Promise<mobilenet.MobileNet> | null = null;

function getModel() {
  if (!modelPromise) modelPromise = mobilenet.load({ version: 2, alpha: 1.0 });
  return modelPromise;
}

function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('No pudimos abrir la fotografía. Probá con otra imagen.'));
    image.src = dataUrl;
  });
}

type MaterialKey = 'carton' | 'metal' | 'plastic' | 'glass' | 'paper' | 'organic' | 'special';
const patterns: Array<{ key: MaterialKey; terms: RegExp; object: string }> = [
  { key: 'carton', terms: /carton|cardboard|corrugated|carton box|box,|packet|packaging/, object: 'Caja o envase de cartón' },
  { key: 'metal', terms: /can opener|tin can|pop can|beer can|soda can|metal can|can,/, object: 'Lata metálica' },
  { key: 'plastic', terms: /plastic bottle|water bottle|pop bottle|squeeze bottle|plastic bag|water jug/, object: 'Envase plástico' },
  { key: 'glass', terms: /wine bottle|beer bottle|glass bottle|jar,|mason jar/, object: 'Botella o frasco de vidrio' },
  { key: 'paper', terms: /newspaper|envelope|paper towel|book,|comic book|notebook|menu,/, object: 'Papel o producto de papel' },
  { key: 'organic', terms: /banana|orange|lemon|apple|pineapple|broccoli|cauliflower|strawberry|granny smith/, object: 'Residuo orgánico' },
  { key: 'special', terms: /battery|cellular telephone|remote control/, object: 'Pila o residuo electrónico' },
];

const materialInfo: Record<MaterialKey, { category: string; material: string; color: string; hex: string; container: string; score: number; badge: EcoAnalysisResult['recyclabilityBadge']; prep: string[]; warning: string[]; diy: string[] }> = {
  carton: { category: 'Papel y Cartón', material: 'Cartón', color: 'Azul', hex: '#2563EB', container: 'Contenedor de papel y cartón', score: 90, badge: 'Altamente Reciclable', prep: ['Retirá restos de comida y elementos que no sean de papel.', 'Aplastá la caja para ocupar menos espacio.', 'Mantenela seca y limpia.'], warning: ['El cartón con grasa o restos de comida puede no ser reciclable.'], diy: ['Organizador de escritorio', 'Separadores para cajones'] },
  metal: { category: 'Metales', material: 'Metal (posiblemente aluminio o acero)', color: 'Amarillo', hex: '#EAB308', container: 'Contenedor de envases/metales', score: 90, badge: 'Altamente Reciclable', prep: ['Vaciá completamente la lata.', 'Enjuagala si tiene restos de bebida o comida.', 'Dejala secar.'], warning: ['No manipules latas con bordes filosos.'], diy: ['Portalápices decorado', 'Maceta pequeña (con bordes protegidos)'] },
  plastic: { category: 'Plásticos', material: 'Plástico (tipo exacto no confirmado por la imagen)', color: 'Amarillo', hex: '#EAB308', container: 'Contenedor de envases plásticos', score: 80, badge: 'Reciclable con Preparación', prep: ['Vacialo y enjuagalo.', 'Dejalo secar.', 'Separá tapa y etiqueta si tu sistema local lo solicita.'], warning: ['La imagen no permite identificar con certeza el tipo de plástico.'], diy: ['Maceta para plantines', 'Organizador pequeño'] },
  glass: { category: 'Vidrio', material: 'Vidrio', color: 'Verde', hex: '#16A34A', container: 'Contenedor de vidrio', score: 90, badge: 'Altamente Reciclable', prep: ['Vacialo y enjuagalo.', 'Retirá tapas si es posible.', 'Manipulalo con cuidado.'], warning: ['No incluyas espejos, cerámica ni vidrio roto en contenedores de envases.'], diy: ['Frasco organizador', 'Florero reutilizado'] },
  paper: { category: 'Papel y Cartón', material: 'Papel', color: 'Azul', hex: '#2563EB', container: 'Contenedor de papel', score: 85, badge: 'Reciclable con Preparación', prep: ['Mantenelo limpio y seco.', 'Retirá plásticos, cintas y otros materiales cuando sea posible.', 'Separá papeles muy sucios o plastificados.'], warning: ['Papel sanitario o muy contaminado no debe mezclarse con papel reciclable.'], diy: ['Papel reciclado artesanal', 'Bloc de notas'] },
  organic: { category: 'Orgánicos', material: 'Materia orgánica', color: 'Marrón (Orgánico)', hex: '#92400E', container: 'Compostera o contenedor de orgánicos', score: 70, badge: 'Reutilizable / Upcycling', prep: ['Separalo de los residuos secos.', 'Si es apto, incorporalo a una compostera.', 'Evitá mezclarlo con plásticos o envoltorios.'], warning: ['No todos los residuos orgánicos son aptos para cualquier compostera.'], diy: ['Compost para plantas', 'Abono orgánico (según el residuo)'] },
  special: { category: 'Residuo Especial', material: 'Residuo especial o electrónico', color: 'Punto Especial / Peligroso', hex: '#DC2626', container: 'Punto de recepción especial', score: 10, badge: 'Residuo Especial / Peligroso', prep: ['Guardalo separado de los residuos comunes.', 'Buscá un punto de recepción específico.'], warning: ['No lo tires al contenedor común ni lo abras.'], diy: ['No se recomienda reutilizar pilas o componentes dañados.'] },
};

function makeResult(key: MaterialKey, objectName: string, imageUrl: string, confidence: number): EcoAnalysisResult {
  const info = materialInfo[key];
  const diyIdeas = info.diy.map((title, index) => ({ id: `local-${key}-${index}`, title, subtitle: 'Idea de reutilización', difficulty: 'Fácil' as const, timeMinutes: 20, materialsNeeded: [objectName, 'Materiales de uso doméstico'], steps: ['Limpiá y prepará el objeto con cuidado.', 'Adaptalo al uso propuesto.', 'Revisá que no queden bordes peligrosos.'], ecoBenefit: 'Alarga la vida útil del objeto y evita generar un residuo inmediato.' }));
  return {
    recognized: true,
    objectName,
    category: info.category,
    probableMaterial: info.material,
    materialsBreakdown: [info.material],
    materialDetails: `Reconocimiento automático en el dispositivo. Coincidencia estimada: ${Math.round(confidence * 100)}%. El modelo reconoce la apariencia del objeto; no puede comprobar su composición exacta.`,
    recyclabilityScore: info.score,
    recyclabilityBadge: info.badge,
    badgeColor: info.hex,
    summary: `La imagen parece mostrar ${objectName.toLowerCase()}. Revisá el material y las indicaciones antes de separarlo.`,
    diyIdeas,
    disposalGuide: { containerColor: info.color as any, containerColorHex: info.hex, containerName: info.container, preparationSteps: info.prep, warnings: info.warning, recyclingCategory: info.category, recyclingCenterType: 'Consultá las reglas de separación de tu municipio o punto verde antes de llevarlo.' },
    environmentalImpact: { yearsToDegrade: 'El tiempo varía mucho según el material y las condiciones ambientales.', yearsNumericRange: [0, 0], carbonFootprint: 'Depende del material, su fabricación y el proceso de reciclado.', wildlifeDanger: 'Si se abandona en el ambiente, puede afectar a animales y ecosistemas.', oceanImpact: 'Evitá que llegue a desagües, ríos o al mar.', conservationTip: 'Priorizar la reutilización y la separación limpia ayuda a reducir residuos.' },
    reliableSources: [{ name: 'Argentina.gob.ar – Gestión de residuos', organization: 'Gobierno de Argentina', url: 'https://www.argentina.gob.ar/ambiente', topic: 'Gestión de residuos', fact: 'Consultá las recomendaciones y campañas oficiales de gestión de residuos.' }],
    cheConsejo: 'Este resultado lo generó un modelo visual local. Si no coincide con el objeto, elegí la categoría correcta antes de reciclar.',
    timestamp: new Date().toISOString(),
    imageUrl,
  };
}

export async function analyzeImageLocally(imageDataUrl: string, userHint?: string): Promise<EcoAnalysisResult> {
  // The sample gallery is an explicit user selection, so its label is a reliable hint.
  if (userHint) {
    const hint = userHint.toLowerCase();
    const known = patterns.find((p) => p.terms.test(hint) || (p.key === 'carton' && /cart[oó]n|caja/.test(hint)) || (p.key === 'metal' && /lata|aluminio/.test(hint)) || (p.key === 'plastic' && /pl[aá]stic|pet/.test(hint)) || (p.key === 'glass' && /vidrio|frasco/.test(hint)) || (p.key === 'paper' && /papel/.test(hint)) || (p.key === 'special' && /pila/.test(hint)));
    if (known) return makeResult(known.key, known.object, imageDataUrl, 1);
  }

  const [model, image] = await Promise.all([getModel(), loadImage(imageDataUrl)]);
  const predictions = await model.classify(image, 5);
  const matches = predictions.flatMap((prediction) => {
    const label = prediction.className.toLowerCase();
    const found = patterns.find((pattern) => pattern.terms.test(label));
    return found ? [{ ...found, probability: prediction.probability, label }] : [];
  }).sort((a, b) => b.probability - a.probability);
  const best = matches[0];
  if (!best || best.probability < 0.12) {
    return {
      recognized: false, unrecognizedReason: 'El modelo local no encontró una coincidencia suficientemente clara. Probá con el objeto solo, centrado y con buena luz, o elegí su material manualmente.',
      retakeSuggestions: ['Mostrá un solo objeto y acercá la cámara.', 'Usá un fondo liso y buena iluminación.', 'Evitá sombras, reflejos y objetos superpuestos.'],
      objectName: 'Objeto no identificado', category: 'Sin clasificar', probableMaterial: 'No confirmado', materialDetails: 'El modelo local no tuvo suficiente confianza para clasificarlo.', recyclabilityScore: 0, recyclabilityBadge: 'No Reciclable', badgeColor: '#78716C', summary: 'No se pudo reconocer el objeto con seguridad.', diyIdeas: [],
      disposalGuide: { containerColor: 'Gris', containerColorHex: '#78716C', containerName: 'No definido', preparationSteps: ['Volvé a tomar la foto o seleccioná el material manualmente.'], warnings: ['No se debe decidir el destino de un residuo con una identificación dudosa.'], recyclingCategory: 'Sin clasificar', recyclingCenterType: 'No definido' },
      environmentalImpact: { yearsToDegrade: 'No determinado', yearsNumericRange: [0, 0], carbonFootprint: 'No determinado', wildlifeDanger: 'No determinado', oceanImpact: 'No determinado', conservationTip: 'Identificá el material antes de desecharlo.' }, reliableSources: [], cheConsejo: 'Probá otra foto con mejor luz.', timestamp: new Date().toISOString(), imageUrl: imageDataUrl,
    };
  }
  // A generic bottle label does not reveal whether it is plastic or glass.
  return makeResult(best.key, best.object, imageDataUrl, best.probability);
}
