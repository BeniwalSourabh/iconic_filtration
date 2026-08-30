export type QuoteCountryOption = {
  name: string;
  iso2: "IN" | "AE" | "US" | "GB" | "SA" | "QA" | "OM" | "KW" | "SG" | "NP" | "BD" | "LK";
  dialCode: string;
  localLengths: number[];
  states: string[];
  cities: string[];
};

export const quoteCountryOptions: QuoteCountryOption[] = [
  {
    name: "India",
    iso2: "IN",
    dialCode: "+91",
    localLengths: [10],
    states: [
      "Andhra Pradesh",
      "Arunachal Pradesh",
      "Assam",
      "Bihar",
      "Chhattisgarh",
      "Delhi",
      "Goa",
      "Gujarat",
      "Haryana",
      "Himachal Pradesh",
      "Jharkhand",
      "Karnataka",
      "Kerala",
      "Madhya Pradesh",
      "Maharashtra",
      "Odisha",
      "Punjab",
      "Rajasthan",
      "Tamil Nadu",
      "Telangana",
      "Uttar Pradesh",
      "Uttarakhand",
      "West Bengal",
    ],
    cities: [
      "Ahmedabad",
      "Bengaluru",
      "Bhopal",
      "Chandigarh",
      "Chennai",
      "Delhi",
      "Faridabad",
      "Ghaziabad",
      "Gurugram",
      "Hyderabad",
      "Indore",
      "Jaipur",
      "Kolkata",
      "Lucknow",
      "Mumbai",
      "Noida",
      "Pune",
      "Surat",
      "Vadodara",
    ],
  },
  {
    name: "United Arab Emirates",
    iso2: "AE",
    dialCode: "+971",
    localLengths: [9],
    states: ["Abu Dhabi", "Ajman", "Dubai", "Fujairah", "Ras Al Khaimah", "Sharjah", "Umm Al Quwain"],
    cities: ["Abu Dhabi", "Dubai", "Sharjah", "Ajman", "Al Ain"],
  },
  {
    name: "United States",
    iso2: "US",
    dialCode: "+1",
    localLengths: [10],
    states: ["California", "Florida", "New Jersey", "New York", "Texas"],
    cities: ["Chicago", "Dallas", "Houston", "Los Angeles", "New York"],
  },
  {
    name: "United Kingdom",
    iso2: "GB",
    dialCode: "+44",
    localLengths: [10],
    states: ["England", "Northern Ireland", "Scotland", "Wales"],
    cities: ["Birmingham", "London", "Manchester"],
  },
  {
    name: "Saudi Arabia",
    iso2: "SA",
    dialCode: "+966",
    localLengths: [9],
    states: ["Eastern Province", "Makkah", "Madinah", "Riyadh"],
    cities: ["Dammam", "Jeddah", "Riyadh"],
  },
  {
    name: "Qatar",
    iso2: "QA",
    dialCode: "+974",
    localLengths: [8],
    states: ["Doha", "Al Rayyan", "Al Wakrah"],
    cities: ["Doha", "Al Rayyan", "Al Wakrah"],
  },
  {
    name: "Oman",
    iso2: "OM",
    dialCode: "+968",
    localLengths: [8],
    states: ["Muscat", "Dhofar", "Al Batinah"],
    cities: ["Muscat", "Salalah", "Sohar"],
  },
  {
    name: "Kuwait",
    iso2: "KW",
    dialCode: "+965",
    localLengths: [8],
    states: ["Capital", "Hawalli", "Farwaniya"],
    cities: ["Kuwait City", "Hawalli", "Farwaniya"],
  },
  {
    name: "Singapore",
    iso2: "SG",
    dialCode: "+65",
    localLengths: [8],
    states: ["Singapore"],
    cities: ["Singapore"],
  },
  {
    name: "Nepal",
    iso2: "NP",
    dialCode: "+977",
    localLengths: [10],
    states: ["Bagmati", "Gandaki", "Koshi", "Lumbini"],
    cities: ["Kathmandu", "Pokhara", "Biratnagar"],
  },
  {
    name: "Bangladesh",
    iso2: "BD",
    dialCode: "+880",
    localLengths: [10],
    states: ["Chattogram", "Dhaka", "Khulna", "Rajshahi"],
    cities: ["Dhaka", "Chattogram", "Khulna"],
  },
  {
    name: "Sri Lanka",
    iso2: "LK",
    dialCode: "+94",
    localLengths: [9],
    states: ["Central", "Colombo", "Southern", "Western"],
    cities: ["Colombo", "Kandy", "Galle"],
  },
];

export function getQuoteCountryByName(countryName: string | undefined) {
  const normalized = countryName?.trim().toLowerCase();

  return quoteCountryOptions.find((country) => country.name.toLowerCase() === normalized) ?? quoteCountryOptions[0];
}

export function getQuoteCountryByIso2(countryIso2: string | undefined) {
  const normalized = countryIso2?.trim().toUpperCase();

  return quoteCountryOptions.find((country) => country.iso2 === normalized) ?? quoteCountryOptions[0];
}
