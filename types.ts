import { Server as Net, Socket } from "net";
import { NextApiResponse } from "next";
import { Server as SocketIO } from "socket.io";
import { Group, Member, Profile } from "@prisma/client";

export type GroupWithMembersWithProfiles = Group & {
  members: (Member & { profile: Profile })[];
};

export type NextApiResponseIo = NextApiResponse & {
  socket: Socket & {
    server: Net & {
      io: SocketIO;
    };
  };
};
