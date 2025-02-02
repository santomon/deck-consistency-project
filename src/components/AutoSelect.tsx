import { useState } from "react";

interface AutoSelectProps<T> {
  options: T[];
  selectedOptions: T[];
  getOptionsKey: (option: T) => string;
  getOptionsLabel: (option: T) => string;
  handleOnSelect: (selectedOption: T) => void;
}

export const AutoSelect = <T,>({
  options,
  selectedOptions,
  getOptionsKey,
  getOptionsLabel,
  handleOnSelect,
}: AutoSelectProps<T>) => {
  const [searchFilter, setSearchFilter] = useState("");
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const searchFilterPredicate = (_option: T) => {
    return getOptionsLabel(_option)
      .toLowerCase()
      .includes(searchFilter.toLowerCase());
  };

  const notSelectedPredicate = (_option: T) => {
    return !selectedOptions.some(
      (option) => getOptionsKey(option) === getOptionsKey(_option),
    );
  };

  // Handle input change
  const handleInputChange = (value: string) => {
    setSearchFilter(value);
  };

  // Handle option selection
  const handleOptionSelect = (option: T) => {
    setSearchFilter("");
    setDropdownVisible(false);
    handleOnSelect(option);
  };

  return (
    <div className="relative w-64">
      {/* Input Field */}
      <input
        type="text"
        value={searchFilter}
        onChange={(e) => handleInputChange(e.target.value)}
        onFocus={() => setDropdownVisible(true)}
        onBlur={() => setTimeout(() => setDropdownVisible(false), 200)} // Delay for click
        placeholder="Search..."
        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Dropdown Menu */}
      {isDropdownVisible && (
        <ul className="absolute mt-1 max-h-48 w-full overflow-auto rounded-lg border border-gray-300 bg-white shadow-lg z-10 ">
          {options.map((option, index) => {
            if (searchFilterPredicate(option) && notSelectedPredicate(option)) {
              return (
                <li
                  key={index}
                  className="cursor-pointer px-3 py-2 hover:bg-blue-100"
                  onMouseDown={() => handleOptionSelect(option)}
                >
                  {getOptionsLabel(option)}
                </li>
              );
            }
            return null;
          })}
        </ul>
      )}
    </div>
  );
};
