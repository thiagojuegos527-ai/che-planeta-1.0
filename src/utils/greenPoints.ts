import { GreenPoint } from '../types/chePlaneta';

/**
 * Puntos Verdes y Centros de Recepción de Residuos Reciclables
 * Exclusivamente para la Ciudad de San Luis (Capital), Provincia de San Luis, Argentina.
 * Basado en los Centros de Atención al Vecino (CAV), puestos de Ecocanje y puntos limpios
 * municipales confirmados por la Municipalidad de San Luis.
 */
export const LOCAL_GREEN_POINTS: GreenPoint[] = [
  {
    id: "sl-cav-domeniconi",
    name: "CAV Alberto Domeniconi (Puesto Fijo de Ecocanje)",
    address: "Av. España y Calle Francia (Ex Terminal)",
    neighborhood: "Centro / Barrio República",
    city: "San Luis Capital",
    distanceKm: 0.6,
    acceptedMaterials: [
      "Plásticos (botellas PET, tapitas, envases)",
      "Papel y Cartón secos y limpios",
      "Vidrio (botellas y frascos enteros)",
      "Latas de aluminio y conservas",
      "Pilas y baterías en desuso"
    ],
    schedule: "Lunes a Viernes: 08:30 a 12:30 hs (Puesto de Ecocanje y Punto Verde permanente)",
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
    acceptedMaterials: [
      "Plásticos (PET y polietileno)",
      "Cartón y Papel",
      "Aluminio y Hojalata",
      "Vidrio limpio"
    ],
    schedule: "Lunes a Domingo: 08:00 a 20:00 hs (Contenedores de depósito diferenciado)",
    phone: "147 / Centro de Atención Vecinal",
    coordinates: { lat: -33.287, lng: -66.326 }
  },
  {
    id: "sl-cav-rawson",
    name: "CAV Rawson (Punto Verde y Ecocanje)",
    address: "Balcarce 2074",
    neighborhood: "Barrio Rawson",
    city: "San Luis Capital",
    distanceKm: 1.8,
    acceptedMaterials: [
      "Plásticos",
      "Cartón y Papel",
      "Metales (latas de bebida y alimentos)",
      "Vidrio"
    ],
    schedule: "Lunes a Viernes: 08:00 a 14:00 hs (Miércoles: jornada de Ecocanje barrial)",
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
    acceptedMaterials: [
      "Plásticos y botellas descartables",
      "Cartón y Papel limpio",
      "Latas de aluminio",
      "Vidrio"
    ],
    schedule: "Lunes a Viernes: 08:00 a 14:00 hs (Lunes: jornada de Ecocanje barrial)",
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
    acceptedMaterials: [
      "Plásticos y tapitas",
      "Papel y Cartón",
      "Metales y latas",
      "Vidrio clasificado"
    ],
    schedule: "Lunes a Viernes: 08:00 a 14:00 hs (Martes: jornada de Ecocanje)",
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
    acceptedMaterials: [
      "Plásticos",
      "Papel y Cartón",
      "Metales reciclables",
      "Envases de vidrio"
    ],
    schedule: "Lunes a Viernes: 08:00 a 14:00 hs (Viernes: jornada de Ecocanje)",
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
    acceptedMaterials: [
      "Plásticos",
      "Cartón y Papel",
      "Aluminio y latas",
      "Vidrio"
    ],
    schedule: "Lunes a Viernes: 08:00 a 14:00 hs (Viernes: jornada de Ecocanje)",
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
    acceptedMaterials: [
      "Recepción masiva de secos clasificados",
      "Fardos de cartón y plásticos",
      "Metales ferrosos y no ferrosos",
      "Neumáticos fuera de uso (NFU) - *Sujeto a verificación de campañas*"
    ],
    schedule: "Lunes a Viernes: 07:00 a 15:00 hs (Planta industrial de separación y compactación)",
    phone: "0800-6666-751",
    coordinates: { lat: -33.355, lng: -66.360 }
  }
];
