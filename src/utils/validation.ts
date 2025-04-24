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

export const isEmptyString = (
  strings: { [key: string]: string },
  res: Response
): boolean => {
  const emptyField = [];

  for (const [key, value] of Object.entries(strings)) {
    if (!value.trim()) emptyField.push(key);
  }

  if (emptyField.length) {
    res.status(400).json({
      message: `Field(s) with empty string: ${emptyField.join(', ')}`,
    });
    return false;
  } else return true;
};
