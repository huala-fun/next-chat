import { Server as Net } from "http";
import { NextApiRequest } from "next";
import { Server as IO } from "socket.io";

import { NextApiResponseIo } from "@/types";

export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = (req: NextApiRequest, res: NextApiResponseIo) => {
  if (!res.socket.server.io) {
    const path = "/api/socket/io";
    const http: Net = res.socket.server as any;
    const io = new IO(http, {
      path: path,
      // @ts-ignore
      addTrailingSlash: false,
    });
    res.socket.server.io = io;
  }

  res.end();
};

export default ioHandler;
