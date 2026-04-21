const AdminCreateOwnerLoading = () => {
  return (
    <section className="space-y-6 p-4 md:p-6">
      <div className="space-y-2">
        <div className="h-8 w-48 animate-pulse rounded bg-secondary/20" />
        <div className="h-4 w-72 animate-pulse rounded bg-secondary/10" />
      </div>
      <div className="rounded-2xl border bg-white p-5 shadow-sm md:p-6">
        <div className="grid gap-4 md:grid-cols-2">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="h-10 animate-pulse rounded bg-secondary/10" />
          ))}
          <div className="md:col-span-2 h-24 animate-pulse rounded bg-secondary/10" />
        </div>
      </div>
    </section>
  );
};

export default AdminCreateOwnerLoading;
