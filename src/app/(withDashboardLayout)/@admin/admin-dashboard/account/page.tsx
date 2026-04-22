import AdminProfile from "@/components/module/user/AdminProfile";
import { getAdminProfile } from "@/components/services/user.service";



const AdminAccountPage = async () => {

  const  {data }=  await getAdminProfile();

  console.log("Admin Profile Data", data);
   return (
    <section className="p-6">
      <AdminProfile admin={data} />
    </section>
  );
};

export default AdminAccountPage;
