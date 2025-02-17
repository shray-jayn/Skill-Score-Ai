import apiClient from "./api.service";
import {
  FileStatus,
  FileMetadata,
  PaginationRequest,
  CreateUploadUrlRequest,
  CreateUploadUrlResponse,
  UpdateMetadataRequest,
  SearchFilesRequest,
  SearchFilesResponse,
  DownloadUrlResponse,
} from "../models/file/file.model";

export const fileService = {
  async generateUploadUrl(payload: CreateUploadUrlRequest): Promise<CreateUploadUrlResponse> {
    try {
      const response = await apiClient.post("/files/upload-url", payload);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Insufficient storage quota.";
      console.error("Failed to generate upload URL:", errorMessage);
      throw new Error(errorMessage);
    }
  },

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

  async getFileMetadata(fileId: string): Promise<FileMetadata> {
    try {
      const response = await apiClient.get(`/files/${fileId}`);
      return response.data.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Unable to retrieve file metadata.";
      console.error("Failed to retrieve file metadata:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  async updateMetadata(payload: UpdateMetadataRequest): Promise<FileMetadata> {
    try {
      const response = await apiClient.put("/files/metadata", payload);
      return response.data.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Unable to update file metadata.";
      console.error("Failed to update file metadata:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  async searchFiles(payload: SearchFilesRequest): Promise<SearchFilesResponse[]> {
    try {
      const response = await apiClient.get("/files/search", { params: payload });
      return response.data.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Unable to search files.";
      console.error("Failed to search files:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  async generateDownloadUrl(fileId: string): Promise<DownloadUrlResponse> {
    try {
      const response = await apiClient.get(`/files/download-url/${fileId}`);
      return response.data.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Unable to generate download URL.";
      console.error("Failed to generate download URL:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  async deleteFile(fileId: string): Promise<void> {
    try {
      await apiClient.delete(`/files/${fileId}`);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Unable to delete file.";
      console.error("Failed to delete file:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  async updateFileStatus(fileId: string, status: FileStatus): Promise<void> {
    try {
      await apiClient.post(`/files/update-status/${fileId}`, { status });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Unable to update file status.";
      console.error("Failed to update file status:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  async toggleFavorite(fileId: string, isFavorite: boolean): Promise<void> {
    try {
      await apiClient.put(`/files/toggle-favorite/${fileId}`, { isFavorite });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Unable to toggle favorite status.";
      console.error("Failed to toggle favorite status:", errorMessage);
      throw new Error(errorMessage);
    }
  },
};
