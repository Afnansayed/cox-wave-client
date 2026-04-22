'use server';
import { httpClient } from "@/lib/axios/httpClient";
import { IAdmin, ICustomer } from "@/types/account.types";



export const getCustomerProfile= async () => {
  try {
    return await httpClient.get<ICustomer>(`/customer/profile`);
  } catch (error) {
    console.error("Error fetching customer details:", error);
    throw error;
  }
};

export const updateCustomerProfile = async (formData: FormData) => {
  try {
    return await httpClient.patch<ICustomer>(`/customer/profile`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  } catch (error) {
    console.error("Error updating customer profile:", error);
    throw error;
  }
}


export const getAdminProfile = async () => {
  try {
    return await httpClient.get<IAdmin>(`/admin/profile`);
  } catch (error) {
    console.error("Error fetching admin details:", error);
    throw error;
  }
};

export const updateAdminProfile = async (formData: FormData) => {
  try {
    return await httpClient.patch<IAdmin>(`/admin/profile`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  } catch (error) {
    console.error("Error updating admin profile:", error);
    throw error;
  }
}