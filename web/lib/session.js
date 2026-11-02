"use client";

import { useEffect, useSyncExternalStore } from "react";
import { data } from "@/lib/data";

// Shared session state for the logged-in pages: the user and today's quota.
// Loaded once and shared by the top bar and the pages, so /api/auth/me is not
// called twice. A 401 sends the user to /login?next=<current path>.

let state = { status: "idle", user: null, quota: null };
const listeners = new Set();

function setState(patch) {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
}

function redirectToLogin() {
  const next = window.location.pathname + window.location.search;
  window.location.replace(`/login?next=${encodeURIComponent(next)}`);
}

export async function loadSession() {
  // After an error the page offers a retry (a reload), so other components do not call again.
  if (state.status !== "idle") return;
  setState({ status: "loading" });
  try {
    const { user } = await data.me();
    setState({ status: "ready", user });
    refreshQuota();
  } catch (error) {
    if (error?.status === 401) {
      setState({ status: "anonymous" });
      redirectToLogin();
    } else {
      setState({ status: "error", error });
    }
  }
}

/** Re-read the quota, e.g. after an action that counts toward it. */
export async function refreshQuota() {
  try {
    setState({ quota: await data.quota() });
  } catch {
    // The quota indicator is P1 (FR-25): if it fails, the bar just hides it.
  }
}

export async function logout() {
  try {
    await data.logout();
  } finally {
    setState({ status: "idle", user: null, quota: null });
    window.location.replace("/login"); // full reload clears every cached page state
  }
}

const subscribe = (l) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const SERVER_STATE = { status: "idle", user: null, quota: null };

/** { status: idle | loading | ready | anonymous | error, user, quota } */
export function useSession({ load = true } = {}) {
  const snapshot = useSyncExternalStore(subscribe, () => state, () => SERVER_STATE);
  useEffect(() => {
    if (load) loadSession();
  }, [load]);
  return snapshot;
}
