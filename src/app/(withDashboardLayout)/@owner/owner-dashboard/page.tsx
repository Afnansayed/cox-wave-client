import { redirect } from "next/navigation";


const page = () => {
  return redirect("/owner-dashboard/account");
};

export default page;
