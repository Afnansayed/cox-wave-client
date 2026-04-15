import { redirect } from "next/navigation";


const page = () => {
  return redirect("/customer-dashboard/account");
};

export default page;
