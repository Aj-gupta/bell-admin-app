"use client";

import { useEffect, useState } from "react";
import { getAPI } from "@/lib/helper";
import { Spinner } from "@/components/ui/spinner";
import { formatDate } from "@/lib/helper";

interface DetailsProps {
  item: any;
}
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(amount);
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "accepted":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "initiated":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "payment_initiated":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  }
};

const Details = ({ item }: DetailsProps) => {
  const [loading, setLoading] = useState(true);
  const [postDetails, setPostDetails] = useState<any>(null);
  const [postUser, setPostUser] = useState<any>(null);
  const [postBidUser, setPostBidUser] = useState<any>(null);

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const [postDetailsRes, postUserRes, postBidUserRes] = await Promise.all(
          [
            getAPI(`post/${item._id}`, undefined),
            getAPI(`user/${item.user_id}`, undefined),
            item.acceptedBid
              ? getAPI(`user/${item.acceptedBid.user_id}`, undefined)
              : new Promise((resolve) => resolve(null)),
          ]
        );
        if (postDetailsRes.status === 200) {
          setPostDetails(postDetailsRes.data.data);
        }
        if (postUserRes.status === 200) {
          setPostUser(postUserRes.data?.user);
        }
        if (postBidUserRes.status === 200) {
          setPostBidUser(postBidUserRes.data?.user);
        }
      } catch (error) {
        console.error("Error fetching post details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPostDetails();
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
            {postDetails.title}
          </h2>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
              postDetails.status
            )}`}
          >
            {postDetails.status.charAt(0).toUpperCase() +
              postDetails.status.slice(1)}
          </span>
        </div>
      </div>

      <div className="px-6 pb-6 space-y-6">
        <div className="space-y-3 bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
          <h3 className="text-sm font-semibold flex items-center gap-2 text-gray-900 dark:text-gray-100">
            Post Details
          </h3>
          <div className="space-y-2">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Description
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {postDetails.description}
              </p>
            </div>
            {postDetails.image_urls && postDetails.image_urls.length > 0 && (
              <div className="mt-4">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Images
                </p>
                <div className="h-[300px] w-full">
                  <div className="flex gap-4 max-w-[76vw] overflow-x-scroll">
                    {postDetails.image_urls.map(
                      (image: string, index: number) => (
                        <div
                          key={index}
                          className="relative aspect-square h-[300px] w-[300px] flex-shrink-0"
                        >
                          <img
                            src={image}
                            alt={`Post image ${index + 1}`}
                            className="object-cover rounded-lg w-full h-full"
                          />
                        </div>
                      )
                    )}
                  </div>
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
                    {postUser?.profile?.full_name || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Business
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {postUser?.profile?.business_name || "-"}
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
                    {postUser?.profile?.email || "-"}
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="flex items-center gap-1.5">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Posted on
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {formatDate(postDetails.created_at)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Last updated
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {formatDate(postDetails.updated_at)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3 bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
          <h3 className="text-sm font-semibold flex items-center gap-2 text-gray-900 dark:text-gray-100">
            Address Details
          </h3>
          <div className="space-y-2">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Address Type
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {postDetails.address?.type || "-"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Address Line 1
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {postDetails.address?.address_line1 || "-"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Address Line 2
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {postDetails.address?.address_line2 || "-"}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">City</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {postDetails.address?.city || "-"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  State
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {postDetails.address?.state || "-"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Zip Code
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {postDetails.address?.zip_code || "-"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Country
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {postDetails.address?.country || "-"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {postDetails.acceptedBid && (
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
                  {formatCurrency(postDetails.acceptedBid.amount)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Bid Status
                </p>
                <span
                  className={`inline-block px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(
                    postDetails.acceptedBid.status
                  )}`}
                >
                  {postDetails.acceptedBid.status}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Bid Date
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {formatDate(postDetails.acceptedBid.created_at)}
                </p>
              </div>
              <div className="col-span-2 border-t pt-3 mt-2">
                <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Bidder Details
                </h4>
                {postDetails.acceptedBid?.images &&
                  postDetails.acceptedBid.images.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        Bid Images
                      </p>
                      <div className="flex gap-4 max-w-[76vw] overflow-x-scroll">
                        {postDetails.acceptedBid.images.map(
                          (image: string, index: number) => (
                            <div
                              key={index}
                              className="relative aspect-square h-[300px] w-[300px] flex-shrink-0"
                            >
                              <img
                                src={image}
                                alt={`Bid image ${index + 1}`}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Name
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {postBidUser?.profile?.full_name || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Business
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {postBidUser?.profile?.business_name || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Contact
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {postBidUser?.phone || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Email
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {postBidUser?.profile?.email || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      GST Number
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {postBidUser?.profile?.gst_number || "-"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {postDetails.acceptedBidOrder && (
          <div className="space-y-3 bg-green-50 dark:bg-green-950 p-4 rounded-lg">
            <h3 className="text-sm font-semibold flex items-center gap-2 text-gray-900 dark:text-gray-100">
              Order Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Total Amount
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {formatCurrency(postDetails.acceptedBidOrder.amount)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Platform Fee
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {postDetails.acceptedBidOrder.platform_fee}%
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Order Status
                </p>
                <span
                  className={`inline-block px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(
                    postDetails.acceptedBidOrder.status
                  )}`}
                >
                  {postDetails.acceptedBidOrder.status}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Payment Status
                </p>
                <span
                  className={`inline-block px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(
                    postDetails.acceptedBidOrder.payment_status
                  )}`}
                >
                  {postDetails.acceptedBidOrder.payment_status.replace(
                    "_",
                    " "
                  )}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Details;
