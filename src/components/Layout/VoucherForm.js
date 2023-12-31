"use client";

import { useEffect, useState } from "react";
import DatePage from "@/libs/date";

export default function VoucherForm({ onSubmit, voucher }) {
  const [voucherCode, setVoucherCode] = useState(voucher?.voucherCode || "");
  const [name, setName] = useState(voucher?.name || "");
  const [fromTime, setFromTime] = useState(voucher?.fromTime || "");
  const [toTime, setToTime] = useState(voucher?.toTime || "");
  const [percent, setPercent] = useState(voucher?.percent || 0);
  const [amountMoney, setAmountMoney] = useState(voucher?.amountMoney || 0);
  const [quantity, setQuantity] = useState(voucher?.quantity || 0);
  const [showConfirm, setShowConfirm] = useState(false);
  if (showConfirm) {
    return (
      <div className="fixed bg-slate-200/60 inset-0 flex items-center h-full justify-center">
        <div className="bg-white p-4 rounded-lg">
          <div>Are you sure you want to create or update?</div>
          <div className="flex gap-2 mt-1">
            <button type="button" onClick={() => setShowConfirm(false)}>
              Cancel
            </button>
            <button
              type="button"
              className="primary"
              onClick={(e) => {
                onSubmit(e, {
                  voucherCode,
                  name,
                  fromTime,
                  toTime,
                  percent,
                  amountMoney,
                  quantity,
                });
              }}
            >
              Yes,&nbsp;save!
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <section>
      <form
        className="max-w-2xl mx-auto"
        onSubmit={(e) => {
          onSubmit(e, {
            voucherCode,
            name,
            fromTime,
            toTime,
            percent,
            amountMoney,
            quantity,
          });
        }}
      >
        <div className="md:grid items-start gap-4">
          <div className="grow">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label>Mã voucher</label>
                <input
                  type="text"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                ></input>
              </div>
              <div>
                <label>Tên voucher</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                ></input>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label>Nhập fromTime</label>
                <input
                  type="date"
                  onChange={(e) => setFromTime(e.target.value)}
                ></input>
              </div>
              <div>
                <label>From time</label>
                <input
                  type="text"
                  value={DatePage(fromTime)}
                  disabled={true}
                ></input>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label>Nhập toTime</label>
                <input
                  type="date"
                  onChange={(e) => setToTime(e.target.value)}
                ></input>
              </div>
              <div>
                <label>To time</label>
                <input
                  type="text"
                  value={DatePage(toTime)}
                  disabled={true}
                ></input>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label>Percent</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={percent}
                  onChange={(e) => setPercent(e.target.value)}
                ></input>
              </div>
              <div>
                <label>Discount</label>
                <input
                  type="number"
                  min="0"
                  value={amountMoney}
                  onChange={(e) => setAmountMoney(e.target.value)}
                ></input>
              </div>
              <div>
                <label>Quantity</label>
                <input
                  type="number"
                  min="0"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                ></input>
              </div>
            </div>
            <button type="submit">Save</button>
          </div>
        </div>
      </form>
    </section>
  );
}
