import { createContext, useContext, useEffect } from "react";
import { projectStore as ProjectStore } from "../store/projectStore"
import { Observer, observer } from "mobx-react-lite";
import ProjectBaseForm from "./form/ProjectBaseForm";
import ProjectBaseView from "./ProjectBaseView";
import ProjectView from "./modal/ProjectView";
import { IProjectView } from "../types/interface";
import EditProject from "./form/EditProject";

const ProjectStoreCTX = createContext(ProjectStore)
const HCDTProjects = observer(() => {
  const projectStore = useContext(ProjectStoreCTX)
  useEffect(() => {
    async function loadRequests() {
      projectStore.dashboardData =  null;
      let selectedTrustId = window.sessionStorage.getItem("selectedTrustId")
      projectStore.selectedProjectScreen = 1
      await projectStore.getProjectDashboardByTrustId(selectedTrustId as string)
      projectStore.getFormSteps()
      await projectStore.getCategory()
      await projectStore.getTypeOfWork()
      await projectStore.getStatusReport()
      await projectStore.getQualityRatting()
    }
    loadRequests();
  }, []);

  return (
    <Observer>
      {() => (
        <div>
          {projectStore.selectedProjectScreen === 1 && (<ProjectBaseView />)}
          {projectStore.selectedProjectScreen === 2 && (<ProjectBaseForm />)}
          {projectStore.selectedProjectScreen === 3 && (<ProjectView projectData={projectStore.selectedProject as IProjectView} projectStore={projectStore} />)}
          {projectStore.selectedProjectScreen === 4 && (<EditProject />)}
        </div>
      )}
    </Observer>
  );
});

export default HCDTProjects;