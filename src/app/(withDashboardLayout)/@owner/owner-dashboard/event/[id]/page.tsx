import DashboardEventDetails from "@/components/module/event/DashboardEventDetails";

const OwnerEventDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  return <DashboardEventDetails id={id} basePath="/owner-dashboard/event" />;
};

export default OwnerEventDetailsPage;
