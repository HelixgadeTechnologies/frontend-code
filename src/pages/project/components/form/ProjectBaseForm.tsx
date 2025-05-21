import { createContext, useCallback, useContext, useEffect } from "react";
import { projectStore as ProjectStore } from "../../store/projectStore";
import { Observer, observer } from "mobx-react-lite";
import ProjectFirstForm from "./ProjectFirstForm";
import { IProjectPayload, TabType } from "../../types/interface";
import { GoBack } from "../../../../components/elements";
import { useParams } from "react-router-dom";
import ProjectSecondForm from "./ProjectSecondForm";
import ProjectThirdForm from "./ProjectThirdForm";
import ProjectFormPreview from "./ProjectFormPreview";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const ProjectStoreCTX = createContext(ProjectStore)
const ProjectBaseForm = observer(() => {
  const projectStore = useContext(ProjectStoreCTX)
  const method = useForm({
    defaultValues: projectStore.projectFormData,
    shouldUnregister: false,
  })
  const { name } = useParams();
  useEffect(() => {
    async function loadRequests() {
      projectStore.getFormSteps()
      await projectStore.getCategory()
      await projectStore.getTypeOfWork()
      await projectStore.getStatusReport()
      await projectStore.getQualityRatting()
    }
    loadRequests();
  }, []);

  const handleTabChange = useCallback((tab: TabType) => {
    projectStore.setActiveTab(tab)
  }, [projectStore]);

  const closeTable = useCallback(() => {
    projectStore.selectedProjectScreen = 1;
  }, [projectStore]);

  const saveProjectData = useCallback(() => {
    async function loadRequests() {
      try {
        const payload: IProjectPayload = {
          isCreate: true,
          data: projectStore.projectFormData
        }
        const response = await projectStore.createProject(payload)
        if (response) {
          toast.success("Project Successfully Submitted");
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
    <div className="p-6 bg-gray-100">
      <div className="p-6">
        <GoBack action={closeTable} trustName={name || ""} page="project" />
        <h1 className="text-xl font-bold text-gray-800">
          HCDT Development Projects
        </h1>
      </div>
      <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-x-8">
        <Observer>
          {() => (
            <section className="lg:col-span-8 ">
              {projectStore.activeTap?.id == 1 && (
                <ProjectFirstForm method={method} />
              )}
              {projectStore.activeTap?.id == 2 && (
                <ProjectSecondForm method={method} />
              )}
              {projectStore.activeTap?.id == 3 && (
                <ProjectThirdForm method={method} />
              )}
              {projectStore.activeTap?.id == 4 && (
                <ProjectFormPreview onSave={saveProjectData} projectStore={projectStore} />
              )}
            </section>
          )}
        </Observer>
        <section className="lg:col-span-4 bg-white p-6">
          <ul className="space-y-2 mt-8">
            {[...projectStore.formTab.values()]?.map((item: TabType) => {

              return (
                <li
                  onClick={() => handleTabChange(item)}
                  className={`${item.isActive
                    ? "bg-blue-0 "
                    : item.isVisible
                      ? " hover:bg-blue-0/50"
                      : " cursor-not-allowed"
                    } flex items-center justify-between list-none p-2 text-sm font-medium ${item.isVisible ? "cursor-pointer" : ""
                    }`}
                  key={item.id}
                >
                  <span className=" flex items-center gap-x-2">
                    <span
                      className={` h-10 w-10 rounded-full flex items-center justify-center font-bold text-base lg:text-xl ${item.isCompleted
                        ? "bg-primary-200 text-white"
                        : item.isActive
                          ? "bg-primary-200 text-white"
                          : "bg-white border border-[#98A2B3] text-[#98A2B3]"
                        } `}
                    >
                      {item.id}
                    </span>
                    <span
                      className={` ${item.isCompleted
                        ? "text-primary-100 font-bold"
                        : item.isActive
                          ? "text-primary-100"
                          : "text-primary-100"
                        } `}
                    >
                      {item.name}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
      <div className="flex items-center justify-between mb-6">
        {/* Title */}
      </div>
    </div>

  );
});

export default ProjectBaseForm;