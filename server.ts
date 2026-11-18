import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT =
  process.env.NODE_ENV === 'production' && process.env.PORT
    ? parseInt(process.env.PORT, 10)
    : 3000;

// Middleware for parsing large base64 image payloads
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Shared Gemini client instance
const geminiApiKey = process.env.GEMINI_API_KEY?.trim();
let ai: GoogleGenAI | null = null;
if (geminiApiKey) {
  ai = new GoogleGenAI({
    apiKey: geminiApiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Recycling points catalog strictly for San Luis Capital, San Luis, Argentina
const GREEN_POINTS = [
  {
    id: "sl-cav-domeniconi",
    name: "CAV Alberto Domeniconi (Puesto Fijo de Ecocanje)",
    address: "Av. España y Calle Francia (Ex Terminal)",
    neighborhood: "Centro / Barrio República",
    city: "San Luis Capital",
    distanceKm: 0.6,
    acceptedMaterials: ["Plásticos (botellas PET, tapitas, envases)", "Papel y Cartón secos y limpios", "Vidrio (botellas y frascos enteros)", "Latas de aluminio y conservas", "Pilas y baterías en desuso"],
    schedule: "Lunes a Viernes: 08:30 a 12:30 hs",
    phone: "0800-6666-751 (Muni San Luis)",
    coordinates: { lat: -33.298, lng: -66.335 }
  },
  {
    id: "sl-parque-naciones",
    name: "Punto Verde Parque de las Naciones",
    address: "Av. Riobamba 1537 y Calle La Pampa (Ingreso Estacionamiento)",
    neighborhood: "Parque de las Naciones",
    city: "San Luis Capital",
    distanceKm: 1.2,
    acceptedMaterials: ["Plásticos (PET y polietileno)", "Cartón y Papel", "Aluminio y Hojalata", "Vidrio limpio"],
    schedule: "Lunes a Domingo: 08:00 a 20:00 hs",
    phone: "147",
    coordinates: { lat: -33.287, lng: -66.326 }
  },
  {
    id: "sl-cav-rawson",
    name: "CAV Rawson (Punto Verde y Ecocanje)",
    address: "Balcarce 2074",
    neighborhood: "Barrio Rawson",
    city: "San Luis Capital",
    distanceKm: 1.8,
    acceptedMaterials: ["Plásticos", "Cartón y Papel", "Metales (latas de bebida y alimentos)", "Vidrio"],
    schedule: "Lunes a Viernes: 08:00 a 14:00 hs (Miércoles Ecocanje)",
    phone: "0800-6666-751",
    coordinates: { lat: -33.312, lng: -66.339 }
  },
  {
    id: "sl-cav-jardin",
    name: "CAV Jardín San Luis (Punto Verde Comunal)",
    address: "Av. Franco Pastore 2874",
    neighborhood: "Barrio Jardín San Luis",
    city: "San Luis Capital",
    distanceKm: 2.4,
    acceptedMaterials: ["Plásticos y botellas descartables", "Cartón y Papel limpio", "Latas de aluminio", "Vidrio"],
    schedule: "Lunes a Viernes: 08:00 a 14:00 hs (Lunes Ecocanje)",
    phone: "147",
    coordinates: { lat: -33.278, lng: -66.342 }
  },
  {
    id: "sl-cav-tercera-rotonda",
    name: "CAV Tercera Rotonda (Punto de Acopio Diferenciado)",
    address: "Ruta Provincial N° 3 y 3ra. Rotonda",
    neighborhood: "Zona Norte / Tercera Rotonda",
    city: "San Luis Capital",
    distanceKm: 3.5,
    acceptedMaterials: ["Plásticos y tapitas", "Papel y Cartón", "Metales y latas", "Vidrio clasificado"],
    schedule: "Lunes a Viernes: 08:00 a 14:00 hs (Martes Ecocanje)",
    phone: "0800-6666-751",
    coordinates: { lat: -33.265, lng: -66.338 }
  },
  {
    id: "sl-cav-jose-hernandez",
    name: "CAV José Hernández (Recepción de Reciclables Secos)",
    address: "Esteban Adaro 1500 (esquina Av. Lafinur)",
    neighborhood: "Barrio José Hernández",
    city: "San Luis Capital",
    distanceKm: 2.1,
    acceptedMaterials: ["Plásticos", "Papel y Cartón", "Metales reciclables", "Envases de vidrio"],
    schedule: "Lunes a Viernes: 08:00 a 14:00 hs (Viernes Ecocanje)",
    phone: "147",
    coordinates: { lat: -33.284, lng: -66.353 }
  },
  {
    id: "sl-cav-felix-bogado",
    name: "CAV Félix Bogado (Punto de Recepción Vecinal)",
    address: "Hilario Ascasubi 830 (esquina Maximiliano López)",
    neighborhood: "Barrio Félix Bogado (Zona Sur)",
    city: "San Luis Capital",
    distanceKm: 3.8,
    acceptedMaterials: ["Plásticos", "Cartón y Papel", "Aluminio y latas", "Vidrio"],
    schedule: "Lunes a Viernes: 08:00 a 14:00 hs (Viernes Ecocanje)",
    phone: "147",
    coordinates: { lat: -33.325, lng: -66.348 }
  },
  {
    id: "sl-cdf-planta",
    name: "Planta de Tratamiento y Reciclado CDF San Luis",
    address: "Predio Centro de Disposición Final Municipal (Acceso Ruta Provincial 3 Sur)",
    neighborhood: "Zona Periurbana Sur",
    city: "San Luis Capital",
    distanceKm: 7.2,
    acceptedMaterials: ["Recepción masiva de secos clasificados", "Fardos de cartón y plásticos", "Metales ferrosos y no ferrosos", "Neumáticos fuera de uso (NFU) - Sujeto a verificación de campañas"],
    schedule: "Lunes a Viernes: 07:00 a 15:00 hs",
    phone: "0800-6666-751",
    coordinates: { lat: -33.355, lng: -66.360 }
  }
];

// Diagnostic endpoint: never exposes the API key, only whether it is configured.
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    aiConfigured: Boolean(geminiApiKey),
    model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
  });
});

// Endpoint: Nearby Green Points
app.get('/api/green-points', (req: Request, res: Response) => {
  const material = req.query.material as string | undefined;
  if (!material) {
    return res.json(GREEN_POINTS);
  }
  const normalize = (value: string) => value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
  const requestedMaterial = normalize(material);
  const filtered = GREEN_POINTS.filter((point) =>
    point.acceptedMaterials.some((accepted) => {
      const normalizedAccepted = normalize(accepted);
      return normalizedAccepted.includes(requestedMaterial) || requestedMaterial.includes(normalizedAccepted);
    })
  );
  // An empty result is meaningful: never recommend unrelated points as a fallback.
  return res.json(filtered);
});

// Endpoint: AI object analysis with Gemini vision
app.post('/api/analyze', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType: bodyMimeType, userHint } = req.body;

    if (!imageBase64 || typeof imageBase64 !== 'string') {
      return res.status(400).json({ error: 'Falta la imagen para analizar.' });
    }

    if (!ai) {
      return res.status(503).json({
        error: 'El servicio de análisis visual con IA no está configurado (falta GEMINI_API_KEY).',
        code: 'MISSING_API_KEY',
      });
    }

    let resolvedMimeType = typeof bodyMimeType === 'string' && bodyMimeType ? bodyMimeType : 'image/jpeg';
    let cleanBase64 = imageBase64;

    const dataUrlMatch = imageBase64.match(/^data:([^;]+);base64,(.+)$/);
    if (dataUrlMatch) {
      resolvedMimeType = dataUrlMatch[1];
      cleanBase64 = dataUrlMatch[2];
    } else if (imageBase64.startsWith('data:')) {
      return res.status(400).json({
        error: 'El formato de la imagen no es compatible. Intentá con una foto JPG o PNG.',
        code: 'UNSUPPORTED_IMAGE_FORMAT',
      });
    }

    const confirmedPointsSummary = GREEN_POINTS.map(
      (p) => `- ${p.name} (${p.address}, San Luis Capital): recibe ${p.acceptedMaterials.join(', ')}`
    ).join('\n');

    const systemPrompt = `Sos el motor de análisis visual de 'Che Planeta', una app ecológica de San Luis Capital, Argentina.
Tu tarea es observar CON PRECISIÓN la fotografía enviada por el usuario e identificar EXCLUSIVAMENTE el objeto real visible en esa imagen.

REGLAS ESTRICTAS DE HONESTIDAD Y PRECISIÓN:
1. Analizá visualmente la imagen real. La fotografía es la fuente principal y obligatoria de identificación; NO reutilices el resultado de análisis anteriores ni supongas que el objeto es una botella.
   - Diferenciá cuidadosamente la forma y textura: una caja suele tener caras planas, esquinas y pliegues de cartón; una botella tiene cuerpo hueco, cuello y boca. No confundas una caja de cartón con una botella plástica.
   - No permitas que el contexto, el nombre de una muestra o un ejemplo cambie lo que realmente se ve en la fotografía.
   - Cada objeto distinto (botella plástica, lata de aluminio, caja de cartón, frasco de vidrio, pila, papel, envase tetra pak, residuo orgánico, prenda, aparato electrónico, etc.) DEBE recibir un resultado específico y adaptado a ese objeto exacto.
2. Si la foto está borrosa, muy oscura, vacía, muestra solo una pared/paisaje/persona sin un objeto o residuo identificable, o NO podés reconocer con seguridad qué objeto o material es:
   - Respondé con "recognized": false.
   - NO inventes ni adivines un objeto o material.
   - Explicá con amabilidad en "unrecognizedReason" por qué no se pudo identificar (ej. "La imagen salió un poco borrosa o oscura y no distinguimos con claridad el objeto.") y da 3 consejos claros en "retakeSuggestions".
3. Si "recognized" es true:
   - Indicá "objectName" específico y claro en español rioplatense.
   - Indicá "probableMaterial" y, si el objeto combina partes (ej. botella PET + tapa de polipropileno + etiqueta, o frasco de vidrio + tapa metálica), detallalas en "materialsBreakdown".
   - Dá al menos 2 ideas creativas de manualidades/reutilización (diyIdeas) adaptadas específicamente a ESE objeto (por ej. maceta/organizador para botella, portalápices/farolito para lata, organizador/caja decorativa para cartón).
   - Dá instrucciones reales de separación/preparación y advertencias en "disposalGuide".
   - Para lugares de reciclaje ("disposalGuide.recyclingCenterType"), usá EXCLUSIVAMENTE los puntos verdes confirmados de San Luis Capital listados abajo si reciben ese material. NUNCA inventes direcciones ni materiales aceptados. Si ningún punto listado confirma recibir ese material (ej. residuos orgánicos, electrónicos complejos, sanitarios), indicá con claridad que no hay un punto verde municipal confirmado para ese material y sugerí verificar campañas municipales o disposición responsable.
   - Incluí datos breves y rigurosos en "environmentalImpact" y fuentes verificables reales en "reliableSources".

PUNTOS VERDES CONFIRMADOS EN SAN LUIS CAPITAL, ARGENTINA:
${confirmedPointsSummary}`;

    const contents = [
      {
        role: 'user',
        parts: [
          {
            inlineData: {
              mimeType: resolvedMimeType,
              data: cleanBase64,
            },
          },
          {
            text: `IDENTIFICÁ EL OBJETO MIRANDO LA IMAGEN ADJUNTA; no uses respuestas predeterminadas ni supongas que es una botella. La fotografía tiene prioridad sobre cualquier texto. ${userHint ? `Pista opcional del usuario: "${userHint}". Usala solo como contexto, nunca para contradecir lo visible.` : ''} Si lográs identificar el objeto con claridad, completá el análisis personalizado completo. Si está borrosa o no se distingue un objeto/residuo identificable, marcá recognized=false sin inventar datos.`
          }
        ],
      },
    ];

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        recognized: { type: Type.BOOLEAN },
        unrecognizedReason: { type: Type.STRING },
        retakeSuggestions: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        objectName: { type: Type.STRING },
        category: { type: Type.STRING },
        probableMaterial: { type: Type.STRING },
        materialsBreakdown: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        materialDetails: { type: Type.STRING },
        recyclabilityScore: { type: Type.INTEGER },
        recyclabilityBadge: { type: Type.STRING },
        badgeColor: { type: Type.STRING },
        summary: { type: Type.STRING },
        diyIdeas: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              subtitle: { type: Type.STRING },
              difficulty: { type: Type.STRING },
              timeMinutes: { type: Type.INTEGER },
              materialsNeeded: { type: Type.ARRAY, items: { type: Type.STRING } },
              steps: { type: Type.ARRAY, items: { type: Type.STRING } },
              ecoBenefit: { type: Type.STRING },
            },
            required: ['id', 'title', 'subtitle', 'difficulty', 'timeMinutes', 'materialsNeeded', 'steps', 'ecoBenefit'],
          },
        },
        disposalGuide: {
          type: Type.OBJECT,
          properties: {
            containerColor: { type: Type.STRING },
            containerColorHex: { type: Type.STRING },
            containerName: { type: Type.STRING },
            preparationSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
            warnings: { type: Type.ARRAY, items: { type: Type.STRING } },
            recyclingCategory: { type: Type.STRING },
            recyclingCenterType: { type: Type.STRING },
          },
          required: ['containerColor', 'containerColorHex', 'containerName', 'preparationSteps', 'warnings', 'recyclingCategory', 'recyclingCenterType'],
        },
        environmentalImpact: {
          type: Type.OBJECT,
          properties: {
            yearsToDegrade: { type: Type.STRING },
            yearsNumericRange: { type: Type.ARRAY, items: { type: Type.INTEGER } },
            carbonFootprint: { type: Type.STRING },
            wildlifeDanger: { type: Type.STRING },
            oceanImpact: { type: Type.STRING },
            conservationTip: { type: Type.STRING },
          },
          required: ['yearsToDegrade', 'yearsNumericRange', 'carbonFootprint', 'wildlifeDanger', 'oceanImpact', 'conservationTip'],
        },
        reliableSources: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              organization: { type: Type.STRING },
              url: { type: Type.STRING },
              topic: { type: Type.STRING },
              fact: { type: Type.STRING },
            },
            required: ['name', 'organization', 'url', 'topic', 'fact'],
          },
        },
        cheConsejo: { type: Type.STRING },
      },
      required: ['recognized', 'objectName', 'category', 'probableMaterial', 'materialDetails', 'recyclabilityScore', 'recyclabilityBadge', 'badgeColor', 'summary', 'diyIdeas', 'disposalGuide', 'environmentalImpact', 'reliableSources', 'cheConsejo'],
    };

    const callModelWithRetry = async () => {
      // Use a generally available Gemini model with image understanding.
      // The model can be overridden in Vercel with GEMINI_MODEL if needed.
      const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
      const attempts: { model: string; waitMs: number }[] = [
        { model, waitMs: 500 },
        { model, waitMs: 0 },
      ];

      let lastErr: any;
      for (const attempt of attempts) {
        try {
          return await ai!.models.generateContent({
            model: attempt.model,
            contents,
            config: {
              systemInstruction: systemPrompt,
              responseMimeType: 'application/json',
              responseSchema,
            },
          });
        } catch (err: any) {
          lastErr = err;
          const status = err?.status;
          const isTransient = status === 503 || status === 429 || status === 500 || status === 502 || status === 504;
          console.warn(`Intento con ${attempt.model} falló (${status || 'error'}):`, err?.message);
          if (!isTransient) {
            throw err;
          }
          if (attempt.waitMs > 0) {
            await new Promise((r) => setTimeout(r, attempt.waitMs));
          }
        }
      }
      throw lastErr;
    };

    const response = await callModelWithRetry();

    const responseText = response.text;
    if (!responseText) {
      throw new Error('El modelo de IA no devolvió una respuesta válida.');
    }

    let parsedResult: any;
    try {
      parsedResult = JSON.parse(responseText);
    } catch {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedResult = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No se pudo interpretar la respuesta estructurada de la IA.');
      }
    }

    const fullResult = {
      ...parsedResult,
      recognized: parsedResult.recognized === true,
      timestamp: new Date().toISOString(),
      imageUrl: imageBase64,
    };

    return res.json(fullResult);
  } catch (error: any) {
    console.error('Error en /api/analyze:', error);
    const statusCode = typeof error?.status === 'number' ? error.status : 502;
    let friendlyError = 'No pudimos completar el análisis de la fotografía con la IA. Intentá nuevamente en unos segundos.';

    let errorCode = 'AI_ANALYSIS_ERROR';
    if (statusCode === 503) {
      friendlyError = 'Gemini está temporalmente sobrecargado. Esperá unos segundos y volvé a intentarlo.';
      errorCode = 'GEMINI_UNAVAILABLE';
    } else if (statusCode === 429) {
      friendlyError = 'Se alcanzó el límite de consultas de Gemini. Revisá las cuotas de tu proyecto de Google AI Studio.';
      errorCode = 'GEMINI_QUOTA';
    } else if (statusCode === 401 || statusCode === 403) {
      friendlyError = 'Gemini rechazó la API Key o el acceso al modelo. Revisá GEMINI_API_KEY en Vercel y que la clave sea válida.';
      errorCode = 'GEMINI_AUTH';
    } else if (statusCode === 404) {
      friendlyError = 'Gemini no encontró el modelo configurado. Configurá GEMINI_MODEL como gemini-2.5-flash en Vercel.';
      errorCode = 'GEMINI_MODEL_NOT_FOUND';
    } else if (statusCode === 400) {
      friendlyError = 'Gemini rechazó la imagen o el formato enviado. Probá con una foto JPG o PNG.';
      errorCode = 'GEMINI_BAD_REQUEST';
    } else if (statusCode === 413) {
      friendlyError = 'La foto es demasiado grande para enviarla. Probá con una imagen más pequeña.';
      errorCode = 'IMAGE_TOO_LARGE';
    }

    return res.status(statusCode >= 400 && statusCode < 600 ? statusCode : 502).json({
      error: friendlyError,
      code: errorCode,
    });
  }
});

// Export the Express app for Vercel's serverless function.
export default app;

// Local development only. Vercel imports the app and manages the request lifecycle.
async function startServer() {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌿 Che Planeta server running on http://0.0.0.0:${PORT}`);
  });
}

if (process.env.VERCEL !== '1') {
  startServer();
}
