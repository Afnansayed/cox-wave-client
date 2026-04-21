"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { IOwner, IOwnersListData } from "@/types/account.types";

export const getOwners = async (queryString?: string) => {
  try {
    return await httpClient.get<IOwnersListData>(
      queryString ? `/owner?${queryString}` : "/owner",
    );
  } catch (error) {
    console.error("Error fetching owners:", error);
    throw error;
  }
};

export const getOwnerById = async (id: string) => {
  try {
    return await httpClient.get<IOwner>(`/owner/${id}`);
  } catch (error) {
    console.error("Error fetching owner details:", error);
    throw error;
  }
};

export const updateOwnerApprovalStatus = async (id: string) => {
  try {
    return await httpClient.patch<IOwner>(`/owner/approval/${id}`, undefined);
  } catch (error) {
    console.error("Error updating owner approval status:", error);
    throw error;
  }
};

export const createOwner = async (formData: FormData) => {
  try {
    return await httpClient.post<IOwner>("/user/create-owner", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  } catch (error) {
    console.error("Error creating owner:", error);
    throw error;
  }
};

export const getMyProfileOwner = async () => {
  try {
    return await httpClient.get<IOwner>(`/owner/profile`);
  } catch (error) {
    console.error("Error fetching owner profile:", error);
    throw error;
  }
};

export const updateOwnerProfile = async (formData: FormData) => {
  try {
    return await httpClient.patch<IOwner>("/owner/profile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  } catch (error) {
    console.error("Error updating owner profile:", error);
    throw error;
  }
};


