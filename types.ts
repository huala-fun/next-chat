import { Server as Net, Socket } from "net";
import { NextApiResponse } from "next";
import { Server as SocketIO } from "socket.io";
import { Group, Member, User } from "@prisma/client";

export type GroupWithMembersWithUsers = Group & {
  members: (Member & { user: User })[];
};

export type NextApiResponseIo = NextApiResponse & {
  socket: Socket & {
    server: Net & {
      io: SocketIO;
    };
  };
};
