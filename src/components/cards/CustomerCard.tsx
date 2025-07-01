"use client";

import { ErrorResponse } from "@/screens/dashboard/schema";
import { useDashboardService } from "@/services";
import { GET_CUSTOMER } from "@/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { toast } from "react-toastify";

type TCustomerCard = {
  customerId: string;
  customerName: string;
  loanAmount: number;
  paidAmount: number;
  date: string;
  totalDays: number;
  customerNumber?: string;
};

const CustomerCard = ({
  customerId,
  customerName,
  customerNumber,
  loanAmount,
  paidAmount,
  date,
  totalDays,
}: TCustomerCard) => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const { useDeleteCustomer } = useDashboardService();
  const { mutate: deleteCustomerMutate } = useDeleteCustomer({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_CUSTOMER] });
      toast.success("Customer deleted successfully");
    },
    onError: (err: unknown) => {
      const error = err as ErrorResponse;
      toast.error(
        error?.response?.data?.message || "Failed to delete customer"
      );
    },
  });

  const toggleMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
    }
    setOpen((prev) => !prev);
  };

  const handleDelete = () => {
    deleteCustomerMutate({ id: customerId });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const popupEl = document.getElementById("popup-menu");
      if (
        open &&
        !popupEl?.contains(event.target as Node) &&
        !buttonRef.current?.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <>
      <div className="flex flex-row justify-between bg-white px-4 py-2 cursor-pointer transition">
        <div>
          <p className="font-bold text-sm">{customerName}</p>
          <div className="text-[10px]">LOAN: ₹{loanAmount || 0}</div>
          <div className="text-[10px]">PAID: ₹{paidAmount || 0}</div>
        </div>
        <div className="flex flex-row items-center">
          <div className="text-center">
            <p className="text-[10px]">{date}</p>
            <p
              className={`text-[10px] ${totalDays > 100 ? "text-red-500" : ""}`}
            >
              {totalDays || 0} days
            </p>
          </div>
          <div className="flex flex-row items-center text-left">
            <button
              ref={buttonRef}
              onClick={toggleMenu}
              className="px-4 flex items-center justify-center w-4 rounded-full hover:bg-gray-200 cursor-pointer"
            >
              <span className="text-2xl font-bold">⋮</span>
            </button>
          </div>
        </div>
      </div>

      {open &&
        ReactDOM.createPortal(
          <div
            id="popup-menu"
            className="absolute z-[99999] w-40 bg-white shadow-xl rounded-md p-1"
            style={{ top: position.top, left: position.left - 140 }}
          >
            <button
              className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 cursor-pointer"
              onClick={(e) => {
                e?.stopPropagation();
                setOpen(false);
              }}
            >
              <a
                href={`sms:+91${customerNumber}?body=Hello%20${customerName},Please%20make%20your%20payment%20now!!`}
              >
                Notify
              </a>
            </button>
            <button
              className="block text-red-500 w-full px-4 py-2 text-left text-sm hover:bg-gray-100 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setShowConfirmModal(true);
                setOpen(false);
              }}
            >
              Delete
            </button>
          </div>,
          document.body
        )}

      {showConfirmModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center">
          {/* Overlay to block background interaction */}
          <div
            className="absolute inset-0 bg-transparent bg-opacity-30"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Modal Content */}
          <div className="relative z-10 bg-white rounded p-4 w-[90%] max-w-sm shadow-lg cursor-default">
            <h2 className="text-md font-semibold mb-2">Confirm Deletion</h2>
            <p className="text-sm text-gray-700 mb-4">
              Are you sure you want to delete this customer and all their
              records? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowConfirmModal(false)
                }}
                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-sm cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleDelete();
                  setShowConfirmModal(false);
                }}
                className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 text-sm cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CustomerCard;
