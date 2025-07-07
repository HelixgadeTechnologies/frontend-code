import { observer } from "mobx-react-lite";
import { Button } from "../../../../components/elements";
import { IProjectPayloadData, IProjectStore } from "../../types/interface";

const ProjectFormPreview = observer(({ onSave, projectStore }: { onSave: () => void; projectStore: IProjectStore }) => {
  const formData: IProjectPayloadData = projectStore.projectFormData;

  return (
    <div>
      <div className="bg-white shadow-md rounded-lg p-6 sm:p-8 ">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-gray-800">Project Review</h1>
          <p className="text-sm text-gray-600">Review all the details before submitting</p>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Left Column: Details */}
          <div className="space-y-4">
            {/* Project Details */}
            <div>
              <h2 className="text-sm font-bold text-gray-700">Project Details</h2>
              <p className="text-sm text-gray-600">
                <strong>Project Title:</strong> {formData.projectTitle || "N/A"}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Project Category:</strong> {projectStore.projectCategories.get(formData.projectCategoryId!)?.categoryName || "N/A"}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Total Budget:</strong> {formData.totalBudget || "N/A"}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Community:</strong> {formData.community || "N/A"}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Award Date:</strong> {formData.awardDate || "N/A"}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Name of Contractor:</strong> {formData.nameOfContractor || "N/A"}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Annual Approved Budget:</strong> {formData.annualApprovedBudget || "N/A"}
              </p>
            </div>

            {/* Project Status and Ratings */}
            <div>
              <h2 className="text-sm font-bold text-gray-700">Project Status and Ratings</h2>
              <p className="text-sm text-gray-600">
                <strong>Project Status:</strong> {projectStore.statusReport.get(formData.projectStatus!)?.statusReport || "N/A"}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Quality Rating:</strong> {projectStore.qualityRating.get(formData.qualityRatingId!)?.qualityRating || "N/A"}
              </p>
            </div>

            {/* Employment Details */}
            <div>
              <h2 className="text-sm font-bold text-gray-700">Employment Details</h2>
              <p className="text-sm text-gray-600">
                <strong>Total Number of Females Employed:</strong> {formData.numberOfFemaleEmployedByContractor || "N/A"}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Total Number of Males Employed:</strong> {formData.numberOfMaleEmployedByContractor || "N/A"}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Number of PwDs Employed:</strong> {formData.numberOfPwDsEmployedByContractor || "N/A"}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Type of Work:</strong> {formData.typeOfWork || "N/A"}
              </p>
            </div>

            {/* Beneficiary Details */}
            <div>
              <h2 className="text-sm font-bold text-gray-700">Beneficiary Details</h2>
              <p className="text-sm text-gray-600">
                <strong>Number of Host Community Members:</strong> {formData.numberOfHostCommunityMemberContracted || "N/A"}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Total Number of Females Benefited:</strong> {formData.numberOfFemaleBenefited || "N/A"}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Total Number of Males Benefited:</strong> {formData.numberOfMaleBenefited || "N/A"}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Total Number of PwDs Benefited:</strong> {formData.numberOfPwDsBenefited || "N/A"}
              </p>
            </div>
          </div>

          {/* Right Column: Media Preview */}
          <div className="flex items-center justify-center">
            {formData.projectVideoMimeType?.startsWith("image/") && (
              <img
                src={formData.projectVideo}
                alt="Project Media"
                className="w-full h-auto rounded-lg shadow-md"
              />
            )}
            {formData.projectVideoMimeType?.startsWith("video/") && (
              <video
                src={formData.projectVideo}
                controls
                className="w-full h-auto rounded-lg shadow-md"
              />
            )}
            {formData.projectVideoMimeType === "application/pdf" && (
              <iframe
                src={formData.projectVideo}
                title="Project PDF"
                className="w-full h-96 rounded-lg shadow-md"
              />
            )}
            {!formData.projectVideoMimeType && (
              <p className="text-sm text-gray-600">No media available</p>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end mt-6">
          <Button
            buttonText={projectStore.isSubmitting?"Saving data...":"Submit"}
             className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            onClick={onSave}
          />
        </div>
      </div>
    </div>
  );
});

export default ProjectFormPreview;