import { ChevronDown } from 'lucide-react';

const CustomSelect = ({ 
  value, 
  onChange, 
  options, 
  label
}) => {
  return (
    <div className="user-selector-item">
      {label && <label className="user-selector-label">{label}</label>}
      
      <div className="user-select-wrapper">
        <select 
          className="user-select-input"
          value={value}
          onChange={onChange}
        >
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
        <ChevronDown className="user-select-icon" />
      </div>
    </div>
  );
};

export default CustomSelect;
