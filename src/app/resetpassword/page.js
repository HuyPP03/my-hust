"use client";

// pages/resetpassword.js
import { useState } from "react";
import { useRouter } from "next/router";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const router = useRouter();
  const { token } = router.query;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/auth/callback/resetpassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, password, confirmPassword }),
    });

    const data = await response.json();
    setMessage(data.message);
  };

  return (
    <div>
      <h1>Đặt Lại Mật Khẩu</h1>
      <form onSubmit={handleSubmit}>
        <label>Mật Khẩu Mới:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label>Xác Nhận Mật Khẩu:</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button type="submit">Đặt Lại Mật Khẩu</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default ResetPassword;
