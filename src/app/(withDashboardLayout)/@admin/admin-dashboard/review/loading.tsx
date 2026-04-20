const AdminReviewLoading = () => {
  return (
    <section className="space-y-6 p-4 md:p-6">
      <div className="space-y-2">
        <div className="h-8 w-56 animate-pulse rounded-lg bg-secondary/20" />
        <div className="h-4 w-40 animate-pulse rounded bg-secondary/10" />
      </div>

      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-left">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3"><div className="h-3 w-16 animate-pulse rounded bg-secondary/20" /></th>
                <th className="px-4 py-3"><div className="h-3 w-20 animate-pulse rounded bg-secondary/20" /></th>
                <th className="px-4 py-3"><div className="h-3 w-14 animate-pulse rounded bg-secondary/20" /></th>
                <th className="px-4 py-3"><div className="h-3 w-20 animate-pulse rounded bg-secondary/20" /></th>
                <th className="px-4 py-3"><div className="h-3 w-14 animate-pulse rounded bg-secondary/20" /></th>
                <th className="px-4 py-3"><div className="h-3 w-14 animate-pulse rounded bg-secondary/20" /></th>
                <th className="px-4 py-3"><div className="h-3 w-16 animate-pulse rounded bg-secondary/20" /></th>
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-4"><div className="h-4 w-36 animate-pulse rounded bg-secondary/10" /></td>
                  <td className="px-4 py-4"><div className="h-4 w-44 animate-pulse rounded bg-secondary/10" /></td>
                  <td className="px-4 py-4"><div className="h-4 w-10 animate-pulse rounded bg-secondary/10" /></td>
                  <td className="px-4 py-4"><div className="h-4 w-64 animate-pulse rounded bg-secondary/10" /></td>
                  <td className="px-4 py-4"><div className="h-6 w-20 animate-pulse rounded-full bg-secondary/10" /></td>
                  <td className="px-4 py-4"><div className="h-4 w-24 animate-pulse rounded bg-secondary/10" /></td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      <div className="h-8 w-20 animate-pulse rounded bg-secondary/10" />
                      <div className="h-8 w-16 animate-pulse rounded bg-secondary/10" />
                      <div className="h-8 w-24 animate-pulse rounded bg-secondary/10" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default AdminReviewLoading;