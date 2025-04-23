/* eslint-disable @typescript-eslint/no-explicit-any */

import { CreateTrustProps } from "../../../../utils/types";
import { FormInput, Button } from "../../../../components/elements";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

type BotContact = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
};

type FormValues = {
  botDetails: BotContact[];
};

type BotDetailsProps = {
  fields: any;
  updateFields: (data: CreateTrustProps) => void;
  changeTab: React.Dispatch<React.SetStateAction<number>>;
};

const BotDetails = ({ fields, updateFields, changeTab }: BotDetailsProps) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      botDetails: fields?.botDetails || [
        {
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
        },
        {
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
        },
      ],
    },
  });

  // Reset form when fields prop changes
  useEffect(() => {
    if (fields?.botDetails) {
      reset({ botDetails: fields.botDetails });
    }
  }, [fields, reset]);

  const updateData = handleSubmit(async (data: FormValues) => {
    console.log({ data });
    updateFields(data as unknown as CreateTrustProps);
    changeTab(3);
  });

  return (
    <form onSubmit={updateData} className="py-8 px-4">
      <div className="text-center">
        <h2 className="text-lg lg:text-2xl font-semibold text-primary-100">
          Create New Trust
        </h2>
        <p className="mt-1 text-xs text-gray-4">
          Fill out these details to build your broadcast
        </p>
      </div>

      <div className="space-y-6 mt-6">
        {[0, 1].map((index) => (
          <div
            key={index}
            className="pb-4 border-b border-gray-200 grid grid-cols lg:grid-cols-2 gap-6"
          >
            <div>
              <FormInput
                label={`BoT Contact  First Name`}
                error={errors?.botDetails?.[index]?.firstName}
                name={`botDetails.${index}.firstName`}
                type="text"
                register={register}
                registerOptions={{
                  required: "This field is required.",
                }}
                errorMessage="This field is required"
              />
            </div>

            <div>
              <FormInput
                label={`BoT Contact Last Name`}
                error={errors?.botDetails?.[index]?.lastName}
                name={`botDetails.${index}.lastName`}
                type="text"
                register={register}
                registerOptions={{
                  required: "This field is required.",
                }}
                errorMessage="This field is required"
              />
            </div>

            <div className="lg:col-span-2">
              <FormInput
                label={`BoT Contact  Person's mobile number`}
                error={errors?.botDetails?.[index]?.phoneNumber}
                name={`botDetails.${index}.phoneNumber`}
                type="tel"
                register={register}
                registerOptions={{
                  required: "This field is required.",
                }}
                errorMessage="This field is required"
              />
            </div>

            <div className="lg:col-span-2">
              <FormInput
                label={`BoT Contact  Person's email address`}
                error={errors?.botDetails?.[index]?.email}
                name={`botDetails.${index}.email`}
                type="email"
                register={register}
                registerOptions={{
                  required: "This field is required.",
                }}
                errorMessage="This field is required"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col lg:flex-row items-center gap-8 justify-between">
        <Button
          onClick={() => changeTab(1)}
          className="border text-black bg-white border-gray-7 rounded-lg py-2 px-4 lg:px-10"
          buttonText="Back"
          width="w-fit"
          type="button"
        />

        <Button padding="py-3" buttonText="Next" type="submit" />
      </div>
    </form>
  );
};

export default BotDetails;
