import { createContext, useCallback, useContext } from "react";
import { Button, DashboardSkeleton } from "../../../components/elements";
import { observer } from "mobx-react-lite";
import { projectStore as ProjectStore } from "../store/projectStore";
import ProjectDashboard from "./chat/ProjectDashboard";
import ProjectTable from "./table/ProjectTable";

const ProjectStoreCTX = createContext(ProjectStore)
const ProjectBaseView = observer(() => {
    const projectStore = useContext(ProjectStoreCTX)
    const toForm = useCallback(() => {
        async function loadRequests() {
            // await projectStore.getCategory()
            projectStore.selectedProjectScreen = 2
        }
        loadRequests()
    }, [projectStore]);

    const setSwitch = useCallback(() => {
        projectStore.isDashboardSwitch = !projectStore.isDashboardSwitch
    }, [projectStore]);

    return (
        <>
            <div className="p-6 bg-gray-100">
                <div className="flex items-center justify-between mb-6">
                    {/* Title */}
                    <h1 className="text-xl font-bold text-gray-800">
                        HCDT Development Projects Dashboard
                    </h1>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                            <span className="text-sm text-gray-600 mr-2">Charts</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={!projectStore.isDashboardSwitch}
                                    onChange={setSwitch}
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-700 peer-checked:bg-blue-600"></div>
                                <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5"></div>
                            </label>
                            <span className="text-sm text-gray-600 ml-2">Table</span>
                        </div>

                        <Button
                            buttonText="Add a Project"
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                            onClick={toForm}
                        />
                    </div>
                </div>


            </div>
            <div className="bg-white rounded-lg ">
                {projectStore.isDashboardSwitch && (
                    <div>
                        {projectStore.isDashboardLoading ? (
                            <DashboardSkeleton />
                        ) : (<ProjectDashboard />
                        )}
                    </div>
                )}
                {!projectStore.isDashboardSwitch && (
                    <div><ProjectTable /></div>
                )}
            </div>
        </>
    );

});

export default ProjectBaseView;