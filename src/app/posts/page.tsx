"use client";

import { formatDate } from "@/lib/helper";
import CustomTable from "@/components/custom-components/CustomTable";
import { useState, useEffect } from "react";
import { getAPI } from "@/lib/helper";

const columns = [
  {
    label: "Title",
    render: (data: any) => (
      <p className="flex justify-center">{data?.title || "-"}</p>
    ),
  },
  {
    label: "Status",
    render: (data: any) => (
      <p className="flex justify-center">{data.status || "-"}</p>
    ),
  },
  {
    label: "description",
    render: (data: any) => (
      <p className="flex justify-center">{data?.description || "-"}</p>
    ),
  },
  {
    label: "Lowest Bid",
    render: (data: any) => (
      <p className="flex justify-center">
        {data?.postBids?.lowestBid?.amount || "-"}
      </p>
    ),
  },
  {
    label: "Lowest Bid Date",
    render: (data: any) => (
      <p className="flex justify-center">
        {data?.created_at
          ? formatDate(data?.postBids?.lowestBid?.created_at)
          : "-"}
      </p>
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
  const [posts, setPosts] = useState([]);

  const fetchUsers = async () => {
    const response = await getAPI("post", undefined);
    if (response.status === 200) {
      setPosts(response?.data?.data);
    }
  };

  useEffect(() => {
    if (!posts.length) {
      fetchUsers();
    }
  }, []);
  return (
    <>
      <CustomTable columns={columns} data={posts} />
    </>
  );
}
