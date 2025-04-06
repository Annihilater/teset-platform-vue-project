import { ref, onMounted, computed } from "vue";
import type { Project, ProjectStatus } from "@/mock/types/project";
import { ProjectService } from "@/mock/services/project";

export const selectedProject = ref<Project | null>(null);
export const projects = ref<Project[]>([]);
export const searchQuery = ref("");
export const statusFilter = ref("all");

export const filteredProjects = computed(() => {
  let result = projects.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (project) =>
        project.name.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query)
    );
  }

  if (statusFilter.value !== "all") {
    result = result.filter((project) => project.status === statusFilter.value);
  }

  return result;
});

export const getStatusText = (status: ProjectStatus) => {
  switch (status) {
    case "active":
      return "活跃";
    case "inactive":
      return "不活跃";
    default:
      return status;
  }
};

export const loadProjects = async () => {
  projects.value = await ProjectService.getProjectList();
};
