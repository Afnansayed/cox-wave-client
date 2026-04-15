import { redirect } from "next/navigation";


const page = () => {
  return redirect("/admin-dashboard/account");
};

export default page;
