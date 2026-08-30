"use client";

import { KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, RotateCcw, Search } from "lucide-react";
import { quoteCountryOptions } from "@/data/quote-location-options";

type LocationOption = {
  name: string;
  isoCode?: string;
  countryCode?: string;
  stateCode?: string;
  flag?: string;
  phoneCode?: string;
};

type LocationMode = "database" | "manual";

const expectedDeliveryOptions = ["Immediately", "Within 3 Days", "Within 7 Days", "Within 15 Days", "Within 30 Days", "Flexible"];
const locationTypeOptions = [
  "Factory",
  "Warehouse",
  "Industrial Plant",
  "Office",
  "Construction Site",
  "Government Project",
  "OEM Facility",
  "Other",
];

function postalCodeIsValid(value: string, countryIsoCode?: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return true;
  }

  if (countryIsoCode === "IN") {
    return /^\d{6}$/.test(trimmed);
  }

  return /^[A-Za-z0-9][A-Za-z0-9 -]{1,18}[A-Za-z0-9]$/.test(trimmed);
}

function sanitizeLocationInput(value: string, maxLength: number) {
  return value
    .replace(/[<>`{}[\]\\]/g, "")
    .replace(/\s+/g, " ")
    .slice(0, maxLength);
}

function optionLabel(option?: LocationOption | null) {
  if (!option) {
    return "";
  }

  return [option.flag, option.name, option.isoCode ? `(${option.isoCode})` : undefined].filter(Boolean).join(" ");
}

function useDebouncedValue(value: string, delay = 220) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedValue(value), delay);
    return () => window.clearTimeout(timer);
  }, [delay, value]);

  return debouncedValue;
}

function AsyncLocationField({
  label,
  name,
  type,
  value,
  selected,
  mode,
  required,
  placeholder,
  disabled,
  countryIsoCode,
  stateIsoCode,
  manualMessage,
  onManualMode,
  onResetToDatabase,
  onValueChange,
  onSelect,
}: {
  label: string;
  name: string;
  type: "countries" | "states" | "cities";
  value: string;
  selected?: LocationOption | null;
  mode: LocationMode;
  required?: boolean;
  placeholder: string;
  disabled?: boolean;
  countryIsoCode?: string;
  stateIsoCode?: string;
  manualMessage: string;
  onManualMode: () => void;
  onResetToDatabase: () => void;
  onValueChange: (value: string) => void;
  onSelect: (option: LocationOption) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [options, setOptions] = useState<LocationOption[]>([]);
  const [loading, setLoading] = useState(false);
  const debouncedValue = useDebouncedValue(value);
  const canSearch = !disabled && mode === "database";

  useEffect(() => {
    if (!canSearch) {
      setOptions([]);
      return;
    }

    if (type === "states" && !countryIsoCode) {
      setOptions([]);
      return;
    }

    if (type === "cities" && (!countryIsoCode || !stateIsoCode)) {
      setOptions([]);
      return;
    }

    const controller = new AbortController();
    const searchQuery = selected?.name === debouncedValue ? "" : debouncedValue;
    const params = new URLSearchParams({ type, q: searchQuery });

    if (countryIsoCode) {
      params.set("country", countryIsoCode);
    }

    if (stateIsoCode) {
      params.set("state", stateIsoCode);
    }

    setLoading(true);
    fetch(`/api/locations?${params.toString()}`, { signal: controller.signal })
      .then((response) => response.json())
      .then((data: { items?: LocationOption[] }) => {
        setOptions(data.items ?? []);
        setHighlightedIndex(0);
      })
      .catch((error) => {
        if (error instanceof Error && error.name !== "AbortError") {
          setOptions([]);
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [canSearch, countryIsoCode, debouncedValue, selected?.name, stateIsoCode, type]);

  const describedBy = `${name}-hint`;
  const isDatabaseSelection = mode === "database" && Boolean(selected && (type === "cities" || selected.isoCode));

  function selectOption(option: LocationOption) {
    onSelect(option);
    setOpen(false);
    inputRef.current?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (mode === "manual") {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setHighlightedIndex((index) => Math.min(index + 1, Math.max(0, options.length - 1)));
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightedIndex((index) => Math.max(0, index - 1));
    }

    if (event.key === "Enter" && open && options[highlightedIndex]) {
      event.preventDefault();
      selectOption(options[highlightedIndex]);
    }

    if (event.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <label className="b2-field b2-location-field">
      <span>{label}{required ? " *" : ""}</span>
      <div className={`b2-location-combobox ${disabled ? "disabled" : ""}`}>
        <Search className="h-4 w-4" />
        <input
          ref={inputRef}
          name={name}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          maxLength={100}
          autoComplete="off"
          aria-autocomplete="list"
          aria-describedby={describedBy}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          onChange={(event) => {
            onValueChange(sanitizeLocationInput(event.target.value, 100));
            setOpen(true);
          }}
        />
        <button
          type="button"
          aria-label={`Open ${label} options`}
          disabled={disabled || mode === "manual"}
          onClick={() => setOpen((current) => !current)}
        >
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>

      <input type="hidden" name={`${name}EntryMode`} value={isDatabaseSelection ? "database" : "manual"} />
      <input type="hidden" name={`${name}IsoCode`} value={selected?.isoCode ?? ""} />

      {mode === "manual" ? (
        <button type="button" className="b2-location-inline-action" onClick={onResetToDatabase}>
          <RotateCcw className="h-3.5 w-3.5" /> Switch back to list
        </button>
      ) : null}

      {open && mode === "database" && !disabled ? (
        <div className="b2-location-menu" role="listbox">
          {loading ? <p>Searching...</p> : null}
          {!loading && options.map((option, index) => (
            <button
              type="button"
              key={`${option.name}-${option.isoCode ?? option.stateCode ?? index}`}
              role="option"
              aria-selected={index === highlightedIndex}
              className={index === highlightedIndex ? "active" : ""}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => selectOption(option)}
            >
              <strong>{optionLabel(option)}</strong>
              {option.countryCode ? <small>{option.countryCode}{option.stateCode ? `-${option.stateCode}` : ""}</small> : null}
            </button>
          ))}
          {!loading ? (
            <button
              type="button"
              className="b2-location-manual"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                onManualMode();
                setOpen(false);
                inputRef.current?.focus();
              }}
            >
              {manualMessage}
            </button>
          ) : null}
        </div>
      ) : null}

      <span id={describedBy} className="sr-only">
        {mode === "manual" || (value && !isDatabaseSelection) ? "Manual entry accepted" : "Search and select from the list"}
      </span>
    </label>
  );
}

export function ConceptBQuotePhoneField() {
  const [countryName, setCountryName] = useState("India");
  const [phone, setPhone] = useState("");
  const country = quoteCountryOptions.find((option) => option.name === countryName) ?? quoteCountryOptions[0];

  return (
    <label className="b2-field">
      <span>Mobile Number *</span>
      <div className="b2-phone-combo">
        <select
          className="b2-select"
          aria-label="Phone country code"
          value={country.name}
          onChange={(event) => setCountryName(event.target.value)}
        >
          {quoteCountryOptions.map((option) => (
            <option key={option.iso2} value={option.name}>
              {option.dialCode}
            </option>
          ))}
        </select>
        <input
          name="phone"
          className="b2-input"
          placeholder="Your mobile number"
          value={phone}
          onChange={(event) => setPhone(event.target.value.replace(/[^\d\s-]/g, ""))}
          required
          inputMode="numeric"
          autoComplete="tel-national"
        />
      </div>
      <input type="hidden" name="phoneCountryIso2" value={country.iso2} />
      <input type="hidden" name="phoneCountryDialCode" value={country.dialCode} />
    </label>
  );
}

export function ConceptBQuoteDeliveryFields() {
  const [country, setCountry] = useState<LocationOption>({ name: "India", isoCode: "IN", flag: "🇮🇳", phoneCode: "+91" });
  const [state, setState] = useState<LocationOption | null>(null);
  const [city, setCity] = useState<LocationOption | null>(null);
  const [countryValue, setCountryValue] = useState("India");
  const [stateValue, setStateValue] = useState("");
  const [cityValue, setCityValue] = useState("");
  const [countryMode, setCountryMode] = useState<LocationMode>("database");
  const [stateMode, setStateMode] = useState<LocationMode>("database");
  const [cityMode, setCityMode] = useState<LocationMode>("database");
  const [pinCode, setPinCode] = useState("");
  const [address, setAddress] = useState("");

  const pinCodeValid = useMemo(() => postalCodeIsValid(pinCode, country.isoCode), [country.isoCode, pinCode]);
  const locationStatus = countryValue && stateValue && cityValue
    ? countryMode === "database" && stateMode === "database" && cityMode === "database"
      ? "Location verified."
      : "Manual location accepted."
    : "";

  function clearStateCityPin() {
    setState(null);
    setCity(null);
    setStateValue("");
    setCityValue("");
    setStateMode("database");
    setCityMode("database");
    setPinCode("");
  }

  function clearCityPin() {
    setCity(null);
    setCityValue("");
    setCityMode("database");
    setPinCode("");
  }

  return (
    <div className="b2-location-details">
      <div className="b2-form-grid three">
        <AsyncLocationField
          label="Country"
          name="country"
          type="countries"
          value={countryValue}
          selected={country}
          mode={countryMode}
          required
          placeholder="Search country"
          manualMessage="Can't find your country? Enter manually"
          onManualMode={() => {
            setCountryMode("manual");
            setCountry({ name: countryValue, isoCode: undefined });
            clearStateCityPin();
          }}
          onResetToDatabase={() => {
            setCountryMode("database");
            setCountryValue("");
            setCountry({ name: "", isoCode: undefined });
            clearStateCityPin();
          }}
          onValueChange={(value) => {
            setCountryValue(value);
            setCountry({ name: value, isoCode: undefined });
            clearStateCityPin();
          }}
          onSelect={(option) => {
            setCountry(option);
            setCountryValue(option.name);
            setCountryMode("database");
            clearStateCityPin();
          }}
        />
        <AsyncLocationField
          label="State / Province"
          name="state"
          type="states"
          value={stateValue}
          selected={state}
          mode={stateMode}
          required
          placeholder="Search state"
          disabled={!countryValue}
          countryIsoCode={country.isoCode}
          manualMessage="Can't find your state? Enter manually"
          onManualMode={() => {
            setStateMode("manual");
            setState(null);
            clearCityPin();
          }}
          onResetToDatabase={() => {
            setStateMode("database");
            setState(null);
            setStateValue("");
            clearCityPin();
          }}
          onValueChange={(value) => {
            setStateValue(value);
            setState(null);
            clearCityPin();
          }}
          onSelect={(option) => {
            setState(option);
            setStateValue(option.name);
            setStateMode("database");
            clearCityPin();
          }}
        />
        <AsyncLocationField
          label="City"
          name="city"
          type="cities"
          value={cityValue}
          selected={city}
          mode={cityMode}
          required
          placeholder="Search city"
          disabled={!stateValue}
          countryIsoCode={country.isoCode}
          stateIsoCode={state?.isoCode}
          manualMessage="Can't find your city? Enter manually"
          onManualMode={() => {
            setCityMode("manual");
            setCity(null);
          }}
          onResetToDatabase={() => {
            setCityMode("database");
            setCity(null);
            setCityValue("");
            setPinCode("");
          }}
          onValueChange={(value) => {
            setCityValue(value);
            setCity(null);
          }}
          onSelect={(option) => {
            setCity(option);
            setCityValue(option.name);
            setCityMode("database");
          }}
        />
      </div>

      <div className="b2-form-grid three">
        <label className="b2-field">
          <span>PIN / ZIP Code</span>
          <input
            name="pinCode"
            className="b2-input"
            placeholder={country.isoCode === "IN" ? "6 digit PIN code" : "Postal / ZIP code"}
            value={pinCode}
            onChange={(event) => setPinCode(sanitizeLocationInput(event.target.value, 20))}
            maxLength={20}
            inputMode={country.isoCode === "IN" ? "numeric" : "text"}
            aria-invalid={!pinCodeValid}
            autoComplete="postal-code"
          />
          {!pinCodeValid ? <small className="b2-location-error">Please enter a valid postal code.</small> : null}
        </label>
        <label className="b2-field">
          <span>Expected Delivery *</span>
          <select name="timeline" className="b2-select" defaultValue="" required>
            <option value="">Select timeline</option>
            {expectedDeliveryOptions.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </label>
        <label className="b2-field">
          <span>Location Type</span>
          <select name="locationType" className="b2-select" defaultValue="">
            <option value="">Select location type</option>
            {locationTypeOptions.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </label>
      </div>

      <label className="b2-field">
        <span>Complete Delivery Address</span>
        <textarea
          name="deliveryAddress"
          className="b2-textarea"
          placeholder="Building, street, industrial area, landmark or site details"
          value={address}
          onChange={(event) => setAddress(sanitizeLocationInput(event.target.value, 300))}
          maxLength={300}
          rows={3}
        />
        <small className="b2-location-counter">{address.length}/300 characters</small>
      </label>

      {locationStatus ? (
        <p className="b2-location-success">
          <Check className="h-4 w-4" /> {locationStatus}
        </p>
      ) : null}
    </div>
  );
}
