import { Request, Response, NextFunction } from 'express';
import { ZodTypeAny } from 'zod';

export const validate =
  ({
    query,
    body,
    params,
  }: {
    query?: ZodTypeAny;
    body?: ZodTypeAny;
    params?: ZodTypeAny;
  }) =>
  <ReqParams, ResBody, ReqBody, ReqQuery>(
    req: Request<ReqParams, ResBody, ReqBody, ReqQuery>,
    res: Response,
    next: NextFunction
  ) => {
    const paramsResult = params?.safeParse(req.params);
    const queryResult = query?.safeParse(req.query);
    const bodyResult = body?.safeParse(req.body);

    let error = false;
    [paramsResult, queryResult, bodyResult].forEach((x) => {
      if (x) {
        if (!x.success) {
          res.status(400).json(x.error);
          error = true;
          return;
        }
      }
    });

    if (error) return;
    next();
  };

export default validate;
