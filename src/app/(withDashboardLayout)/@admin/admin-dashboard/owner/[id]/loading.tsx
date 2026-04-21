const AdminOwnerDetailsLoading = () => {
  return (
    <section className="space-y-6 p-4 md:p-6">
      <div className="h-8 w-64 animate-pulse rounded bg-secondary/20" />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="h-24 animate-pulse rounded-2xl bg-secondary/10" />
        ))}
      </div>
      <div className="h-28 animate-pulse rounded-2xl bg-secondary/10" />
      <div className="grid gap-5 md:grid-cols-2">
        <div className="h-24 animate-pulse rounded-2xl bg-secondary/10" />
        <div className="h-24 animate-pulse rounded-2xl bg-secondary/10" />
      </div>
    </section>
  );
};

export default AdminOwnerDetailsLoading;
