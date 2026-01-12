// Global Oil Chokepoints - Strategic maritime passages
// Throughput: Million barrels per day (2023-2024 estimates)

export const chokePoints = [
  {
    id: 'hormuz',
    name: 'Strait of Hormuz',
    throughput: 21.0,
    percentOfGlobal: 21,
    coordinates: [26.5667, 56.2500],
    description: 'Narrow passage between Iran and Oman/UAE. Critical for Persian Gulf exports.',
    vulnerableRoutes: ['Middle East → Asia Pacific', 'Middle East → Europe'],
    affectedExporters: ['SAU', 'IRQ', 'ARE', 'KWT', 'QAT', 'IRN', 'BHR'],
    affectedImporters: ['CHN', 'JPN', 'KOR', 'IND', 'SGP', 'TWN'],
    width: '21 nautical miles at narrowest',
    alternativeRoutes: 'East-West Pipeline (Saudi Arabia), Abu Dhabi Crude Oil Pipeline',
    citation: 'EIA World Oil Transit Chokepoints 2024'
  },
  {
    id: 'malacca',
    name: 'Strait of Malacca',
    throughput: 16.5,
    percentOfGlobal: 16,
    coordinates: [2.5000, 101.5000],
    description: 'Between Malaysia and Indonesia. Primary route for Middle East oil to East Asia.',
    vulnerableRoutes: ['Middle East → China/Japan/Korea', 'Africa → Asia Pacific'],
    affectedExporters: ['SAU', 'IRQ', 'ARE', 'KWT', 'AGO', 'NGA'],
    affectedImporters: ['CHN', 'JPN', 'KOR', 'TWN'],
    width: '1.5 nautical miles at narrowest (Phillips Channel)',
    alternativeRoutes: 'Lombok Strait, Sunda Strait (longer routes)',
    citation: 'EIA World Oil Transit Chokepoints 2024'
  },
  {
    id: 'suez',
    name: 'Suez Canal',
    throughput: 5.5,
    percentOfGlobal: 5.5,
    coordinates: [30.4550, 32.3500],
    description: 'Artificial waterway connecting Mediterranean to Red Sea. Key Europe-Asia route.',
    vulnerableRoutes: ['Middle East → Europe', 'Asia → Europe', 'Russia → Asia'],
    affectedExporters: ['SAU', 'IRQ', 'ARE', 'KWT', 'RUS'],
    affectedImporters: ['DEU', 'FRA', 'ITA', 'ESP', 'NLD', 'GBR'],
    width: '205 meters (673 ft)',
    alternativeRoutes: 'Cape of Good Hope (adds ~15 days)',
    citation: 'Suez Canal Authority, EIA 2024'
  },
  {
    id: 'bab-el-mandeb',
    name: 'Bab el-Mandeb',
    throughput: 4.5,
    percentOfGlobal: 4.5,
    coordinates: [12.5833, 43.3333],
    description: 'Strait between Yemen and Djibouti/Eritrea. Southern gateway to Suez Canal.',
    vulnerableRoutes: ['Middle East → Europe via Suez', 'Persian Gulf → Mediterranean'],
    affectedExporters: ['SAU', 'IRQ', 'ARE', 'KWT'],
    affectedImporters: ['DEU', 'FRA', 'ITA', 'ESP', 'GBR'],
    width: '18 miles',
    alternativeRoutes: 'Cape of Good Hope',
    citation: 'EIA World Oil Transit Chokepoints 2024'
  },
  {
    id: 'turkish',
    name: 'Turkish Straits',
    throughput: 2.4,
    percentOfGlobal: 2.4,
    coordinates: [41.1500, 29.0500],
    description: 'Bosphorus and Dardanelles. Only maritime route for Black Sea/Caspian oil exports.',
    vulnerableRoutes: ['Russia/Kazakhstan/Azerbaijan → Mediterranean', 'Caspian → Europe'],
    affectedExporters: ['RUS', 'KAZ', 'AZE'],
    affectedImporters: ['ITA', 'ESP', 'FRA', 'GBR'],
    width: '0.4 miles at narrowest (Bosphorus)',
    alternativeRoutes: 'BTC Pipeline (Azerbaijan-Turkey), CPC Pipeline (Kazakhstan)',
    citation: 'EIA World Oil Transit Chokepoints 2024'
  },
  {
    id: 'panama',
    name: 'Panama Canal',
    throughput: 0.9,
    percentOfGlobal: 0.9,
    coordinates: [9.0800, -79.6800],
    description: 'Connects Atlantic and Pacific. Important for US Gulf exports to Asia.',
    vulnerableRoutes: ['US Gulf Coast → Asia Pacific', 'Venezuela → Asia Pacific'],
    affectedExporters: ['USA', 'VEN', 'COL', 'ECU'],
    affectedImporters: ['CHN', 'JPN', 'KOR'],
    width: 'Lock chambers: 110 ft (old), 180 ft (new)',
    alternativeRoutes: 'Cape Horn, US transcontinental pipelines',
    citation: 'Panama Canal Authority, EIA 2024'
  },
  {
    id: 'cape',
    name: 'Cape of Good Hope',
    throughput: 6.0,
    percentOfGlobal: 6,
    coordinates: [-34.3500, 18.4700],
    description: 'Alternative route around Africa. Used when Suez/Bab el-Mandeb disrupted.',
    vulnerableRoutes: ['Middle East → Americas', 'West Africa → Asia Pacific'],
    affectedExporters: ['AGO', 'NGA', 'SAU'],
    affectedImporters: ['USA', 'BRA', 'CHN'],
    width: 'Open ocean - not a chokepoint but strategic waypoint',
    alternativeRoutes: 'Suez Canal route',
    citation: 'EIA World Oil Transit Chokepoints 2024'
  },
  {
    id: 'danish',
    name: 'Danish Straits',
    throughput: 3.2,
    percentOfGlobal: 3.2,
    coordinates: [55.8000, 11.0000],
    description: 'Passages connecting Baltic Sea to North Sea. Key for Russian Baltic exports.',
    vulnerableRoutes: ['Russia Baltic → Northern Europe', 'Russia → Global markets'],
    affectedExporters: ['RUS'],
    affectedImporters: ['DEU', 'NLD', 'GBR', 'POL'],
    width: '4 nautical miles (Great Belt)',
    alternativeRoutes: 'Druzhba Pipeline, Nord Stream (gas)',
    citation: 'EIA World Oil Transit Chokepoints 2024'
  }
];

// Get chokepoint by ID
export const getChokePoint = (id) => chokePoints.find(cp => cp.id === id);

// Get chokepoints affecting a country
export const getChokePointsAffecting = (countryCode) => {
  return chokePoints.filter(cp =>
    cp.affectedImporters.includes(countryCode) ||
    cp.affectedExporters.includes(countryCode)
  );
};

// Get total oil flowing through chokepoints
export const getTotalChokepointThroughput = () => {
  // Note: Some oil flows through multiple chokepoints, so this isn't additive
  return chokePoints.reduce((sum, cp) => sum + cp.throughput, 0);
};
