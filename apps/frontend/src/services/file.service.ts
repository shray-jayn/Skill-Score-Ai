import apiClient from "./api.service";
import {
  FileMetadata,
  PaginationRequest,
} from "../models/file/file.model";

export const fileService = {

  async getAllFiles(pagination: PaginationRequest): Promise<FileMetadata[]> {
    try {
      const { limit, offset, orderBy = [] } = pagination;
      const orderByFields = orderBy.map((field) => ({
        [field.field]: field.direction,
      }));

      const response = await apiClient.get("/files", {
        params: { limit, offset, orderBy: orderByFields },
      });

      return response.data.data.map((file: any) => ({
        ...file,
        createdAt: new Date(file.createdAt).toISOString(),
        updatedAt: new Date(file.updatedAt).toISOString(),
      }));
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Unable to retrieve files.";
      console.error("Failed to retrieve files:", errorMessage);
      throw new Error(errorMessage);
    }
  },
};
