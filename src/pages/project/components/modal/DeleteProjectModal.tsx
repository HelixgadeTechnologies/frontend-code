import { Button } from "../../../../components/elements";
import { MdDeleteForever } from "react-icons/md";

interface DeleteProjectModalProps {
    projectTitle: string;
    onDelete: () => void;
    onClose: () => void;
    isDeleting: boolean;
}

export const DeleteProjectModal = ({ projectTitle, onDelete, onClose, isDeleting }: DeleteProjectModalProps) => {
    return (
        <div className="bg-white p-8 rounded-2xl max-w-md w-full shadow-xl transform transition-all animate-fade-in">
            <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
                    <MdDeleteForever className="text-red-500 text-3xl" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Project?</h3>
                <p className="text-gray-500 mb-8">
                    Are you sure you want to delete <span className="font-semibold text-gray-800">"{projectTitle}"</span>? This action cannot be undone.
                </p>

                <div className="flex gap-4 w-full">
                    <Button
                        type="button"
                        buttonText="Cancel"
                        className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors font-semibold"
                        onClick={onClose}
                    />
                    <Button
                        type="button"
                        buttonText={isDeleting ? "Deleting..." : "Delete Project"}
                        className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors font-semibold shadow-lg shadow-red-200"
                        onClick={onDelete}
                        disabled={isDeleting}
                    />
                </div>
            </div>
        </div>
    );
};
