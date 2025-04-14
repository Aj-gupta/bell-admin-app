"use client";

import CustomTable from "@/components/custom-components/CustomTable";
import { useState, useEffect } from "react";
import { formatDate, patchAPI, getAPI } from "@/lib/helper";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";

const columns: any[] = [
  {
    label: "Order Id",
    valueGetter: (data: any) => data?.order_id || "-",
    render: (data: any) => (
      <p className="w-[200px] truncate">{data?.order_id || "-"}</p>
    ),
  },
  {
    label: "Payment Id",
    valueGetter: (data: any) => data.payment_id || "-",
    render: (data: any) => (
      <p className="w-[200px] truncate">{data.payment_id || "-"}</p>
    ),
  },
  {
    label: "Payment Type",
    valueGetter: (data: any) =>
      data?.pg_type === "offline" ? "COD" : "ONLINE",
    render: (data: any) => (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium
        ${
          data?.pg_type === "offline"
            ? "bg-purple-100 text-purple-800"
            : "bg-blue-100 text-blue-800"
        }`}
      >
        {data?.pg_type === "offline" ? "COD" : "ONLINE"}
      </span>
    ),
    filter: true,
  },
  {
    label: "Post Title",
    valueGetter: (data: any) => data?.post?.title || "-",
    render: (data: any) => (
      <p className="w-[200px] truncate">{data?.post?.title || "-"}</p>
    ),
  },
  {
    label: "Order Status",
    valueGetter: (data: any) =>
      data?.status ? data.status.split("_").join(" ").toUpperCase() : "-",
    render: (data: any) => (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium
        ${
          data?.status === OrderStatus.DELIVERED
            ? "bg-green-100 text-green-800"
            : data?.status === OrderStatus.CANCELED
            ? "bg-red-100 text-red-800"
            : data?.status === OrderStatus.PROCESSING
            ? "bg-blue-100 text-blue-800"
            : "bg-gray-100 text-gray-800"
        }`}
      >
        {data?.status ? data.status.split("_").join(" ").toUpperCase() : "-"}
      </span>
    ),
  },
  {
    label: "Payment Status",
    valueGetter: (data: any) =>
      data?.payment_status
        ? data.payment_status.split("_").join(" ").toUpperCase()
        : "-",
    render: (data: any) => (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium
        ${
          data?.payment_status === PaymentStatus.PAYMENT_SUCCESSFUL
            ? "bg-green-100 text-green-800"
            : data?.payment_status === PaymentStatus.PAYMENT_FAILED
            ? "bg-red-100 text-red-800"
            : data?.payment_status === PaymentStatus.PAYMENT_PENDING
            ? "bg-yellow-100 text-yellow-800"
            : "bg-gray-100 text-gray-800"
        }`}
      >
        {data?.payment_status
          ? data.payment_status.split("_").join(" ").toUpperCase()
          : "-"}
      </span>
    ),
    filter: true,
  },
  {
    label: "Platfrom fee (%)",
    valueGetter: (data: any) => data?.platform_fee || "-",
    render: (data: any) => (
      <p className="w-[200px] truncate">{data?.platform_fee || "-"}</p>
    ),
  },
  {
    label: "Transaction Amount",
    valueGetter: (data: any) => data.amount || "-",
    render: (data: any) => (
      <p className="w-[200px] truncate">{data.amount || "-"}</p>
    ),
  },
  {
    label: "Created",
    valueGetter: (data: any) =>
      data?.created_at ? formatDate(data?.created_at) : "-",
    render: (data: any) => (
      <p className=" truncate">
        {data?.created_at ? formatDate(data?.created_at) : "-"}
      </p>
    ),
  },
];

const OrderStatus = {
  INITIATED: "initiated",
  ORDER_CONFIRMED: "order_confirmed",
  PROCESSING: "processing",
  PACKED: "packed",
  SHIPPED: "shipped",
  OUT_FOR_DELIVERY: "out_for_delivery",
  DELIVERED: "delivered",
  CANCELED: "canceled",
  RETURNED: "returned",
};

const PaymentStatus = {
  PAYMENT_INITIATED: "payment_initiated",
  PAYMENT_PENDING: "payment_pending",
  PAYMENT_SUCCESSFUL: "payment_successful",
  PAYMENT_FAILED: "payment_failed",
  REFUNDED: "refunded",
};

export default function Transactions() {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [selectedOrderStatus, setSelectedOrderStatus] = useState<
    string | undefined
  >(undefined);
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<
    string | undefined
  >(undefined);
  const fetchTransactions = async () => {
    const response = await getAPI("order", undefined);
    if (response.status === 200) {
      setOrders(response?.data?.data);
    }
    setLoading(false);
  };

  const handleStatusChange = (order: any) => {
    console.log(order, "order");
    setSelectedOrder(order);
    setSelectedOrderStatus(order?.status);
    setSelectedPaymentStatus(order?.payment_status);
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      await patchAPI(`order/${selectedOrder?._id}`, {
        status: selectedOrderStatus,
        payment_status: selectedPaymentStatus,
      });
    } catch (error: any) {
      alert(
        `Failed to update order status. Please try again. ${
          error?.message || error?.data?.messsage || "Something went wrong"
        }`
      );
    } finally {
      fetchTransactions();
      setIsModalOpen(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    if (!orders.length) {
      fetchTransactions();
    }

    if (columns[columns.length - 1].label != "Actions") {
      columns.push({
        label: "Actions",
        sticky: true,
        render: (data: any) => (
          <div className="w-[120px] text-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStatusChange(data)}
            >
              Change Status
            </Button>
          </div>
        ),
      });
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
          <>
            <CustomTable columns={columns} data={orders} />

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Order</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Order Status</label>
                    <Select
                      value={selectedOrderStatus}
                      onValueChange={setSelectedOrderStatus}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select order status" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(OrderStatus).map(([key, value]) => (
                          <SelectItem key={key} value={value}>
                            {key.split("_").join(" ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Payment Status
                    </label>
                    <Select
                      value={selectedPaymentStatus}
                      onValueChange={setSelectedPaymentStatus}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment status" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(PaymentStatus).map(([key, value]) => (
                          <SelectItem key={key} value={value}>
                            {key.split("_").join(" ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsModalOpen(false);
                        setSelectedOrder(null);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSubmit}>Update</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>
    </>
  );
}
