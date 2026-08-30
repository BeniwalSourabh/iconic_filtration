import { NextRequest, NextResponse } from "next/server";
import { City, Country, State } from "country-state-city";

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function score(query: string, candidate: string) {
  const normalizedQuery = normalize(query);
  const normalizedCandidate = normalize(candidate);

  if (!normalizedQuery) {
    return 1;
  }

  if (normalizedCandidate.startsWith(normalizedQuery)) {
    return 1000 - normalizedCandidate.length;
  }

  if (normalizedCandidate.includes(normalizedQuery)) {
    return 700 - normalizedCandidate.length;
  }

  return 0;
}

function filterByQuery<T extends { name: string }>(items: T[], query: string, limit = 40) {
  return items
    .map((item) => ({ item, score: score(query, item.name) }))
    .filter(({ score: itemScore }) => itemScore > 0)
    .sort((left, right) => right.score - left.score || left.item.name.localeCompare(right.item.name))
    .slice(0, limit)
    .map(({ item }) => item);
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get("type");
  const query = searchParams.get("q")?.trim() ?? "";
  const countryCode = searchParams.get("country")?.trim().toUpperCase() ?? "";
  const stateCode = searchParams.get("state")?.trim() ?? "";

  if (type === "countries") {
    const countries = filterByQuery(Country.getAllCountries(), query, query ? 40 : 300).map((country) => ({
      name: country.name,
      isoCode: country.isoCode,
      flag: country.flag,
      phoneCode: country.phonecode.startsWith("+") ? country.phonecode : `+${country.phonecode}`,
    }));

    return NextResponse.json({ items: countries });
  }

  if (type === "states" && countryCode) {
    const states = filterByQuery(State.getStatesOfCountry(countryCode), query, query ? 40 : 300).map((state) => ({
      name: state.name,
      isoCode: state.isoCode,
      countryCode: state.countryCode,
    }));

    return NextResponse.json({ items: states });
  }

  if (type === "cities" && countryCode && stateCode) {
    const cities = filterByQuery(City.getCitiesOfState(countryCode, stateCode), query, query ? 40 : 5000).map((city) => ({
      name: city.name,
      countryCode: city.countryCode,
      stateCode: city.stateCode,
    }));

    return NextResponse.json({ items: cities });
  }

  return NextResponse.json({ items: [] });
}
