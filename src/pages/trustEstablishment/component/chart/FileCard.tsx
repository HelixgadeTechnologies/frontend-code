import { FiTrash2, FiDownload } from "react-icons/fi";

interface FileCardProps {
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
  fileSize: string;
  onDelete?: () => void;
}

const FileCard = ({ fileName, fileUrl, uploadedAt, fileSize, onDelete }: FileCardProps) => (
  <div className="w-full flex flex-wrap sm:flex-nowrap items-center justify-between bg-white border rounded-lg p-4 mb-2 shadow-sm gap-4">
    <div className="flex items-center gap-3 min-w-0">
      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 shrink-0">
        <svg width="20" height="20" fill="none"><circle cx="10" cy="10" r="10" fill="#22C55E"/><path d="M6 10.5l2.5 2.5L14 7.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </span>
      <div className="min-w-0">
        <div className="font-medium text-gray-900 truncate" title={fileName}>{fileName}</div>
        <div className="text-xs text-gray-400 truncate">
          {uploadedAt} &nbsp;•&nbsp; {fileSize}
        </div>
      </div>
    </div>
    <div className="flex items-center gap-3 shrink-0">
      <button
        className="text-red-500 hover:text-red-700"
        onClick={onDelete}
        title="Delete"
        type="button"
      >
        <FiTrash2 size={20} />
      </button>
      <a
        href={fileUrl}
        download
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-500 hover:text-blue-600"
        title="Download"
      >
        <FiDownload size={20} />
      </a>
    </div>
  </div>
);

export default FileCard;