import type { Message } from "@/components/chat-bubble";
import { Button } from "@/components/ui/button";
import MessageInput from "@/components/ui/message-input";
import MessageList from "@/components/ui/message-list";
import { Spinner } from "@/components/ui/spinner";
import { pb } from "@/lib/pocketbase";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/chat/")({
  component: RouteComponent,
  loader: async ({ context }) => {
    return {
      userName: context.auth.user?.name,
      userId: context.auth.user?.id,
      logout: context.auth.logout,
    };
  },
});

async function fetchMessages(
  setMessages: (messages: Message[]) => void,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  userId: string | undefined,
) {
  const value = await pb
    .collection("chat")
    .getFullList({ sort: "sentAt", expand: "user" });

  const valueMapped: Message[] = value.map((val) => ({
    message: val.message,
    name: val.expand?.user.name ?? "Unknown",
    isSelf: val.expand?.user.id === userId,
    sentAt: val.sentAt,
  }));

  setLoading(false);
  setMessages(valueMapped);
}

async function subscribe(
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  userId: string | undefined,
) {
  await pb.collection("chat").subscribe("*", async (e) => {
    if (e.action === "create") {
      const user = await pb.collection("users").getOne(e.record.user);
      const record: Message = {
        message: e.record.message,
        name: user.name ?? "Unknown",
        isSelf: user.id === userId,
        sentAt: e.record.sentAt,
      };
      setMessages((prev) => {
        if (
          prev.some((m) => m.sentAt === record.sentAt && m.name === record.name)
        )
          return prev;
        return [...prev, record];
      });
    }
  });
}

function RouteComponent() {
  const { userName, userId, logout } = Route.useLoaderData();
  const navigate = useNavigate();
  const [input, setInput] = useState<string>("");
  const [isLoading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    fetchMessages(setMessages, setLoading, userId);
    subscribe(setMessages, userId);
    return () => {
      pb.collection("chat").unsubscribe("*");
    };
  }, [userId]);

  async function handleSubmit() {
    if (!input.trim()) return;
    const data = {
      message: input,
      user: userId,
    };

    await pb.collection("chat").create(data);
    setInput("");
  }

  return (
    <div className="max-w-md h-dvh mx-auto border-2 flex flex-col">
      <div className="border-b-2 p-2 flex items-center justify-between">
        <p>Hello, {userName}!</p>
        <Button
          onClick={() => {
            logout();
            navigate({ to: "/auth/login" });
          }}
        >
          Log Out
        </Button>
      </div>
      <div className="p-2 flex-1 flex flex-col justify-between overflow-hidden">
        {isLoading ? (
          <Spinner className="self-center my-auto" />
        ) : (
          <MessageList messages={messages} />
        )}
        <MessageInput
          value={input}
          onChange={setInput}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
