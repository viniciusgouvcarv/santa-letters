import { Request } from 'express';

export const extractIpFromRequest = (req: Request) => req?.ip || req?.socket?.remoteAddress;
