import { Response } from 'express';

export const containRequiredFields = (
  fields: { [key: string]: any },
  res: Response
): boolean => {
  const missingFields = [];

  for (const [key, value] of Object.entries(fields)) {
    if (!value) missingFields.push(key);
  }

  if (missingFields.length) {
    res.status(400).json({
      message: `Missing required field(s): ${missingFields.join(', ')}`,
    });
    return false;
  } else return true;
};
