import { useEffect, useState } from "react";
import { getCountry, getPublicHolidays } from "../api";

export default function Holidays() {
  const [countries, setCountries] = useState<any[]>([]);
  const [publicHolidays, setPublicHolidays] = useState<any[]>([]);
  const [selectedCountry, setSelectedCountry] = useState("NL");
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingHolidays, setLoadingHolidays] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoadingCountries(true);
    getCountry()
      .then(setCountries)
      .catch(() => setError("Failed to load countries"))
      .finally(() => setLoadingCountries(false));
  }, []);

  useEffect(() => {
    if (!selectedCountry) return;

    setLoadingHolidays(true);
    getPublicHolidays(selectedCountry)
      .then(setPublicHolidays)
      .catch(() => setError("Failed to load holidays"))
      .finally(() => setLoadingHolidays(false));
  }, [selectedCountry]);

  return (
    <div className="container paper margin-top-large">
      <h1>Public Holidays</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {loadingCountries ? (
        <p>Loading countries...</p>
      ) : (
        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
        >
          {countries.map((country) => (
            <option key={country.isoCode} value={country.isoCode}>
              {country.name[0].text}
            </option>
          ))}
        </select>
      )}

      {loadingHolidays ? (
        <p>Loading holidays...</p>
      ) : (
        <ul>
          {publicHolidays.map((holiday) => (
            <li key={holiday.id}>
              {new Date(holiday.startDate).toLocaleDateString(undefined, {
                day: "numeric",
                month: "long",
              })}
              {" — "}
              {holiday.name[0].text}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
