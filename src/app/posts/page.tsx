"use client";

import { formatDate } from "@/lib/helper";
import CustomTable from "@/components/custom-components/CustomTable";
import Details from "./details";
import { useState, useEffect } from "react";
import { getAPI } from "@/lib/helper";
import { Spinner } from "@/components/ui/spinner";

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
    label: "Accepted Bid",
    render: (data: any) => (
      <p className="w-[200px] truncate">{data?.acceptedBid?.amount || "-"}</p>
    ),
  },
  {
    label: "Accepted Bid Date",
    render: (data: any) => {
      return (
        <p className="truncate">
          {data?.acceptedBid?.created_at
            ? formatDate(data?.acceptedBid?.created_at)
            : "-"}
        </p>
      );
    },
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
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    setLoading(true);
    const response = await getAPI("post", undefined);
    if (response.status === 200) {
      setPosts(response?.data?.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!posts.length) {
      fetchPosts();
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
            data={posts}
            isDetails
            DetailComponent={Details}
          />
        )}
      </div>
    </>
  );
}
