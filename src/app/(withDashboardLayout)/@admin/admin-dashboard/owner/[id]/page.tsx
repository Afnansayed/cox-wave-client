import { notFound } from "next/navigation";
import AdminOwnerDetails from "@/components/module/owner/AdminOwnerDetails";
import { getOwnerById } from "@/components/services/owner.service";

const AdminOwnerDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const response = await getOwnerById(id);

  if (!response.success || !response.data) {
    notFound();
  }

  return <AdminOwnerDetails owner={response.data} />;
};

export default AdminOwnerDetailsPage;
