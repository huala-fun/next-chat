"use client";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal-store";
export default function Home() {
  const { onOpen } = useModal();
  return (
    <div className="h-full flex items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle></CardTitle>
          <CardDescription>闲聊聚集地</CardDescription>
        </CardHeader>
        <CardContent>
          是不是很无聊？快来创建个 <Button variant={"link"} onClick={() => onOpen("createGroup")}> 群组 </Button>和好友聊天吧
        </CardContent>
      </Card>
    </div>
  )
}