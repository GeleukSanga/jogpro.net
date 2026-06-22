import { NextRequest } from "next/server";

const BASE = "https://emsifa.github.io/api-wilayah-indonesia/api";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  const path = Array.isArray(slug) ? slug.join("/") : slug;
  const url = `${BASE}/${path}.json`;

  try {
    const res = await fetch(url, { next: { revalidate: 86400 } });
    if (!res.ok) return Response.json([]);
    return Response.json(await res.json());
  } catch {
    return Response.json([]);
  }
}
