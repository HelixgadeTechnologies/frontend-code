import { Controller, useFieldArray } from "react-hook-form";

import { year, currencyOptions } from "../../../../utils/data";
import { Button, CustomSelect, FormInput } from "../../../../components/elements";
import { observer } from "mobx-react-lite";

export const OpexFieldsArray = observer(({ control, register }: { control: any, register: any }) => {

    const { fields, append, remove } = useFieldArray({
        control,
        name: "opex", // This will be an array in your form data
    });

    return (
        <div>
            {fields.map((field, idx) => (
                <div key={field.id} className="mb-3">
                    <div className="flex items-center rounded-md border border-blue-200 bg-white focus-within:border-blue-500 transition">
                        {/* Year Select */}
                        <div className="border-r border-blue-200 h-12 flex items-center bg-white">
                            <Controller
                                control={control}
                                name={`opex.${idx}.year`}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <CustomSelect
                                        label=""
                                        id={`opex-year-${idx}`}
                                        {...field}
                                        options={year}
                                        isMulti={false}
                                        placeholder="Select Year"
                                        className="!h-12 !border-0 !shadow-none focus:!border-0 focus:!ring-0 focus:outline-none"
                                        menuPlacement="auto"
                                    />
                                )}
                            />
                        </div>
                        {/* Currency Select */}
                        <div className="w-24 border-r border-blue-200 flex items-center bg-white" style={{ width: "97px" }}>
                            <Controller
                                name={`opex.${idx}.currency`}
                                control={control}
                                render={({ field }) => (
                                    <CustomSelect
                                        id={`opex-currency-${idx}`}
                                        label=""
                                        options={currencyOptions}
                                        onChange={(selected) =>
                                            field.onChange(selected ? selected.value : "USD")
                                        }
                                        placeholder="NGN"
                                        defaultValue={currencyOptions[0]}
                                        className="!h-12 !border-0 !shadow-none focus:!border-0 focus:!ring-0 focus:outline-none"
                                        menuPlacement="auto"
                                    />
                                )}
                            />
                        </div>
                        {/* Amount Input */}
                        <div className="flex-1 h-12 flex items-center" style={{ paddingBottom: "10px" }}>
                            <FormInput
                                label=""
                                name={`opex.${idx}.amount`}
                                type="number"
                                placeholder="0.00"
                                register={register}
                                registerOptions={{
                                    required: "Amount is required",
                                    pattern: {
                                        value: /^[0-9]+(\.[0-9]{1,2})?$/,
                                        message: "Please enter a valid amount",
                                    },
                                }}
                                className="!border-0 !shadow-none focus:!border-blue-500 w-full focus:!border-0 focus:!ring-0 focus:outline-none"
                            // error={errors?.opex?.[idx]?.amount}
                            />
                            {fields.length > 1 && (
                                <button
                                    type="button"
                                    className="ml-2 text-red-500"
                                    onClick={() => remove(idx)}
                                    title="Remove"
                                >
                                    &times;
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            ))}
            <div className="flex justify-center my-6">
                <Button
                    type="button"
                    className="border text-black bg-white border-blue-800 rounded-lg py-2 px-4 lg:px-10"
                    buttonText="Add Opex"
                    width="w-fit"
                    onClick={() => append({ year: "", currency: "", amount: "" })}
                />
            </div>
        </div>
    );
})