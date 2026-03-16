
/**
 * Utility to retry Prisma operations on transient failures
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000,
  context: string = 'Operation'
): Promise<T> {
  let lastError: any;
  for (let i = 0; i < retries; i++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      // Handle known transient Prisma errors (P2010, P2025, etc.)
      const isTransient = 
        error.code === 'P2010' || // Raw query failed (timeout/IO)
        error.code === 'P2025' || // Record not found (sometimes occurs during failover)
        error.message?.includes('timed out') ||
        error.message?.includes('Server selection timeout');

      if (isTransient && i < retries - 1) {
        console.warn(`⚠️ [PrismaRetry] ${context} failed (Attempt ${i + 1}/${retries}). Retrying in ${delay}ms...`, {
            errorCode: error.code,
            message: error.message
        });
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
        continue;
      }
      throw error;
    }
  }
  throw lastError;
}
