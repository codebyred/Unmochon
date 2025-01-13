// // file: src/app/db/index.ts
// import { neon } from '@neondatabase/serverless';
// import { drizzle } from 'drizzle-orm/neon-http';
// import * as schemas from './schema';

// if (!process.env.DATABASE_URL) {
//   throw new Error('DATABASE_URL must be a Neon postgres connection string')
// }

// const sql = neon(process.env.DATABASE_URL);

// export const db = drizzle(sql, {
//   schema: schemas
// });

import { neonConfig, Pool } from '@neondatabase/serverless';
import { drizzle as neonDrizzle, NeonDatabase } from 'drizzle-orm/neon-serverless';
import * as schema from './schema';

const drizzleClient = (datasourceUrl: string | undefined) => {
  const connectionString = datasourceUrl || process.env.DATABASE_URL;

  const client = () => {
    
    const pool = new Pool({ connectionString });
    return neonDrizzle(pool, { schema });
    
  };

  if (!connectionString) {
    return null as any as ReturnType<typeof client>;
  }

  return client();
};

declare global {
  // eslint-disable-next-line vars-on-top, no-var
  var localDrizzle: ReturnType<typeof drizzleClient>;
}

export const getDrizzleClient = (url?: string): ReturnType<typeof drizzleClient> => {
  if (process.env.SERVER || url) {
    return drizzleClient(url);
  }

  if (!global.localDrizzle) {
    global.localDrizzle = drizzleClient(url);
  }
  return global.localDrizzle;
};

const db = getDrizzleClient();
export { db };

