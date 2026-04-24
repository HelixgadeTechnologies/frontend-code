import { createContext, useCallback, useContext, useEffect } from "react";
import { projectStore as ProjectStore } from "../../store/projectStore";
import { observer } from "mobx-react-lite";
import ProjectFirstForm from "./ProjectFirstForm";
import { IProjectPayload } from "../../types/interface";
import { GoBack } from "../../../../components/elements";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const ProjectStoreCTX = createContext(ProjectStore)
const EditProject = observer(() => {
  const projectStore = useContext(ProjectStoreCTX)
  const method = useForm({
    defaultValues: {
      ...projectStore.projectFormData,
      projectCategoryId: { value: projectStore.projectFormData.projectCategoryId!, label: projectStore.selectedProject?.projectCategory || "" },
      typeOfWork: projectStore.projectFormData.typeOfWork?.split(",").map((item: string) => ({ value: item, label: item })),
      projectStatus: { value: projectStore.projectFormData.projectStatus!, label: projectStore.selectedProject?.projectStatusName || "" },
      qualityRatingId: { value: projectStore.projectFormData.qualityRatingId!, label: projectStore.selectedProject?.qualityRatingName || "" },
    },
    shouldUnregister: false,
    mode: "onChange"
  })
  const { name } = useParams();
  useEffect(() => {
    async function loadRequests() {
      let selectedTrustId = window.sessionStorage.getItem("selectedTrustId")
      projectStore.projectFormData.trustId = selectedTrustId as string
      projectStore.getFormSteps()
      await projectStore.getCategory()
      await projectStore.getTypeOfWork()
      await projectStore.getStatusReport()
      await projectStore.getQualityRatting()
    }
    loadRequests();
  }, []);

  const closeTable = useCallback(() => {
    projectStore.selectedProjectScreen = 1;
  }, [projectStore]);

  const saveProjectData = useCallback(() => {
    async function loadRequests() {
      try {
        const payload: IProjectPayload = {
          isCreate: false,
          data: projectStore.projectFormData
        }
        const response = await projectStore.createProject(payload)
        if (response) {
          toast.success("Project Update Successfully Submitted");
          projectStore.isDashboardSwitch = false
          projectStore.selectedProjectScreen = 1;
          projectStore.projectFormData = {}
          method.reset()
          projectStore.getFormSteps()
        }
      } catch (error: any) {
        const message = error?.response?.body?.message;
        const message2 = error?.response?.body?.error;
        if (message?.includes("Please try again. Database connection failed.")) {
          toast.info(message);
        } else {
          toast.error(message2);
        }
      }
    }
    loadRequests()
  }, [projectStore]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="p-6 max-w-4xl mx-auto">
        <GoBack action={closeTable} trustName={name || ""} page="project" />
        <h1 className="text-xl font-bold text-gray-800">
          Edit HCDT Development Project
        </h1>
      </div>
      <div className="p-6 max-w-4xl mx-auto">
        <section className="bg-white rounded-xl shadow-sm overflow-hidden">
          <ProjectFirstForm method={method} onSave={saveProjectData} />
        </section>
      </div>
    </div>
  );
});

export default EditProject;