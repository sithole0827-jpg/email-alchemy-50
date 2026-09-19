/**
 * Local application state for the MVP.
 *
 * Real user-submitted data (problem reports, quote requests, reviews, the
 * signed-in demo account) lives here and is kept in the browser only. It is
 * deliberately separate from the demo sample data in `sa-data.ts`, so the
 * dashboards can always tell the two apart.
 *
 * Swapping this for a real database later means replacing the read/write
 * helpers below; pages only use the hooks.
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import type { CategoryId, Provider } from "./sa-data";
import { DEMO_PROVIDERS } from "./sa-data";

export type ProblemReport = {
  id: string;
  description: string;
  province: string;
  city: string;
  suburb: string;
  category: CategoryId;
  createdAt: string;
  status: "open" | "solved";
};

export type QuoteRequest = {
  id: string;
  providerId: string;
  providerName: string;
  customerName: string;
  phone: string;
  description: string;
  preferredDate: string;
  budget: string;
  createdAt: string;
  status: "pending" | "accepted" | "completed";
};

export type Review = {
  id: string;
  providerId: string;
  author: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export type AccountRole = "customer" | "provider" | "entrepreneur";

export type Account = {
  name: string;
  email: string;
  phone?: string;
  role: AccountRole;
};

/** Demo credential record. Stored in this browser only — never a real auth system. */
export type StoredUser = Account & {
  password: string;
  createdAt: string;
};

type StoreState = {
  reports: ProblemReport[];
  quotes: QuoteRequest[];
  reviews: Review[];
  providers: Provider[];
  users: StoredUser[];
  account: Account | null;
};

const EMPTY: StoreState = {
  reports: [],
  quotes: [],
  reviews: [],
  providers: [],
  users: [],
  account: null,
};

const KEY = "mzansi-p2b-v1";

type StoreContextValue = StoreState & {
  hydrated: boolean;
  allProviders: Provider[];
  addReport: (r: Omit<ProblemReport, "id" | "createdAt" | "status">) => ProblemReport;
  markReportSolved: (id: string) => void;
  addQuote: (q: Omit<QuoteRequest, "id" | "createdAt" | "status">) => QuoteRequest;
  setQuoteStatus: (id: string, status: QuoteRequest["status"]) => void;
  addReview: (r: Omit<Review, "id" | "createdAt">) => void;
  addProvider: (p: Omit<Provider, "id" | "rating" | "reviewCount" | "completedJobs" | "verified">) => Provider;
  signIn: (a: Account) => void;
  signOut: () => void;
  register: (input: {
    name: string;
    email: string;
    phone?: string;
    password: string;
    role: AccountRole;
  }) => { ok: true; account: Account } | { ok: false; error: string };
  login: (input: {
    email: string;
    password: string;
    role: AccountRole;
  }) => { ok: true; account: Account } | { ok: false; error: string };
};

const StoreContext = createContext<StoreContextValue | null>(null);

function id(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoreState>(EMPTY);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) setState({ ...EMPTY, ...(JSON.parse(raw) as Partial<StoreState>) });
    } catch {
      /* ignore corrupt storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* storage full or unavailable */
    }
  }, [state, hydrated]);

  const addReport: StoreContextValue["addReport"] = useCallback((r) => {
    const report: ProblemReport = {
      ...r,
      id: id("rep"),
      createdAt: new Date().toISOString(),
      status: "open",
    };
    setState((s) => ({ ...s, reports: [report, ...s.reports] }));
    return report;
  }, []);

  const markReportSolved = useCallback((reportId: string) => {
    setState((s) => ({
      ...s,
      reports: s.reports.map((r) => (r.id === reportId ? { ...r, status: "solved" } : r)),
    }));
  }, []);

  const addQuote: StoreContextValue["addQuote"] = useCallback((q) => {
    const quote: QuoteRequest = {
      ...q,
      id: id("qte"),
      createdAt: new Date().toISOString(),
      status: "pending",
    };
    setState((s) => ({ ...s, quotes: [quote, ...s.quotes] }));
    return quote;
  }, []);

  const setQuoteStatus = useCallback((quoteId: string, status: QuoteRequest["status"]) => {
    setState((s) => ({
      ...s,
      quotes: s.quotes.map((q) => (q.id === quoteId ? { ...q, status } : q)),
    }));
  }, []);

  const addReview: StoreContextValue["addReview"] = useCallback((r) => {
    const review: Review = { ...r, id: id("rev"), createdAt: new Date().toISOString() };
    setState((s) => ({ ...s, reviews: [review, ...s.reviews] }));
  }, []);

  const addProvider: StoreContextValue["addProvider"] = useCallback((p) => {
    const provider: Provider = {
      ...p,
      id: id("prv"),
      rating: 0,
      reviewCount: 0,
      completedJobs: 0,
      verified: false,
    };
    setState((s) => ({ ...s, providers: [provider, ...s.providers] }));
    return provider;
  }, []);

  const signIn = useCallback((account: Account) => setState((s) => ({ ...s, account })), []);
  const signOut = useCallback(() => setState((s) => ({ ...s, account: null })), []);

  const register: StoreContextValue["register"] = useCallback((input) => {
    const email = input.email.trim().toLowerCase();
    let result: ReturnType<StoreContextValue["register"]> = {
      ok: false,
      error: "Could not create the account.",
    };

    setState((s) => {
      const taken = s.users.some((u) => u.email === email && u.role === input.role);
      if (taken) {
        result = {
          ok: false,
          error: "An account with this email already exists for this role. Try signing in.",
        };
        return s;
      }
      const user: StoredUser = {
        name: input.name.trim(),
        email,
        phone: input.phone?.trim() || undefined,
        role: input.role,
        password: input.password,
        createdAt: new Date().toISOString(),
      };
      const account: Account = {
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      };
      result = { ok: true, account };
      return { ...s, users: [user, ...s.users], account };
    });

    return result;
  }, []);

  const login: StoreContextValue["login"] = useCallback((input) => {
    const email = input.email.trim().toLowerCase();
    let result: ReturnType<StoreContextValue["login"]> = {
      ok: false,
      error: "Could not sign in.",
    };

    setState((s) => {
      const user = s.users.find((u) => u.email === email && u.role === input.role);
      if (!user || user.password !== input.password) {
        result = {
          ok: false,
          error: "We couldn't find a matching account. Check the email, password and account type.",
        };
        return s;
      }
      const account: Account = {
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      };
      result = { ok: true, account };
      return { ...s, account };
    });

    return result;
  }, []);

  const value = useMemo<StoreContextValue>(
    () => ({
      ...state,
      hydrated,
      allProviders: [...state.providers, ...DEMO_PROVIDERS],
      addReport,
      markReportSolved,
      addQuote,
      setQuoteStatus,
      addReview,
      addProvider,
      signIn,
      signOut,
    }),
    [
      state,
      hydrated,
      addReport,
      markReportSolved,
      addQuote,
      setQuoteStatus,
      addReview,
      addProvider,
      signIn,
      signOut,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}

/** Average rating for a provider, combining demo history with new reviews. */
export function providerRating(provider: Provider, reviews: Review[]) {
  const mine = reviews.filter((r) => r.providerId === provider.id);
  if (mine.length === 0) return { rating: provider.rating, count: provider.reviewCount };
  const total = provider.rating * provider.reviewCount + mine.reduce((a, r) => a + r.rating, 0);
  const count = provider.reviewCount + mine.length;
  return { rating: Math.round((total / count) * 10) / 10, count };
}
