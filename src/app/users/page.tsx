"use client";

import { formatDate } from "@/lib/helper";
import CustomTable from "@/components/custom-components/CustomTable";
import { useState, useEffect } from "react";
import { getAPI } from "@/lib/helper";
import { Spinner } from "@/components/ui/spinner";

const columns = [
  {
    label: "Name",
    render: (data: any) => (
      <p className="flex justify-center">{data?.profile?.full_name || "-"}</p>
    ),
  },
  {
    label: "Phone",
    render: (data: any) => (
      <p className="flex justify-center">{data.phone || "-"}</p>
    ),
  },
  {
    label: "email",
    render: (data: any) => (
      <p className="flex justify-center">{data?.profile?.email || "-"}</p>
    ),
  },
  {
    label: "Referral Code",
    render: (data: any) => (
      <p className="flex justify-center">
        {data?.profile?.referral_code || "-"}
      </p>
    ),
  },
  {
    label: "Role",
    render: (data: any) => (
      <p className="flex justify-center">{data.role?.name || "-"}</p>
    ),
  },
  {
    label: "Created",
    render: (data: any) => (
      <p className="flex justify-center">
        {data?.created_at ? formatDate(data?.created_at) : "-"}
      </p>
    ),
  },
];

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    const response = await getAPI("user/all", undefined);
    if (response.status === 200) {
      setUsers(response?.data?.data);
    }
    setLoading(false);
  };

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
          <CustomTable columns={columns} data={users} />
        )}
      </div>
    </>
  );
}
