import { getLLMText, strawberrySource, djangoSource } from '@/lib/source';

export const revalidate = false;

export async function GET() {
  const strawberryPages = strawberrySource.getPages().map(getLLMText);
  const djangoPages = djangoSource.getPages().map(getLLMText);
  const scanned = await Promise.all([...strawberryPages, ...djangoPages]);

  return new Response(scanned.join('\n\n'));
}
