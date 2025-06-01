import { FormInput, Button } from "../../../../components/elements";
import { observer } from "mobx-react-lite";
import { ITrustPayloadData } from "../../types/interface";
import { trustStore as TrustStore } from "../../store/trustStore";
import { createContext, useContext } from "react";

const trustStoreCTX = createContext(TrustStore);
const BotDetails = observer(({ method }: { method: any })  => {
  const trustStore = useContext(trustStoreCTX);
  const { register, handleSubmit, formState: { errors } } = method;

  const onSubmit = (data: any) => {
    trustStore.isSaving = true
    // console.log("Form Data:", data, );
 
    const trustFormData: ITrustPayloadData = {
      ...trustStore.trustFormData,
      botDetailsOneFirstName: data.botDetailsOneFirstName,
      botDetailsOneLastName: data.botDetailsOneLastName,
      botDetailsOneEmail: data.botDetailsOneEmail,
      botDetailsOnePhoneNumber: data.botDetailsOnePhoneNumber,
      botDetailsTwoFirstName: data.botDetailsTwoFirstName,
      botDetailsTwoLastName: data.botDetailsTwoLastName,
      botDetailsTwoEmail: data.botDetailsTwoEmail,
      botDetailsTwoPhoneNumber: data.botDetailsTwoPhoneNumber,
    }
     //save to store
     trustStore.trustFormData = trustFormData
     trustStore.isSaving = false
     //move to the next form
     trustStore.setCompletedTab();
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="py-8 px-4">
      <div className="text-center">
        <h2 className="text-lg lg:text-2xl font-semibold text-primary-100">
          Create New Trust
        </h2>
        <p className="mt-1 text-xs text-gray-4">
          Fill out these details to build your broadcast
        </p>
      </div>

      <div className="space-y-6 mt-6">
       
          <div className="pb-4 border-b border-gray-200 grid grid-cols lg:grid-cols-2 gap-6">
            <div>
              <FormInput
                label={`BoT Contact  First Name`}
                error={errors?.botDetailsOneFirstName}
                name={`botDetailsOneFirstName`}
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
                error={errors?.botDetailsOneLastName}
                name={`botDetailsOneLastName`}
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
                label={`BoT Contact  Person's email address`}
                error={errors?.botDetailsOneEmail}
                name={`botDetailsOneEmail`}
                type="email"
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
                error={errors?.botDetailsOnePhoneNumber}
                name={`botDetailsOnePhoneNumber`}
                type="tel"
                register={register}
                registerOptions={{
                  required: "This field is required.",
                }}
                errorMessage="This field is required"
              />
            </div>
          </div>
          <div className="pb-4 border-b border-gray-200 grid grid-cols lg:grid-cols-2 gap-6">
            <div>
              <FormInput
                label={`BoT Contact Two First Name`}
                error={errors?.botDetailsTwoFirstName}
                name={`botDetailsTwoFirstName`}
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
                label={`BoT Contact Two Last Name`}
                error={errors?.botDetailsTwoLastName}
                name={`botDetailsTwoLastName`}
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
                label={`BoT Contact Two Person's email address`}
                error={errors?.botDetailsTwoEmail}
                name={`botDetailsTwoEmail`}
                type="email"
                register={register}
                registerOptions={{
                  required: "This field is required.",
                }}
                errorMessage="This field is required"
              />
            </div>

            <div className="lg:col-span-2">
              <FormInput
                label={`BoT Contact Two Person's mobile number`}
                error={errors?.botDetailsTwoPhoneNumber}
                name={`botDetailsTwoPhoneNumber`}
                type="tel"
                register={register}
                registerOptions={{
                  required: "This field is required.",
                }}
                errorMessage="This field is required"
              />
            </div>
          </div>
      </div>

      <div className="mt-8 flex flex-col lg:flex-row items-center gap-8 justify-between">
     
        <Button padding="py-3" buttonText="Next" />
      </div>
    </form>
  );
});

export default BotDetails;
