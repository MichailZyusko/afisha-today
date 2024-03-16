/* eslint-disable no-console */

import { Context } from 'telegraf';

export const timeLogMiddleware = async (ctx: Context, next: () => Promise<void>) => {
  console.time(`Processing update ${ctx.update.update_id}`);
  await next(); // runs next middleware
  // runs after next middleware finishes
  console.timeEnd(`Processing update ${ctx.update.update_id}`);
};
