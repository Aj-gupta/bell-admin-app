"use client";

import { formatDate } from "@/lib/helper";
import CustomTable from "@/components/custom-components/CustomTable";
import { useState, useEffect } from "react";
import { getAPI, patchAPI } from "@/lib/helper";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import Details from "./details";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleApproveUser = async (userId: string) => {
    try {
      setLoading(true);
      const response = await patchAPI(`user/seller/${userId}/approve`, {});
      if (response.status === 200) {
        // Refresh the users list
        fetchUsers();
      }
    } catch (error) {
      console.error("Failed to approve user:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    const response = await getAPI("user/all", undefined);
    if (response.status === 200) {
      setUsers(response?.data?.data);
    }
    setLoading(false);
  };

  const columns = [
    {
      label: "Name",
      valueGetter: (data: any) => data?.profile?.full_name || "-",
      render: (data: any) => (
        <p className="flex justify-center">{data?.profile?.full_name || "-"}</p>
      ),
    },
    {
      label: "Phone",
      valueGetter: (data: any) => data.phone || "-",
      render: (data: any) => (
        <p className="flex justify-center">{data.phone || "-"}</p>
      ),
    },
    {
      label: "email",
      valueGetter: (data: any) => data?.profile?.email || "-",
      render: (data: any) => (
        <p className="flex justify-center">{data?.profile?.email || "-"}</p>
      ),
    },
    {
      label: "Referral Code",
      valueGetter: (data: any) => data?.profile?.referral_code || "-",
      render: (data: any) => (
        <p className="flex justify-center">
          {data?.profile?.referral_code || "-"}
        </p>
      ),
    },
    {
      label: "Role",
      valueGetter: (data: any) => data.role?.name || "-",
      render: (data: any) => (
        <p className="flex justify-center">{data.role?.name || "-"}</p>
      ),
      filter: true,
    },
    {
      label: "Approved",
      valueGetter: (data: any) => (data.profile?.is_approved ? "Yes" : "No"),
      render: (data: any) => {
        if (data.role?.name === "seller") {
          return (
            <p className="flex justify-center">
              {data.profile?.is_approved ? "Yes" : "No"}
            </p>
          );
        }
        return <p className="flex justify-center">-</p>;
      },
    },
    {
      label: "Created",
      valueGetter: (data: any) =>
        data?.created_at ? formatDate(data?.created_at) : "-",
      render: (data: any) => (
        <p className="flex justify-center">
          {data?.created_at ? formatDate(data?.created_at) : "-"}
        </p>
      ),
    },
    {
      label: "Actions",
      sticky: true,
      render: (data: any) => (
        <div className="flex justify-center gap-2">
          {!data.profile?.is_approved && data.role?.name === "seller" && (
            <Button
              variant="outline"
              size="sm"
              className="bg-green-500 text-white hover:bg-green-600"
              onClick={() => handleApproveUser(data._id)}
            >
              Approve
            </Button>
          )}
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (!users.length) {
      fetchUsers();
    }
  }, []);

  return (
    <>
      <div className="flex flex-col w-full h-full">
        {loading ? (
          <div className="flex justify-center items-center h-full w-full">
            <Spinner />
          </div>
        ) : (
          <CustomTable
            columns={columns}
            data={users}
            isDetails
            DetailComponent={Details}
          />
        )}
      </div>
    </>
  );
}
