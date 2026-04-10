import type { Message } from "@/components/chat-bubble";
import { Button } from "@/components/ui/button";
import MessageInput from "@/components/ui/message-input";
import MessageList from "@/components/ui/message-list";
import { pb } from "@/lib/pocketbase";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/chat/")({
  component: RouteComponent,
  loader: async ({ context }) => {
    return {
      userName: context.auth.user?.name,
      logout: context.auth.logout,
      userId: context.auth.user?.id,
    };
  },
});

function RouteComponent() {
  const { userName, logout, userId } = Route.useLoaderData();
  const navigate = useNavigate();
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    // fetch initial
    pb.collection("chat")
      .getFullList({ sort: "sentAt", expand: "user" })
      .then((value) => {
        const valueMapped = value.map((val) => {
          return {
            message: val.message,
            name: val.expand?.user.name,
            isSelf: val.expand?.user.user === userId,
            sentAt: val.sentAt,
          };
        });
        setMessages(valueMapped);
      });

    // pb.collection("chat").subscribe("*", async (e) => {
    //   if (e.action === "create") {
    //     const user = await pb.collection("users").getOne(e.record.user);
    //     const record = { ...e.record, expand: { user } };
    //     setMessages((prev) => {
    //       if (!prev) return;
    //       if (prev.some((m) => m.id === record.id)) return prev;
    //       return [...prev, record];
    //     });
    //   }
    // });

    // return () => {
    //   pb.collection("chat").unsubscribe("*");
    // };
  }, [userId]);

  async function handleSubmit() {
    if (!input.trim()) return;
    const data = {
      message: input,
      user: userId,
    };
    await pb.collection("chat").create(data);
  }

  return (
    <div className="max-w-sm h-dvh mx-auto border-2 flex flex-col">
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
        <MessageList messages={messages} />
        <MessageInput
          value={input}
          onChange={setInput}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
