"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getAPI, postAPI } from "@/lib/helper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CustomTable from "@/components/custom-components/CustomTable";
import { toast } from "@/components/ui/use-toast";
import { serverPostAPI } from "../_server_utils/helper";

interface UserCoinsProps {
  selectedUser: any;
  onClose: () => void;
}

export function UserCoins({ selectedUser, onClose }: UserCoinsProps) {
  return (
    <Dialog open={!!selectedUser} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Coins</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="approval">Approval Request</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          <TabsContent value="summary">
            <div className="space-y-4">
              <div className="space-y-2">
                <CoinSummary userId={selectedUser?._id} />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="approval">
            <div className="space-y-4">
              <ApprovalRequest userId={selectedUser?._id} />
            </div>
          </TabsContent>
          <TabsContent value="history">
            <div className="space-y-4">
              <CoinHistory userId={selectedUser?._id} />
            </div>
          </TabsContent>
        </Tabs>
        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => {
              onClose();
            }}
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface CoinSummaryProps {
  coinSummary: any;
}

export function CoinSummary({ userId }: { userId: string }) {
  const [coinSummary, setCoinSummary] = useState<any>({});
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const coinResponse = await getAPI(`user/${userId}/coin/summary`, null);
      if (coinResponse.status === 200) {
        setCoinSummary(coinResponse.data.data);
      }
    };
    fetchData()
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);
  return (
    <div>
      <h3 className="text-sm font-semibold flex items-center gap-2 text-gray-900 dark:text-gray-100 mb-3">
        Coin Summary
      </h3>
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Pending</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {coinSummary.pending || 0}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Redeem Approval Pending
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {coinSummary.redeem_approval_pending || 0}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Redeem Approved
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {coinSummary.redeem_approved || 0}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Paid</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {coinSummary.paid || 0}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function ApprovalRequest({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(false);
  const [coinHistory, setCoinHistory] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedStatus, setSelectedStatus] =
    useState<string>("redeem_approved");
  const [updating, setUpdating] = useState(false);

  const handleChangeStatus = () => {
    setShowStatusModal(true);
  };

  const handleUpdateStatus = async () => {
    try {
      setUpdating(true);
      const updateResponse = await postAPI(`user/${userId}/coin/status`, {
        status: selectedStatus,
        ids: selectedItems.map((val: any) => val._id),
      });
      if (updateResponse.status === 200) {
        setShowStatusModal(false);
        setSelectedItems([]);
        toast({
          title: "Success",
          description: "Status updated successfully",
        });
      } else {
        toast({
          title: "Error",
          description: updateResponse?.data?.message || "Error updating status",
          variant: "destructive",
        });
      }
      // After successful update, refresh the data
      const response = await getAPI(
        `user/${userId}/coin/history?status=redeem_approval_pending`,
        null
      );
      if (response.status === 200) {
        setCoinHistory(response.data.data);
        setSelectedItems([]);
        setShowStatusModal(false);
      }
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    const fetchCoinHistory = async () => {
      try {
        setLoading(true);
        const response = await getAPI(
          `user/${userId}/coin/history?status=redeem_approval_pending`,
          null
        );
        if (response.status === 200) {
          setCoinHistory(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching coin history:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchCoinHistory();
    }
  }, [userId]);

  const columns = [
    {
      label: "Order ID",
      key: "order_id",
      render: (item: any) => (
        <p className="flex justify-center">{item.order_id}</p>
      ),
    },
    {
      label: "Source",
      key: "source",
      render: (item: any) => (
        <p className="flex justify-center">{item.source}</p>
      ),
    },
    {
      label: "Amount",
      key: "amount",
      render: (item: any) => (
        <p className="flex justify-center">{item.amount}</p>
      ),
    },
    {
      label: "Coin Multiplier",
      key: "coin_multiplier",
      render: (item: any) => (
        <p className="flex justify-center">{item.coin_multiplier}</p>
      ),
    },
    {
      label: "Status",
      key: "status",
      render: (item: any) => (
        <p className="flex justify-center">{item.status}</p>
      ),
      filter: true,
    },
    {
      label: "Created At",
      key: "created_at",
      render: (item: any) => (
        <p className="flex justify-center">
          {new Date(item.created_at).toLocaleString()}
        </p>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold flex items-center gap-2 text-gray-900 dark:text-gray-100">
          Approval Requests
        </h3>
        <Button
          variant="default"
          size="sm"
          disabled={selectedItems.length === 0}
          onClick={handleChangeStatus}
        >
          Change Status ({selectedItems.length})
        </Button>
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
        </div>
      ) : coinHistory.length === 0 ? (
        <div className="text-sm text-gray-500 text-center py-8">
          No approval requests found
        </div>
      ) : (
        <CustomTable
          columns={columns}
          data={coinHistory}
          disableSearch={true}
          selectable={true}
          onSelectionChange={setSelectedItems}
        />
      )}

      <Dialog open={showStatusModal} onOpenChange={setShowStatusModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Change Status</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <select
                id="status"
                className="col-span-3 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="redeem_approved">Redeem Approved</option>
                <option value="paid">Paid</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setShowStatusModal(false)}
              disabled={updating}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateStatus} disabled={updating}>
              {updating ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Updating...
                </div>
              ) : (
                "Update"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CoinHistory({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(false);
  const [coinHistory, setCoinHistory] = useState<any[]>([]);

  useEffect(() => {
    const fetchCoinHistory = async () => {
      try {
        setLoading(true);
        const response = await getAPI(`user/${userId}/coin/history`, null);
        if (response.status === 200) {
          setCoinHistory(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching coin history:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchCoinHistory();
    }
  }, [userId]);

  const columns = [
    {
      label: "Order ID",
      key: "order_id",
      render: (item: any) => (
        <p className="flex justify-center">{item.order_id}</p>
      ),
    },
    {
      label: "Source",
      key: "source",
      render: (item: any) => (
        <p className="flex justify-center">{item.source}</p>
      ),
    },
    {
      label: "Amount",
      key: "amount",
      render: (item: any) => (
        <p className="flex justify-center">{item.amount}</p>
      ),
    },
    {
      label: "Coin Multiplier",
      key: "coin_multiplier",
      render: (item: any) => (
        <p className="flex justify-center">{item.coin_multiplier}</p>
      ),
    },
    {
      label: "Status",
      key: "status",
      render: (item: any) => (
        <p className="flex justify-center">{item.status}</p>
      ),
      filter: true,
    },
    {
      label: "Created At",
      key: "created_at",
      render: (item: any) => (
        <p className="flex justify-center">
          {new Date(item.created_at).toLocaleString()}
        </p>
      ),
    },
  ];

  return (
    <div>
      <h3 className="text-sm font-semibold flex items-center gap-2 text-gray-900 dark:text-gray-100 mb-3">
        Coin History
      </h3>
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
        </div>
      ) : coinHistory.length === 0 ? (
        <div className="text-sm text-gray-500 text-center py-8">
          No coin history found
        </div>
      ) : (
        <CustomTable
          columns={columns}
          data={coinHistory}
          disableSearch={true}
        />
      )}
    </div>
  );
}
