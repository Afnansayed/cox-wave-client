
import UserCommonProfile from "@/components/module/user/UserCommonProfile";

import { getCustomerProfile } from "@/components/services/user.service";


const CustomerAccountPage = async () => {
  const {data: customer} = await getCustomerProfile(); // Fetch customer profile data
  return (
    <div>
          <UserCommonProfile user={customer}  role="CUSTOMER"/>
    </div>
  );
};

export default CustomerAccountPage;
