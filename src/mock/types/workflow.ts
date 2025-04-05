export interface Workflow {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkflowDto {
  name: string;
  description: string;
}

export interface UpdateWorkflowDto {
  name?: string;
  description?: string;
} 