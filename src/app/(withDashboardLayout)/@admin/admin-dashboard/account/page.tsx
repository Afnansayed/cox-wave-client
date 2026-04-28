
import UserCommonProfile from "@/components/module/user/UserCommonProfile";
import { getAdminProfile } from "@/components/services/user.service";



const AdminAccountPage = async () => {

  const  {data }=  await getAdminProfile();

  // console.log("Admin Profile Data", data);
   return (
    <section className="p-6">
      <UserCommonProfile user={data}  role="ADMIN"/>
    </section>
  );
};

export default AdminAccountPage;
