import { useToast } from "@/components/ui/use-toast";
// 修改代码，导出 Toast 对象
import type { Toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

export const useTopRightTotast = () => {
  const { toast } = useToast();
  return ({ className, ...Options }: { className?: string } & Toast) => {
    return toast({
      className: cn(
        "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4",
        className
      ),
      ...Options,
    });
  };
};
