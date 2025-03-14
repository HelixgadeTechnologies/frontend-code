import Select, {
  StylesConfig,
  Props as SelectProps,
  GroupBase,
  OnChangeValue,
  ActionMeta,
} from "react-select";

interface Option {
  label: string;
  value: string | number;
}

type CustomSelectProps<T extends boolean = false> = Omit<
  SelectProps<Option, T>,
  "onChange"
> & {
  defaultValue?: Option;
  placeholder?: string;
  label: string;
  onChange?: (
    selected: OnChangeValue<Option, T>,
    actionMeta: ActionMeta<Option>,
  ) => void;
  styles?: StylesConfig<Option, T, GroupBase<Option>>;
  options: Option[];
  isLoading?: boolean;
  required?: boolean;
  id: string;
  isMulti?: T;
};

const CustomSelect = <T extends boolean = false>({
  defaultValue,
  placeholder,
  onChange,
  label,
  styles,
  options,
  isLoading,
  id,
  isMulti,
  required,
  ...rest
}: CustomSelectProps<T>) => {
  const selectStyle: StylesConfig<Option, T, GroupBase<Option>> = {
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

      <Select<Option, T, GroupBase<Option>>
        instanceId={id}
        defaultValue={defaultValue}
        onChange={(selected, actionMeta) => onChange?.(selected, actionMeta)}
        styles={styles || selectStyle}
        options={options}
        isMulti={isMulti}
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
