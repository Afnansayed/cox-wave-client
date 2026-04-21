import CreateOwnerForm from "@/components/module/owner/CreateOwnerForm";

const AdminCreateOwnerPage = () => {
  return (
    <section className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold">Create Owner</h1>
        <p className="text-sm text-muted-foreground">
          Fill in owner details and submit as multipart form-data.
        </p>
      </div>

      <div className="rounded-2xl border bg-white p-5 shadow-sm md:p-6">
        <CreateOwnerForm />
      </div>
    </section>
  );
};

export default AdminCreateOwnerPage;
