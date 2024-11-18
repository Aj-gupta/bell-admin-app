"use client";

import { formatDate } from "@/lib/helper";
import CustomTable from "@/components/custom-components/CustomTable";
import { useState, useEffect } from "react";
import { getAPI } from "@/lib/helper";

const columns = [
  {
    label: "Order Id",
    render: (data: any) => (
      <p className="flex justify-center">{data?.order_id || "-"}</p>
    ),
  },
  {
    label: "Payment Id",
    render: (data: any) => (
      <p className="flex justify-center">{data.payment_id || "-"}</p>
    ),
  },
  {
    label: "Post Title",
    render: (data: any) => (
      <p className="flex justify-center">{data?.post?.title || "-"}</p>
    ),
  },
  {
    label: "Platfrom fee",
    render: (data: any) => (
      <p className="flex justify-center">{data?.platform_fee || "-"}</p>
    ),
  },
  {
    label: "Transaction Amount",
    render: (data: any) => (
      <p className="flex justify-center">{data.amount || "-"}</p>
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
  const [orders, setOrders] = useState([]);

  const fetchTransactions = async () => {
    const response = await getAPI("order", undefined);
    if (response.status === 200) {
      setOrders(response?.data?.data);
    }
  };

  useEffect(() => {
    if (!orders.length) {
      fetchTransactions();
    }
  }, []);
  return <CustomTable columns={columns} data={orders} />;
}
