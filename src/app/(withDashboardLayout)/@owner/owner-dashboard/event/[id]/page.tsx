import OwnerEventDetails from "@/components/module/event/OwnerEventDetails";

const OwnerEventDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  return <OwnerEventDetails id={id} />;
};

export default OwnerEventDetailsPage;
