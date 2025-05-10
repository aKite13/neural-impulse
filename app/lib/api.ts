export function getApiUrl(path: string) {
  // Для клиентских запросов (относительный путь)
  if (typeof window !== 'undefined') return path;
  
  // Для серверных запросов (абсолютный URL)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  return `${baseUrl}${path}`;
}