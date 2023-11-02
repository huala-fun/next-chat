import Link from "next/link";

export default function TermsAndPrivacy() {
  return (
    <p className="px-8 text-center text-sm text-muted-foreground">
      单击登录，即表示您同意我们的
      <Link
        href="/terms"
        target="_blank"
        className="underline underline-offset-4 hover:text-primary"
      >
        服务条款
      </Link>{" "}
      和{" "}
      <Link
        target="_blank"
        href="/privacy"
        className="underline underline-offset-4 hover:text-primary"
      >
        隐私政策
      </Link>
    </p>
  );
}
