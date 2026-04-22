import UpdateCommonProfile from "@/components/module/user/UpdateProfile";
import { getCustomerProfile } from "@/components/services/user.service";


const CustomerUpdateProfilePage = async () => {
  const { data: customer } = await getCustomerProfile();
  return (
    <div>
        <UpdateCommonProfile user={customer} role={"CUSTOMER"}/>
    </div>
   );
};

export default CustomerUpdateProfilePage;