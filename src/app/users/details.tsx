"use client";

import { Spinner } from "@/components/ui/spinner";
import { formatDate, getAPI } from "@/lib/helper";
import { useEffect, useState } from "react";

interface DetailsProps {
  item: any;
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "active":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "inactive":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  }
};

const Details = ({ item }: DetailsProps) => {
  const [address, setAddress] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [coinSummary, setCoinSummary] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (item?._id) {
        setLoading(true);
        try {
          if (item?.role?.name === "seller") {
            const addressResponse = await getAPI(
              `user/${item._id}/address`,
              null
            );
            if (addressResponse.status === 200) {
              setAddress(
                addressResponse.data.data?.filter(
                  (address: any) => address.is_primary
                )[0]
              );
            }
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [item]);

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
            {item?.profile?.full_name || "User Details"}
          </h2>
          {item?.role?.name === "seller" && (
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                item?.profile?.is_approved ? "active" : "pending"
              )}`}
            >
              {item?.profile?.is_approved ? "Active" : "Pending"}
            </span>
          )}
        </div>
      </div>

      <div className="px-6 pb-6">
        <div className="space-y-6 bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
          <div className="space-y-6">
            <div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Full Name
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {item?.profile?.full_name || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Business Name
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {item?.profile?.business_name || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Phone Number
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {item?.phone || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Email
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {item?.profile?.email || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Role
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {item?.role?.name || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Referral Code
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {item?.profile?.referral_code || "-"}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Created At
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {item?.created_at ? formatDate(item?.created_at) : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Last Updated
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {item?.updated_at ? formatDate(item?.updated_at) : "-"}
                  </p>
                </div>
              </div>
            </div>

            {(item?.profile?.gst_number ||
              item?.profile?.legal_document_url ||
              address) && (
              <div>
                <h3 className="text-sm font-semibold flex items-center gap-2 text-gray-900 dark:text-gray-100 mb-3">
                  Business Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {item?.profile?.gst_number && (
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        GST Number
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {item?.profile?.gst_number}
                      </p>
                    </div>
                  )}
                  {item?.profile?.legal_document_url && (
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Legal Document
                      </p>
                      <a
                        href={item?.profile?.legal_document_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        View Document
                      </a>
                    </div>
                  )}
                  {address && (
                    <div className="col-span-2">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Business Address
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {address.address_line2 && `${address.address_line2}`}
                        {address.city && `, ${address.city}`}
                        {address.state && `, ${address.state}`}
                        {address.country && `, ${address.country}`}
                        {address.zip_code && ` - ${address.zip_code}`}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {item?.fcmToken && (
              <div>
                <h3 className="text-sm font-semibold flex items-center gap-2 text-gray-900 dark:text-gray-100 mb-3">
                  Device Information
                </h3>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    FCM Token
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 break-all">
                    {item?.fcmToken}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;
