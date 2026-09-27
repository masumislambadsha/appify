import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Msg = {
  id: string;
  role: "user" | "assistant";
  modelId?: string;
  text: string;
  ts: number;
};

export type Chat = {
  id: string;
  title: string;
  category: string;
  modelId: string;
  temperature?: number;
  webSearch?: boolean;
  pinned?: boolean;
  updatedAt: number;
  messages: Msg[];
};

type State = {
  chats: Chat[];
  activeId: string | null;
  compareIds: string[];
  newChat: (category?: string, modelId?: string) => string;
  setActive: (id: string) => void;
  pushMsg: (chatId: string, m: Msg) => void;
  updateMsg: (chatId: string, msgId: string, text: string) => void;
  rename: (chatId: string, title: string) => void;
  togglePin: (chatId: string) => void;
  remove: (chatId: string) => void;
  setModel: (chatId: string, modelId: string) => void;
  toggleCompare: (modelId: string) => void;
  setCompareIds: (ids: string[]) => void;
  setTemperature: (chatId: string, temperature: number) => void;
  setWebSearch: (chatId: string, webSearch: boolean) => void;
};

const uid = () => Math.random().toString(36).slice(2, 9);

const seed: Chat = {
  id: "welcome",
  title: "Welcome — compare 3 models",
  category: "general",
  modelId: "gpt-6-astra",
  pinned: true,
  updatedAt: Date.now(),
  messages: [
    {
      id: "m1",
      role: "user",
      text: "Which model should I use for a research summary?",
      ts: Date.now() - 60000,
    },
    {
      id: "m2",
      role: "assistant",
  modelId: "gpt-6-astra",
      text: "Try Compare mode → pick GPT-6 Astra + Claude Opus 5.5 + DeepSeek V4.1 and ask once. You'll see tone and depth differ. This demo streams locally with no API key.",
      ts: Date.now() - 30000,
    },
  ],
};

export const useChats = create<State>()(
  persist(
    (set, get) => ({
      chats: [seed],
      activeId: "welcome",
      compareIds: ["gpt-6-astra", "opus-5-5"],
      newChat: (category = "general", modelId = "gpt-6-astra") => {
        const id = uid();
        const c: Chat = {
          id,
          title: "New chat",
          category,
          modelId,
          updatedAt: Date.now(),
          messages: [],
        };
        set({ chats: [c, ...get().chats], activeId: id });
        return id;
      },
      setActive: (id) => set({ activeId: id }),
      pushMsg: (chatId, m) =>
        set({
          chats: get().chats.map((c) =>
            c.id === chatId
              ? {
                  ...c,
                  messages: [...c.messages, m],
                  title:
                    c.title === "New chat" && m.role === "user"
                      ? m.text.slice(0, 42) || "New chat"
                      : c.title,
                  updatedAt: Date.now(),
                }
              : c
          ),
        }),
      updateMsg: (chatId, msgId, text) =>
        set({
          chats: get().chats.map((c) =>
            c.id === chatId
              ? {
                  ...c,
                  messages: c.messages.map((m) =>
                    m.id === msgId ? { ...m, text } : m
                  ),
                }
              : c
          ),
        }),
      rename: (chatId, title) =>
        set({
          chats: get().chats.map((c) =>
            c.id === chatId ? { ...c, title } : c
          ),
        }),
      togglePin: (chatId) =>
        set({
          chats: get().chats.map((c) =>
            c.id === chatId ? { ...c, pinned: !c.pinned } : c
          ),
        }),
      remove: (chatId) => {
        const rest = get().chats.filter((c) => c.id !== chatId);
        set({
          chats: rest,
          activeId:
            get().activeId === chatId ? rest[0]?.id ?? null : get().activeId,
        });
      },
      setModel: (chatId, modelId) =>
        set({
          chats: get().chats.map((c) =>
            c.id === chatId ? { ...c, modelId } : c
          ),
        }),
      toggleCompare: (modelId) => {
        const cur = get().compareIds;
        if (cur.includes(modelId)) {
          if (cur.length <= 1) return;
          set({ compareIds: cur.filter((m) => m !== modelId) });
        } else {
          set({ compareIds: [...cur, modelId].slice(0, 3) });
        }
      },
      setCompareIds: (ids) => set({ compareIds: ids.slice(0, 3) }),
      setTemperature: (chatId, temperature) =>
        set({
          chats: get().chats.map((c) =>
            c.id === chatId ? { ...c, temperature } : c
          ),
        }),
      setWebSearch: (chatId, webSearch) =>
        set({
          chats: get().chats.map((c) =>
            c.id === chatId ? { ...c, webSearch } : c
          ),
        }),
    }),
    // skipHydration: the first client render must match the server HTML.
    // Without this, zustand swaps persisted chats in synchronously during
    // hydration and every stored-chat render diverges from the SSR seed.
    // The /app page rehydrates explicitly in its mount effect instead.
    { name: "echogpt-chats-v1", skipHydration: true }
  )
);
