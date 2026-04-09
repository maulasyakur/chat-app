import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export default function MessageInput({
  value,
  onChange,
  onSubmit,
}: MessageInputProps) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-2">
      <Input
        value={value}
        onChange={(e) => onChange(e.currentTarget.value)}
        placeholder="Enter your message here."
      />
      <Button type="submit">
        <Send />
      </Button>
    </form>
  );
}
