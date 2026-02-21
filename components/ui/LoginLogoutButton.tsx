"use client";
import React, { useEffect, useState } from "react";
import { Button } from "./button";
import { useRouter } from "next/navigation";
import { createClient } from "../../src/utils/supabase/client";
import { logout } from "@/app/lib/auth-actions";

const LoginButton = () => {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (user) {
    return (
      <Button onClick={handleLogout}>
        Log out
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      onClick={() => router.push("/login")}
    >
      Login
    </Button>
  );
};

export default LoginButton;