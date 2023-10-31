import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { currentUser } from "@/lib/current-user";
import { db } from "@/lib/db";

interface IdPageProps {
  params: {
    gId: string;
  }
};

const IdPage = async ({
  params
}: IdPageProps) => {
  const user = await currentUser();
  if (!user) {
    return redirectToSignIn();
  }

  const server = await db.group.findUnique({
    where: {
      id: params.gId,
      members: {
        some: {
          userId: user.id,
        }
      }
    },
    include: {
      channels: {
        where: {
          name: "general"
        },
        orderBy: {
          createdAt: "asc"
        }
      }
    }
  })

  const initialChannel = server?.channels[0];

  if (initialChannel?.name !== "general") {
    return null;
  }

  return redirect(`/group/${params.gId}/channel/${initialChannel?.id}`)
}
 
export default IdPage;