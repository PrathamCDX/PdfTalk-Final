import React from "react";
import { FileText, Plus, Menu, X, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { PDFProject } from "@/pages/Index";
import { ThemeToggle } from "@/components/ThemeToggle";

interface SidebarProps {
  projects: PDFProject[];
  activeProjectId: string | null;
  onProjectSelect: (projectId: string) => void;
  onCreateNewProject: () => void;
  onDeleteProject: (projectId: string) => void;
  isCollapsed: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  projects,
  activeProjectId,
  onProjectSelect,
  onCreateNewProject,
  onDeleteProject,
  isCollapsed,
  onToggle,
}) => {
  const handleDeleteClick = (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    onDeleteProject(projectId);
  };

  return (
    <div className="h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-colors duration-200">
      {/* Header */}
      <div className="p-4 border-b sticky top-0 left-0 border-gray-200 dark:border-gray-700 flex items-center justify-between flex-shrink-0">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h2 className="font-semibold text-gray-900 dark:text-gray-100 py-3">
              PDF Talks
            </h2>
          </div>
        )}
        <div className="flex items-center gap-1">
          {!isCollapsed && <ThemeToggle />}
          <button
            onClick={onToggle}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            {isCollapsed ? (
              <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            ) : (
              <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            )}
          </button>
        </div>
      </div>

      {/* Projects List */}
      <div className="flex-1 h-[100vh] overflow-y-auto p-4 ">
        {!isCollapsed && (
          <>
            <div className=" flex sticky top-0 left-0 items-center justify-between mb-4  md:bg-gray-50 md:dark:bg-gray-900  z-50 border rounded-md p-3 ">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Projects
              </h3>
              <button
                onClick={onCreateNewProject}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                title="Create new project"
              >
                <Plus className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {projects.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400 text-sm py-8">
                <FileText className="w-8 h-8 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                No PDFs uploaded yet
              </div>
            ) : (
              <div className="space-y-2 h-[100vh] ">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className={cn(
                      "relative group rounded-lg transition-colors border",
                      activeProjectId === project.id
                        ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800 border-transparent"
                    )}
                  >
                    <button
                      onClick={() => onProjectSelect(project.id)}
                      className="w-full text-left p-3 rounded-lg"
                    >
                      <div className="flex items-start gap-3">
                        <FileText
                          className={cn(
                            "w-5 h-5 mt-0.5 flex-shrink-0",
                            activeProjectId === project.id
                              ? "text-blue-600 dark:text-blue-400"
                              : "text-gray-400 dark:text-gray-500"
                          )}
                        />
                        <div className="flex-1 min-w-0 pr-8">
                          <div
                            className={cn(
                              "font-medium text-sm truncate",
                              activeProjectId === project.id
                                ? "text-blue-900 dark:text-blue-100"
                                : "text-gray-900 dark:text-gray-100"
                            )}
                          >
                            {project.title}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {(() => {
                              if (!project.uploadDate) return null;
                              const dateObj =
                                typeof project.uploadDate === "string"
                                  ? new Date(project.uploadDate)
                                  : project.uploadDate;
                              return dateObj instanceof Date &&
                                !isNaN(dateObj.getTime())
                                ? dateObj.toLocaleDateString()
                                : null;
                            })()}
                          </div>
                        </div>
                      </div>
                    </button>
                    <button
                      onClick={(e) => handleDeleteClick(e, project.id)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 opacity-0 group-hover:opacity-100 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-all"
                      title="Delete project"
                    >
                      <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {isCollapsed && (
          <div className="space-y-2">
            <ThemeToggle className="w-full" />
            <button
              onClick={onCreateNewProject}
              className="w-full p-2 rounded-lg transition-colors flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 border border-transparent"
              title="Create new project"
            >
              <Plus className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>

            {projects.length > 0 &&
              projects.map((project) => (
                <div key={project.id} className="relative group">
                  <button
                    onClick={() => onProjectSelect(project.id)}
                    className={cn(
                      "w-full p-2 rounded-lg transition-colors flex items-center justify-center",
                      activeProjectId === project.id
                        ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800 border border-transparent"
                    )}
                    title={project.title}
                  >
                    <FileText
                      className={cn(
                        "w-5 h-5",
                        activeProjectId === project.id
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-gray-400 dark:text-gray-500"
                      )}
                    />
                  </button>
                  <button
                    onClick={(e) => handleDeleteClick(e, project.id)}
                    className="absolute -top-1 -right-1 p-0.5 bg-red-500 dark:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete project"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};
