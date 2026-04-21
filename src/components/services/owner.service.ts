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
