import UpdateAdminProfile from "@/components/module/user/UpdateProfile";
import { getAdminProfile } from "@/components/services/user.service";



 const UpdateAdmin = async () => {
    const  {data }= await  getAdminProfile();
    return (
        <div>
         <UpdateAdminProfile admin={data} />
        </div>
    )
};

export default UpdateAdmin;