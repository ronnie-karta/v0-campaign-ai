let prismaClient: any = null
let promise: Promise<any> | null = null

const initializePrisma = async () => {
  if (prismaClient) return prismaClient
  if (promise) return promise

  try {
    const { Pool } = await import('pg')
    const { PrismaPg } = await import('@prisma/adapter-pg')
    const { PrismaClient } = await import('@prisma/client')

    let connectionString = process.env.DATABASE_URL

    if (!connectionString) {
      throw new Error(
        '[v0] DATABASE_URL environment variable is not set. ' +
        'Please add your database connection string to your environment variables.'
      )
    }

    if (connectionString) {
      connectionString = connectionString
        .replace('sslmode=require', 'sslmode=verify-full')
        .replace('sslmode=prefer', 'sslmode=verify-full')
        .replace('sslmode=verify-ca', 'sslmode=verify-full')
    }

    promise = (async () => {
      const pool = new Pool({ connectionString })
      const adapter = new PrismaPg(pool as any)
      prismaClient = new PrismaClient({ adapter })
      return prismaClient
    })()

    return await promise
  } catch (error) {
    console.error('[v0] Failed to initialize Prisma Client:', error)
    throw error
  }
}

export { initializePrisma }

// Provide a proxy default export so it can be imported as `import db from "@/lib/db"`
export default new Proxy({} as any, {
  get: (target, prop) => {
    if (prop === 'then') return undefined; // Required so the Proxy isn't treated as a Promise itself
    if (prop === '$transaction') {
        return async (...mArgs: any[]) => {
            const client = await initializePrisma();
            return client.$transaction(...mArgs)
        }
    }
    return new Proxy({}, {
        get: (mTarget, mProp) => {
            return async (...mArgs: any[]) => {
                const client = await initializePrisma();
                const model = client[prop];
                if (!model) {
                    throw new Error(`Cannot find ${String(prop)} on Prisma client`)
                }
                return model[mProp](...mArgs)
            }
        }
    })
  }
});
