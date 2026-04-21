"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Building2, Search, ShieldCheck } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/Common/Pagination";
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable";
import { getOwners } from "@/components/services/owner.service";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

const OWNER_ALLOWED_QUERY_KEYS = new Set([
  "page",
  "limit",
  "sortBy",
  "sortOrder",
  "searchTerm",
  "isApproved",
]);

const getSanitizedOwnerQueryString = (queryString: string) => {
  const currentParams = new URLSearchParams(queryString);
  const sanitizedParams = new URLSearchParams();

  currentParams.forEach((value, key) => {
    if (!OWNER_ALLOWED_QUERY_KEYS.has(key)) {
      return;
    }

    const normalizedValue = value.trim();
    if (!normalizedValue) {
      return;
    }

    sanitizedParams.set(key, normalizedValue);
  });

  return sanitizedParams.toString();
};

const AdminOwnerDashboard = () => {
  const searchParams = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get("searchTerm") || "");

  const {
    queryStringFromUrl,
    optimisticPaginationState,
    optimisticSortingState,
    isRouteRefreshPending,
    updateParams,
    handlePaginationChange,
    handleSortingChange,
  } = useServerManagedDataTable({
    searchParams,
    defaultPage: DEFAULT_PAGE,
    defaultLimit: DEFAULT_LIMIT,
  });

  const queryString = useMemo(() => {
    return getSanitizedOwnerQueryString(queryStringFromUrl);
  }, [queryStringFromUrl]);

  const { data: ownerResponse, isLoading, isFetching } = useQuery({
    queryKey: ["owners", queryString],
    queryFn: () => getOwners(queryString),
  });

  const owners = Array.isArray(ownerResponse?.data?.data) ? ownerResponse.data.data : [];
  const meta = ownerResponse?.data?.meta;
  const totalPages = meta?.total ? Math.ceil(meta.total / (meta.limit || DEFAULT_LIMIT)) : 1;

  const isBusy = isLoading || isFetching || isRouteRefreshPending;

  const sortValue = optimisticSortingState[0]
    ? `${optimisticSortingState[0].id}:${optimisticSortingState[0].desc ? "desc" : "asc"}`
    : "default";

  const handleSearch = () => {
    updateParams({
      searchTerm: searchInput.trim() || undefined,
      page: "1",
    });
  };



  const handleSortChange = (value: string) => {
    if (value === "default") {
      handleSortingChange([]);
      return;
    }

    const [sortBy, sortOrder] = value.split(":");
    handleSortingChange([{ id: sortBy, desc: sortOrder === "desc" }]);
  };

  const clearAll = () => {
    setSearchInput("");
    updateParams(
      {
        searchTerm: undefined,
        isApproved: undefined,
        sortBy: undefined,
        sortOrder: undefined,
        limit: String(DEFAULT_LIMIT),
        page: "1",
      },
      false,
    );
  };

  return (
    <section className="space-y-6 p-4 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Owner Management</h1>
          <p className="text-sm text-muted-foreground">Total Owners: {meta?.total ?? 0}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" className="bg-primary text-white font-bold py-2" size="sm">
            <Link href="/admin-dashboard/owner/create">Create New Owner</Link>
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-3 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search by owner name or business name"
              className="pl-9"
              disabled={isBusy}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button type="button" onClick={handleSearch} disabled={isBusy}>
              Search
            </Button>

            <select
              value={sortValue}
              onChange={(e) => handleSortChange(e.target.value)}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="default">Sort</option>
              <option value="createdAt:desc">Newest</option>
              <option value="createdAt:asc">Oldest</option>
              <option value="name:asc">Name A-Z</option>
              <option value="rating:desc">Top Rated</option>
              <option value="total_reviews:desc">Most Reviews</option>
            </select>

            <Button type="button" variant="outline" onClick={clearAll} disabled={isBusy}>
              Clear
            </Button>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">Owner</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">Business</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">Phone</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">Rating</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">Reviews</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">Approval</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">Created</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {isBusy ? (
                [...Array(4)].map((_, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-4" colSpan={8}>
                      <div className="h-10 animate-pulse rounded bg-muted/40" />
                    </td>
                  </tr>
                ))
              ) : owners.length === 0 ? (
                <tr>
                  <td className="px-4 py-12 text-center text-sm text-muted-foreground" colSpan={8}>
                    No owners found.
                  </td>
                </tr>
              ) : (
                owners.map((owner) => (
                  <tr key={owner.id} className="border-t align-top">
                    <td className="px-4 py-4">
                      <p className="font-medium">{owner.name}</p>
                      <p className="text-xs text-muted-foreground">{owner.email}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-medium">{owner.business_name || "N/A"}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {owner.business_address || "No business address"}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-sm text-muted-foreground">{owner.phone_number || "N/A"}</td>
                    <td className="px-4 py-4 font-semibold">{owner.rating ?? 0}</td>
                    <td className="px-4 py-4 font-semibold">{owner.total_reviews}</td>
                    <td className="px-4 py-4">
                      <Badge className={owner.isApproved ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}>
                        {owner.isApproved ? "APPROVED" : "PENDING"}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 text-sm text-muted-foreground">
                      {new Date(owner.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/admin-dashboard/owner/${owner.id}`}>
                          <Building2 className="mr-2 h-4 w-4" />
                          View Details
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Showing {owners.length} records
        </p>

        <Pagination
          currentPage={optimisticPaginationState.pageIndex + 1}
          totalPages={totalPages}
          isLoading={isBusy}
          onPageChange={(page) => {
            handlePaginationChange({
              pageIndex: page - 1,
              pageSize: optimisticPaginationState.pageSize,
            });
          }}
        />
      </div>
    </section>
  );
};

export default AdminOwnerDashboard;
