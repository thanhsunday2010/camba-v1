"use client";

import { useState } from "react";

interface AdminMessageProps {
  message: string | null;
}

export function AdminMessage({ message }: AdminMessageProps) {
  if (!message) return null;
  return (
    <div className="bg-primary/10 text-primary px-4 py-2 rounded-lg text-sm">
      {message}
    </div>
  );
}

export function useAdminMessage() {
  const [message, setMessage] = useState<string | null>(null);

  function showMessage(msg: string) {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  }

  return { message, showMessage };
}
