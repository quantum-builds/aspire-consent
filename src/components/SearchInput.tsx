"use client";

import { Search } from "lucide-react";
import { useState } from "react";

export default function SearchInput() {
  const [query, setQuery] = useState("");

  return (
    <div className="relative w-full max-w-md">
      <div className="absolute left-3 top-1/4 pointer-events-none">
        <Search className="h-5 w-5 text-gray-500" />
      </div>
      <input
        type="text"
        className="w-full py-2 pl-10 pr-4 bg-[#E6E6FA] text-gray-700 placeholder-gray-500 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-300"
        placeholder="Search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
}
