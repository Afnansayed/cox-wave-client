import DashboardEventDetails from "@/components/module/event/DashboardEventDetails";
import OwnerEventDetails from "@/components/module/event/DashboardEventDetails";

const AdminEventDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  return <DashboardEventDetails id={id}  basePath="/admin-dashboard/event"/>;
};

export default AdminEventDetailsPage;