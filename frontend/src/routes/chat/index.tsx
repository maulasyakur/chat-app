import type { Message } from "@/components/chat-bubble";
import { Button } from "@/components/ui/button";
import MessageInput from "@/components/ui/message-input";
import MessageList from "@/components/ui/message-list";
import { pb } from "@/lib/pocketbase";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/chat/")({
  component: RouteComponent,
  loader: async ({ context }) => {
    context.queryClient.ensureQueryData(chatQueryOptions);
    return { userName: context.auth.user?.name, logout: context.auth.logout };
  },
});

const chatQueryOptions = queryOptions({
  queryKey: ["chat-messages"],
  queryFn: async () => {
    const resultList = await pb
      .collection("chat")
      .getFullList({ expand: "user" });
    return resultList;
  },
});

const user = "Maula";
const otherMessages: Message[] = [
  {
    isSelf: false,
    message: "fasdfasf",
    senderName: "Dita",
    sentAt: new Date(),
  },
  {
    isSelf: false,
    message: "fasdfasf",
    senderName: "Dita",
    sentAt: new Date(),
  },
  {
    isSelf: false,
    message: "fasdfasf",
    senderName: "Dita",
    sentAt: new Date(),
  },
  {
    isSelf: false,
    message: "fasdfasf",
    senderName: "Dita",
    sentAt: new Date(),
  },
  {
    isSelf: false,
    message: "fasdfasf",
    senderName: "Dita",
    sentAt: new Date(),
  },
  {
    isSelf: false,
    message: "fasdfasf",
    senderName: "Dita",
    sentAt: new Date(),
  },
  {
    isSelf: false,
    message: "fasdfasf",
    senderName: "Dita",
    sentAt: new Date(),
  },
];

function RouteComponent() {
  const { userName, logout } = Route.useLoaderData();
  const navigate = useNavigate();
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>(otherMessages);
  const { data: chatMessages } = useSuspenseQuery(chatQueryOptions);

  function handleSubmit() {
    if (!input.trim()) return;
    const message: Message = {
      message: input,
      isSelf: true,
      senderName: user,
      sentAt: new Date(),
    };
    setMessages((prev) => [...prev, message]);
    setInput("");
  }

  console.log(chatMessages);
  console.log(chatMessages[0].expand);

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
