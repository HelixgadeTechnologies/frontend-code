import Select, {
  StylesConfig,
  Props as SelectProps,
  GroupBase,
} from "react-select";

interface Option {
  label: string;
  value: string | number;
}

type CustomSelectProps = Omit<SelectProps<Option, false>, "onChange"> & {
  defaultValue?: Option;
  placeholder?: string;
  label: string;
  onChange?: (selected: Option | null) => void;
  styles?: StylesConfig<Option, false, GroupBase<Option>>;
  options: Option[];
  isLoading?: boolean;
  required?: boolean;
  id: string;
};

const CustomSelect = ({
  defaultValue,
  placeholder,
  onChange,
  label,
  styles,
  options,
  isLoading,
  id,
  required,
  ...rest
}: CustomSelectProps) => {
  const selectStyle: StylesConfig<Option, false, GroupBase<Option>> = {
    control: (baseStyles) => ({
      ...baseStyles,
      backgroundColor: "white",
      border: "1px solid #929ac6",
      color: "#47495c",
      padding: "3px 0px",
    }),
    menu: (baseStyles) => ({
      ...baseStyles,
      zIndex: 100,
    }),
    option: (baseStyles, state) => ({
      ...baseStyles,
      backgroundColor: state.isSelected
        ? "#B6BBD9"
        : state.isFocused
        ? "rgba(180, 163, 248, 0.14)"
        : "",
    }),
  };

  return (
    <>
      <label className="block text-base text-primary-100 font-medium mb-2">
        {label} {required && <span className="text-red-400">*</span>}
      </label>

      <Select<Option, false, GroupBase<Option>>
        instanceId={id}
        defaultValue={defaultValue}
        onChange={onChange}
        styles={styles || selectStyle}
        options={options}
        isMulti={false}
        components={{
          IndicatorSeparator: () => null,
        }}
        placeholder={placeholder}
        isLoading={isLoading}
        isDisabled={isLoading}
        {...rest}
      />
    </>
  );
};

export default CustomSelect;
