import DashboardLayout from "./layout/layout";

type MainDashboardLayoutProps = {
  children: React.ReactNode;
  admin: React.ReactNode;
  owner: React.ReactNode;
  customer: React.ReactNode;
};

const MainDashboardLayout = ({
  children,
  admin,
  owner,
  customer,
}: MainDashboardLayoutProps) => {
  return (
    <div>
      <DashboardLayout admin={admin} owner={owner} customer={customer}>
        {children}
      </DashboardLayout>
    </div>
  );
};

export default MainDashboardLayout;
