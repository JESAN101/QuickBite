import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { getSuggestions } from "../services/foodService";

const SearchBar = ({ search, setSearch }) => {
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchSuggestions = (value) => {
    clearTimeout(debounceRef.current);
    if (value.trim().length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      try {
        const data = await getSuggestions(value.trim());
        setSuggestions(data.suggestions || []);
        setShowDropdown(true);
        setActiveIndex(-1);
      } catch {
        setSuggestions([]);
      }
    }, 300);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    fetchSuggestions(value);
  };

  const selectSuggestion = (name, id) => {
    setSearch(name);
    setShowDropdown(false);
    navigate(`/food/${id}`);
  };

  const handleKeyDown = (e) => {
    if (!showDropdown || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      selectSuggestion(
        suggestions[activeIndex].name,
        suggestions[activeIndex].id
      );
    } else if (e.key === "Escape") {
      setShowDropdown(false);
    }
  };

  return (
    <section ref={wrapperRef} className="relative z-10 mx-auto -mt-8 max-w-3xl px-4">
      <div className="flex items-center gap-3 rounded-2xl border border-[#EADFC8] bg-[#FFFBF3] p-2 pl-5 shadow-[0_12px_30px_-8px_rgba(29,21,18,0.25)] transition-shadow focus-within:shadow-[0_12px_34px_-6px_rgba(240,164,56,0.35)]">
        <FaSearch className="shrink-0 text-lg text-[#D64933]" />

        <input
          type="text"
          value={search}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
          placeholder="Search dishes, cuisines, or restaurants…"
          className="w-full bg-transparent py-2.5 font-['Plus_Jakarta_Sans',sans-serif] text-[15px] text-[#3A2A20] placeholder:text-[#3A2A20]/40 outline-none"
          autoComplete="off"
        />

        <button
          type="button"
          className="shrink-0 rounded-xl bg-[#1D1512] px-5 py-2.5 font-['Plus_Jakarta_Sans',sans-serif] text-sm font-semibold text-[#F7ECD9] transition hover:bg-[#2A1F1A]"
        >
          Search
        </button>
      </div>

      {/* Autocomplete dropdown */}
      {showDropdown && suggestions.length > 0 && (
        <ul className="absolute left-4 right-4 top-full z-20 mt-2 overflow-hidden rounded-xl border border-[#EADFC8] bg-[#FFFBF3] shadow-xl">
          {suggestions.map((s, idx) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => selectSuggestion(s.name, s.id)}
                className={`flex w-full items-center gap-3 px-5 py-3 text-left text-sm text-[#1D1512] transition ${
                  idx === activeIndex
                    ? "bg-[#F0A438]/15 text-[#946022]"
                    : "hover:bg-[#F0A438]/10"
                }`}
              >
                <FaSearch className="text-xs text-[#D64933]/50" />
                {s.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default SearchBar;
