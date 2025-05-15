import { createContext, useCallback, useContext } from "react";
import { Button } from "../../../../components/elements";
import { observer } from "mobx-react-lite";
import { projectStore as ProjectStore } from "../../store/projectStore";

const ProjectStoreCTX = createContext(ProjectStore)
const ProjectDashboard = observer(() => {
    const projectStore = useContext(ProjectStoreCTX)

    const toForm = useCallback(() => {
        async function loadRequests() {
            await projectStore.getCategory()
            projectStore.selectedProjectScreen = 2
        }
        loadRequests()
    }, [projectStore]);

    return (
        <div className="p-6 bg-gray-100">
            <div className="flex items-center justify-between mb-6">
                {/* Title */}
                <h1 className="text-xl font-bold text-gray-800">
                    HCDT Development Projects Dashboard
                </h1>
                <Button
                    buttonText="Add a Project"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    onClick={toForm}
                />
            </div>

        </div>
    );
});

export default ProjectDashboard;