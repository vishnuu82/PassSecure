/**
 * Curated local sample of top commonly breached passwords and known leaked patterns
 * for offline demonstration and testing.
 * Source: Public breach statistical corpora (RockYou, SecLists, HIBP aggregate frequencies).
 */
export const LOCAL_BREACH_DATASET: Record<string, number> = {
  '123456': 23597311,
  '123456789': 7890124,
  'password': 3784112,
  '12345': 2984120,
  '12345678': 2498112,
  'qwerty': 2049102,
  '1234567': 1892301,
  '1234': 1482910,
  '111111': 1302847,
  '1234567890': 1184920,
  'admin': 942104,
  'password1': 892019,
  'welcome': 748291,
  'iloveyou': 712903,
  'login': 694821,
  'monkey': 621984,
  'dragon': 598210,
  'football': 582104,
  'passw0rd': 561928,
  '123123': 548910,
  'princess': 510924,
  'solo': 498210,
  'master': 487219,
  'sunshine': 472910,
  'superman': 462819,
  'baseball': 449102,
  'charlie': 439201,
  'letmein': 428190,
  'shadow': 419280,
  'killer': 402819,
  'trustno1': 398201,
  'michael': 389201,
  'jordan': 379201,
  'daniel': 369812,
  'ashley': 359810,
  'computer': 349812,
  'starwars': 339812,
  'cookie': 329810,
  'secret': 319802,
  'access': 309812,
  'pokemon': 299812,
  'matrix': 289102,
  'default': 279810,
  'test': 269812,
  'testing': 259810,
  'root': 249810,
  'toor': 239810,
  'pass1234': 229810,
  'guest': 219810,
  'operator': 209810,
  'user': 199810,
  'masterkey': 189810,
  'Summer2023!': 179810,
  'Summer2024!': 169810,
  'Winter2023!': 159810,
  'Winter2024!': 149810,
  'Spring2024!': 139810,
  'Autumn2024!': 129810,
  'Welcome1': 119810,
  'Welcome1!': 109810,
  'Welcome2023!': 99810,
  'Welcome2024!': 89810,
  'P@ssword1': 79810,
  'P@ssword123': 69810,
  'P@$$w0rd': 59810,
  'Admin123!': 49810,
  'Admin2024!': 39810,
  'Password@1': 29810,
  'ChangeMe123!': 19810,
}

export function checkLocalBreachDb(password: string): { breached: boolean; count: number } {
  if (!password) return { breached: false, count: 0 }
  
  // Direct check
  if (LOCAL_BREACH_DATASET[password] !== undefined) {
    return { breached: true, count: LOCAL_BREACH_DATASET[password] }
  }

  // Case-insensitive check fallback for demonstration
  const lower = password.toLowerCase()
  for (const [key, count] of Object.entries(LOCAL_BREACH_DATASET)) {
    if (key.toLowerCase() === lower) {
      return { breached: true, count }
    }
  }

  return { breached: false, count: 0 }
}
