import UpdateCommonProfile from "@/components/module/user/UpdateProfile";
import { getAdminProfile } from "@/components/services/user.service";



 const UpdateAdmin = async () => {
    const  { data }= await  getAdminProfile();
    return (
        <div>
         <UpdateCommonProfile user={data} role={"ADMIN"}/>
        </div>
    )
};

export default UpdateAdmin;