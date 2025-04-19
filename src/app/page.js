"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "../actions/authActions";

export default function Home() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, loading, isAuthenticated, authChecked } = useSelector(
    (state) => state.auth
  );
  const [localLoading, setLocalLoading] = useState(true);

  const verifyAuth = useCallback(async () => {
    await dispatch(checkAuth());

    setLocalLoading(false);
  }, [dispatch, router, authChecked]);

  useEffect(() => {
    verifyAuth();
  }, []);

  // Show loading state while checking authentication
  if (localLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">
          Welcome, {user?.name || "User"}!
        </h1>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Your Dashboard</h2>
          <p className="text-gray-600">
            This is your protected dashboard. You can only see this if you're
            authenticated.
          </p>
        </div>
      </div>
    </main>
  );
}
