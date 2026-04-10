import { cn } from "@/lib/utils";

export interface Message {
  message: string;
  name: string;
  isSelf: boolean;
  sentAt: string;
}

function formatMessageDate(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const messageDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );

  if (messageDay.getTime() === today.getTime()) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } else if (messageDay.getTime() === yesterday.getTime()) {
    return "Yesterday";
  } else if (today.getTime() - messageDay.getTime() < 7 * 24 * 60 * 60 * 1000) {
    return date.toLocaleDateString([], { weekday: "long" });
  } else {
    return date.toLocaleDateString([], {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
}

export default function ChatBubble({ message }: { message: Message }) {
  const formattedDate = formatMessageDate(message.sentAt);

  return (
    <div
      className={cn(
        "flex w-full",
        message.isSelf ? "justify-end" : "justify-start",
      )}
    >
      <div
        className={cn(
          "max-w-[90%] flex flex-col",
          message.isSelf ? "items-end" : "items-start",
        )}
      >
        <p className="text-sm text-muted-foreground px-1">{message.name}</p>
        <div
          className={cn(
            message.isSelf ? "flex-row-reverse" : "flex-row",
            "flex items-end gap-2 max-w-full",
          )}
        >
          <p
            className={cn(
              "border-2 rounded-lg p-2",
              "wrap-break-word whitespace-pre-wrap",
              "overflow-hidden",
              "max-w-full",
              message.isSelf
                ? "bg-primary text-primary-foreground"
                : "bg-muted",
            )}
          >
            {message.message}
          </p>
          <p className="text-xs text-muted-foreground whitespace-nowrap mb-2">
            {formattedDate}
          </p>
        </div>
      </div>
    </div>
  );
}
