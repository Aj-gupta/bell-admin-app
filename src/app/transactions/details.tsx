"use client";

import { useEffect, useState } from "react";
import { getAPI, formatDate } from "@/lib/helper";
import { Spinner } from "@/components/ui/spinner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileIcon, DownloadIcon } from "@radix-ui/react-icons";

let html2pdf: any;
interface DetailsProps {
  item: any;
}

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

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(amount);
};

const getStatusColor = (status: string) => {
  if (status) {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "canceled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "processing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  } else {
    return "";
  }
};

const getPaymentStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "payment_successful":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "payment_failed":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    case "payment_pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  }
};

const Details = ({ item }: DetailsProps) => {
  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [postUser, setPostUser] = useState<any>(null);
  const [bidUser, setBidUser] = useState<any>(null);
  const [sellerAddress, setSellerAddress] = useState<any>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const orderDetailsRes = await getAPI(`order/${item._id}`, undefined);
        if (orderDetailsRes.status === 200) {
          setOrderDetails(orderDetailsRes.data.data);
          setPostUser(orderDetailsRes.data.data.post_user);
          setBidUser(orderDetailsRes.data.data.post_bid_user);
          const response = await getAPI(
            `user/${orderDetailsRes.data.data.post_bid_user._id}/address`,
            null
          );

          setSellerAddress(
            response.data.data.filter((address: any) => address.is_primary)[0]
          );
          // @ts-ignore
          html2pdf = (await import("html2pdf.js/dist/html2pdf.min.js")).default;
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [item._id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="p-6 pb-3">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Order #{orderDetails.order_id}
          </h2>
          <div className="flex gap-2">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                orderDetails.status
              )}`}
            >
              {orderDetails.status.split("_").join(" ").toUpperCase()}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(
                orderDetails.payment_status
              )}`}
            >
              {orderDetails.payment_status.split("_").join(" ").toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      <div className="px-6 pb-6 space-y-6">
        <div className="space-y-3 bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
          <h3 className="text-sm font-semibold flex items-center gap-2 text-gray-900 dark:text-gray-100">
            Order Information
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Order ID
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {orderDetails.order_id}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Payment ID
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {orderDetails.payment_id}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Payment Type
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {orderDetails.pg_type === "offline" ? "COD" : "ONLINE"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Created At
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {formatDate(orderDetails.created_at)}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3 bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
          <h3 className="text-sm font-semibold flex items-center gap-2 text-gray-900 dark:text-gray-100">
            Post Information
          </h3>
          <div className="space-y-2">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Title</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {orderDetails.post?.title}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Description
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {orderDetails.post?.description}
              </p>
            </div>
            {orderDetails?.post_address && (
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Address
                </p>
                <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                  {orderDetails.post_address?.address_line2 && (
                    <p>{orderDetails.post_address.address_line2}</p>
                  )}
                  <p>
                    {orderDetails.post_address?.city}
                    {orderDetails.post_address?.state &&
                      `, ${orderDetails.post_address.state}`}
                    {orderDetails.post_address?.zip_code &&
                      ` - ${orderDetails.post_address.zip_code}`}
                  </p>
                  <p>{orderDetails.post_address?.country}</p>
                </div>
              </div>
            )}
            <div className="border-t pt-3 mt-3">
              <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                Posted By
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Name
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {postUser?.name || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Contact
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {postUser?.phone || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Email
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {postUser?.email || "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {orderDetails.post_bid ? (
          <div className="space-y-3 bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
            <h3 className="text-sm font-semibold flex items-center gap-2 text-gray-900 dark:text-gray-100">
              Bid Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Bid Amount
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {formatCurrency(orderDetails.post_bid.original_amount)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Bid Status
                </p>
                <span
                  className={`inline-block px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(
                    orderDetails.post_bid.status
                  )}`}
                >
                  {orderDetails.post_bid.status}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Bid Date
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {formatDate(orderDetails.post_bid.created_at)}
                </p>
              </div>
              <div className="col-span-2 border-t pt-3 mt-2">
                <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Bidder Details
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Name
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {bidUser?.name || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Contact
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {bidUser?.phone || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Email
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {bidUser?.email || "-"}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Address
                    </p>
                    <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      {sellerAddress?.address_line2 && (
                        <p>{sellerAddress.address_line2}</p>
                      )}
                      <p>
                        {sellerAddress?.city}
                        {sellerAddress?.state && `, ${sellerAddress.state}`}
                        {sellerAddress?.zip_code &&
                          ` - ${sellerAddress.zip_code}`}
                      </p>
                      <p>{sellerAddress?.country}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
        <div className="space-y-3 bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
          <div className="flex gap-4 items-center">
            <h3 className="text-sm font-semibold flex items-center gap-2 text-gray-900 dark:text-gray-100">
              Payment Breakdown
            </h3>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <FileIcon className="h-4 w-4" />
                  View Invoice
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <div className="flex justify-between items-center">
                    <DialogTitle>Payment Invoice</DialogTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => {
                        const element =
                          document.getElementById("invoice-content");
                        const opt = {
                          margin: 1,
                          filename: `invoice-${orderDetails.order_id}.pdf`,
                          image: { type: "jpeg", quality: 0.98 },
                          html2canvas: { scale: 2 },
                          jsPDF: {
                            unit: "in",
                            format: "letter",
                            orientation: "portrait",
                          },
                        };
                        html2pdf().set(opt).from(element).save();
                      }}
                    >
                      <DownloadIcon className="h-4 w-4" />
                      Download PDF
                    </Button>
                  </div>
                </DialogHeader>
                <div className="space-y-6">
                  {/* CUSTOM INVOICE SECTION */}
                  <div
                    id="invoice-content"
                    className="bg-white border rounded-lg shadow p-6 mb-8"
                  >
                    <div className="flex justify-between items-center mb-6">
                      <div className="text-xs text-gray-400 font-semibold"></div>
                      <div className="text-xs text-gray-400">
                        NO. INV{orderDetails.order_id}
                      </div>
                    </div>
                    <h1 className="text-4xl font-extrabold mb-2">INVOICE</h1>
                    <div className="flex justify-between mb-6">
                      <div>
                        <span className="font-semibold">Date:</span>
                        <span className="ml-2">
                          {formatDate(orderDetails.created_at)}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap justify-between mb-6 gap-8">
                      <div>
                        <div className="font-bold mb-1">Billed to:</div>
                        <div>{orderDetails.post_address?.address_line2}</div>
                        <div>
                          {orderDetails.post_address?.city}
                          {orderDetails.post_address?.state
                            ? `, ${orderDetails.post_address.state}`
                            : ""}
                          {orderDetails.post_address?.zip_code
                            ? ` - ${orderDetails.post_address.zip_code}`
                            : ""}
                        </div>
                        <div>{orderDetails.post_address?.country}</div>
                        {postUser?.email && <div>{postUser?.email}</div>}
                      </div>
                      <div>
                        <div className="font-bold mb-1">From:</div>
                        <div>Bell App</div>
                        <div>Kolkata, West Bengal, India</div>
                        <div>buysell.bell123@gmail.com</div>
                      </div>
                    </div>
                    <div className="overflow-x-auto mb-4">
                      <table className="min-w-full text-sm border">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="px-4 py-2 text-left font-semibold">
                              Item
                            </th>
                            <th className="px-4 py-2 text-left font-semibold">
                              Quantity
                            </th>
                            <th className="px-4 py-2 text-right font-semibold">
                              Price
                            </th>
                            <th className="px-4 py-2 text-right font-semibold">
                              Amount
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="px-4 py-2 border-t">
                              {orderDetails.post?.title || "Post"}
                            </td>
                            <td className="px-4 py-2 border-t">1</td>
                            <td className="px-4 py-2 border-t text-right">
                              {formatCurrency(
                                orderDetails.post_bid.original_amount
                              )}
                            </td>
                            <td className="px-4 py-2 border-t text-right">
                              {formatCurrency(
                                orderDetails.post_bid.original_amount
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 border-t">Delivery Fee</td>
                            <td className="px-4 py-2 border-t">1</td>
                            <td className="px-4 py-2 border-t text-right">
                              {formatCurrency(
                                ((orderDetails.amount -
                                  orderDetails.post_bid.original_amount) *
                                  orderDetails.delivery_fee_percentage) /
                                  100
                              )}
                            </td>
                            <td className="px-4 py-2 border-t text-right">
                              {formatCurrency(
                                ((orderDetails.amount -
                                  orderDetails.post_bid.original_amount) *
                                  orderDetails.delivery_fee_percentage) /
                                  100
                              )}
                            </td>
                          </tr>
                          {orderDetails.sellerReferral &&
                            orderDetails.sellerReferral?.amount > 0 && (
                              <tr>
                                <td className="px-4 py-2 border-t">
                                  Seller Referral Commission
                                </td>
                                <td className="px-4 py-2 border-t">1</td>
                                <td className="px-4 py-2 border-t text-right">
                                  {formatCurrency(
                                    orderDetails.sellerReferral?.amount || 0
                                  )}
                                </td>
                                <td className="px-4 py-2 border-t text-right">
                                  {formatCurrency(
                                    orderDetails.sellerReferral?.amount || 0
                                  )}
                                </td>
                              </tr>
                            )}
                          {orderDetails.buyerReferral &&
                            orderDetails.buyerReferral?.amount > 0 && (
                              <tr>
                                <td className="px-4 py-2 border-t">
                                  Buyer Referral Commission
                                </td>
                                <td className="px-4 py-2 border-t">1</td>
                                <td className="px-4 py-2 border-t text-right">
                                  {formatCurrency(
                                    orderDetails.buyerReferral?.amount || 0
                                  )}
                                </td>
                                <td className="px-4 py-2 border-t text-right">
                                  {formatCurrency(
                                    orderDetails.buyerReferral?.amount || 0
                                  )}
                                </td>
                              </tr>
                            )}
                          <tr>
                            <td className="px-4 py-2 border-t">Platform Fee</td>
                            <td className="px-4 py-2 border-t">1</td>
                            <td className="px-4 py-2 border-t text-right">
                              {formatCurrency(
                                orderDetails.amount -
                                  orderDetails.post_bid.original_amount -
                                  ((orderDetails.amount -
                                    orderDetails.post_bid.original_amount) *
                                    orderDetails.delivery_fee_percentage) /
                                    100 -
                                  (orderDetails.sellerReferral?.amount || 0) -
                                  (orderDetails.buyerReferral?.amount || 0)
                              )}
                            </td>
                            <td className="px-4 py-2 border-t text-right">
                              {formatCurrency(
                                orderDetails.amount -
                                  orderDetails.post_bid.original_amount -
                                  ((orderDetails.amount -
                                    orderDetails.post_bid.original_amount) *
                                    orderDetails.delivery_fee_percentage) /
                                    100 -
                                  (orderDetails.sellerReferral?.amount || 0) -
                                  (orderDetails.buyerReferral?.amount || 0)
                              )}
                            </td>
                          </tr>
                        </tbody>
                        <tfoot>
                          <tr>
                            <td className="px-4 py-2 font-semibold border-t"></td>
                            <td className="px-4 py-2 font-semibold border-t"></td>
                            <td className="px-4 py-2 font-semibold border-t text-right">
                              Total
                            </td>
                            <td className="px-4 py-2 font-semibold border-t text-right">
                              {formatCurrency(orderDetails.amount)}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                    <div className="mt-4">
                      <span className="font-semibold">Payment method:</span>
                      <span className="ml-2">
                        {orderDetails.pg_type === "offline" ? "Cash" : "Online"}
                      </span>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Bid Amount
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {formatCurrency(orderDetails.post_bid.original_amount)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Order Amount
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {formatCurrency(orderDetails.amount)}
                </p>
              </div>
            </div>

            <div className="border-t pt-3">
              <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                Platform & Delivery Fees
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Platform Fee
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {formatCurrency(
                      orderDetails.amount -
                        orderDetails.post_bid.original_amount -
                        ((orderDetails.amount -
                          orderDetails.post_bid.original_amount) *
                          orderDetails.delivery_fee_percentage) /
                          100 -
                        (orderDetails.sellerReferral?.amount || 0) -
                        (orderDetails.buyerReferral?.amount || 0)
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Delivery Fee ({orderDetails.delivery_fee_percentage}%)
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {formatCurrency(
                      ((orderDetails.amount -
                        orderDetails.post_bid.original_amount) *
                        orderDetails.delivery_fee_percentage) /
                        100
                    )}
                  </p>
                </div>
              </div>
            </div>

            {Object.keys(orderDetails.buyerReferral)?.length > 0 ||
            Object.keys(orderDetails.sellerReferral)?.length > 0 ? (
              <div className="border-t pt-3">
                <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Referral Commissions
                </h4>
                <div className="space-y-3">
                  {orderDetails.sellerReferral && (
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Seller Referral (
                        {orderDetails.sellerReferral?.commission_percentage}%)
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {formatCurrency(
                          orderDetails.sellerReferral?.amount || 0
                        )}
                      </p>
                      <div className="mt-1 space-y-1">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Name: {orderDetails.sellerReferral?.user?.name || "-"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Phone:{" "}
                          {orderDetails.sellerReferral?.user?.phone || "-"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Email:{" "}
                          {orderDetails.sellerReferral?.user?.email || "-"}
                        </p>
                      </div>
                    </div>
                  )}
                  {orderDetails.buyerReferral && (
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Buyer Referral (
                        {orderDetails.buyerReferral?.commission_percentage}%)
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {formatCurrency(
                          orderDetails.buyerReferral?.amount || 0
                        )}
                      </p>
                      <div className="mt-1 space-y-1">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Name: {orderDetails.buyerReferral?.user?.name || "-"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Phone:{" "}
                          {orderDetails.buyerReferral?.user?.phone || "-"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Email:{" "}
                          {orderDetails.buyerReferral?.user?.email || "-"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;
