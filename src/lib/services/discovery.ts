import prisma from "@/lib/prisma";

export interface BusinessLead {
  businessName: string;
  category?: string;
  webUrl?: string;
  phone?: string;
  address?: string;
  mapsLink?: string;
  rating?: number;
  reviewCount?: number;
  source: string;
  isClaimed?: boolean;
  hasGmbPhotos?: boolean;
  isGmbOptimized?: boolean;
  hasLowRating?: boolean;
}

export async function discoverLeads(
  niche: string,
  location: string,
  count: number
): Promise<BusinessLead[]> {
  const serpApiKey = process.env.SERPAPI_API_KEY;
  const googleApiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (serpApiKey) {
    return await discoverViaSerpApi(niche, location, count);
  } else if (googleApiKey) {
    return await discoverViaGooglePlaces(niche, location, count);
  } else {
    console.log("No Discovery API Key found. Using Mock Data.");
    return generateMockLeads(niche, location, count);
  }
}

async function discoverViaSerpApi(niche: string, location: string, count: number): Promise<BusinessLead[]> {
  // TODO: Implement SerpApi Google Local Search logic
  // For now, falling back to mock
  return generateMockLeads(niche, location, count);
}

async function discoverViaGooglePlaces(niche: string, location: string, count: number): Promise<BusinessLead[]> {
  // TODO: Implement Google Places API logic
  return generateMockLeads(niche, location, count);
}

function generateMockLeads(niche: string, location: string, count: number): BusinessLead[] {
  const leads: BusinessLead[] = [];
  const suffixes = ["Solutions", "Pros", "Agency", "Group", "Services", "Experts"];
  
  for (let i = 1; i <= count; i++) {
    const businessName = `${niche.charAt(0).toUpperCase() + niche.slice(1)} ${suffixes[i % suffixes.length]} ${i}`;
    const rating = (i % 5 === 0) ? 2.1 : 3.5 + (Math.random() * 1.5);
    const hasWebsite = (i % 7 !== 0);

    leads.push({
      businessName,
      category: niche,
      webUrl: hasWebsite ? `https://example-business-${i}.com` : undefined,
      phone: `+1-555-010${i}`,
      address: `${100 + i} Main St, ${location}`,
      mapsLink: `https://maps.google.com/?q=${encodeURIComponent(businessName + " " + location)}`,
      rating,
      reviewCount: Math.floor(Math.random() * 100),
      source: "Mock Discovery",
      isClaimed: i % 10 !== 0,
      hasGmbPhotos: i % 4 !== 0,
      isGmbOptimized: i % 3 === 0,
      hasLowRating: rating < 3.5,
    });
  }
  
  return leads;
}
