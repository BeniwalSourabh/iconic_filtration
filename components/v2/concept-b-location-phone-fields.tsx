"use client";

import { useMemo, useState } from "react";
import { quoteCountryOptions } from "@/data/quote-location-options";

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function scoreSuggestion(input: string, option: string) {
  const query = normalize(input);
  const candidate = normalize(option);

  if (!query) {
    return 0;
  }

  if (candidate.startsWith(query)) {
    return 100 - candidate.length;
  }

  if (candidate.includes(query)) {
    return 70 - candidate.length;
  }

  let score = 0;
  let index = 0;

  for (const char of query) {
    const found = candidate.indexOf(char, index);

    if (found === -1) {
      return 0;
    }

    score += found === index ? 8 : 3;
    index = found + 1;
  }

  return score;
}

function bestSuggestions(input: string, options: string[]) {
  return options
    .map((option) => ({ option, score: scoreSuggestion(input, option) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.option.localeCompare(b.option))
    .slice(0, 5)
    .map((item) => item.option);
}

export function ConceptBLocationPhoneFields() {
  const [countryName, setCountryName] = useState("India");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");

  const country = quoteCountryOptions.find((option) => option.name === countryName) ?? quoteCountryOptions[0];
  const localLengthText =
    country.localLengths.length === 1
      ? `${country.localLengths[0]} digits`
      : `${country.localLengths.join(" or ")} digits`;
  const phoneDigits = phone.replace(/\D/g, "");
  const phoneLengthValid = country.localLengths.includes(phoneDigits.length);
  const stateSuggestions = useMemo(() => bestSuggestions(state, country.states), [country.states, state]);
  const citySuggestions = useMemo(() => bestSuggestions(city, country.cities), [city, country.cities]);

  return (
    <>
      <div className="b2-form-grid three">
        <label className="b2-field">
          <span>Country</span>
          <select name="country" className="b2-select" value={country.name} onChange={(event) => setCountryName(event.target.value)}>
            {quoteCountryOptions.map((option) => (
              <option key={option.iso2} value={option.name}>
                {option.name} ({option.dialCode})
              </option>
            ))}
          </select>
        </label>
        <label className="b2-field">
          <span>State</span>
          <input
            name="state"
            className="b2-input"
            placeholder="Start typing state"
            value={state}
            onChange={(event) => setState(event.target.value)}
            list="b2-state-suggestions"
            autoComplete="address-level1"
          />
          <datalist id="b2-state-suggestions">
            {stateSuggestions.map((suggestion) => (
              <option key={suggestion} value={suggestion} />
            ))}
          </datalist>
        </label>
        <label className="b2-field">
          <span>City</span>
          <input
            name="city"
            className="b2-input"
            placeholder="Start typing city"
            value={city}
            onChange={(event) => setCity(event.target.value)}
            list="b2-city-suggestions"
            autoComplete="address-level2"
          />
          <datalist id="b2-city-suggestions">
            {citySuggestions.map((suggestion) => (
              <option key={suggestion} value={suggestion} />
            ))}
          </datalist>
        </label>
      </div>

      <label className="b2-field">
        <span>Phone / WhatsApp</span>
        <div style={{ display: "grid", gridTemplateColumns: "96px 1fr", gap: "10px" }}>
          <input className="b2-input" value={country.dialCode} readOnly aria-label="Country code" />
          <input
            name="phone"
            className="b2-input"
            placeholder={`Local number, ${localLengthText}`}
            value={phone}
            onChange={(event) => setPhone(event.target.value.replace(/[^\d\s-]/g, ""))}
            required
            minLength={country.localLengths[0]}
            inputMode="numeric"
            autoComplete="tel-national"
          />
        </div>
        <input type="hidden" name="countryIso2" value={country.iso2} />
        <input type="hidden" name="countryDialCode" value={country.dialCode} />
        <p style={{ color: phoneDigits && !phoneLengthValid ? "#dc2626" : "#64748b", fontSize: 13, fontWeight: 700 }}>
          Enter your local phone number after selecting the correct country code.
        </p>
      </label>
    </>
  );
}
