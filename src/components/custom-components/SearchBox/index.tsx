import React, {
  ChangeEvent,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import CustomInput from "../CustomInput";

interface SearchBoxI {
  placeholder?: string;
  searchValue?: string;
  handleSearchChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  inputClassName?: string;
  renderOption?: () => ReactNode;
}

const SearchBox = ({
  placeholder,
  searchValue,
  handleSearchChange,
  className,
  renderOption,
  inputClassName,
}: SearchBoxI) => {
  const [isFocused, setIsFocused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleFocus = () => {
    setIsFocused(true);
  };

  return (
    <div ref={ref} className={`${className} w-full`} onFocus={handleFocus}>
      <CustomInput
        placeholder={placeholder}
        value={searchValue}
        onChange={handleSearchChange}
        className={inputClassName}
      />
      <div>{isFocused && renderOption && renderOption()}</div>
    </div>
  );
};

export default SearchBox;

// {
//   currency: "INR";
//   exchangeShortName: "BSE";
//   name: "Bharat Petroleum Corporation Limited";
//   stockExchange: "Bombay Stock Exchange";
//   symbol: "BPCL.BO";
// }
