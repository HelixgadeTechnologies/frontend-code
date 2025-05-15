import { createContext, useContext, useEffect } from "react";
import { projectStore as ProjectStore } from "../store/projectStore"
import ProjectDashboard from "./chat/ProjectDashboard";
import { Observer, observer } from "mobx-react-lite";
import ProjectBaseForm from "./form/ProjectBaseForm";

const ProjectStoreCTX = createContext(ProjectStore)
const HCDTProjects = observer(() => {
  const projectStore = useContext(ProjectStoreCTX)

  useEffect(() => {
    async function loadRequests() {
      projectStore.selectedProjectScreen = 1
    }
    loadRequests();
  }, []);

  return (
    <Observer>
      {() => (
        <div>
          {projectStore.selectedProjectScreen === 1 && (<ProjectDashboard />)}
          {projectStore.selectedProjectScreen === 2 && (<ProjectBaseForm />)}
        </div>
      )}
    </Observer>
  );
});

export default HCDTProjects;