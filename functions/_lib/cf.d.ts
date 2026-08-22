interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement
  first<T = unknown>(): Promise<T | null>
  run(): Promise<{ meta: { last_row_id: number } }>
  all<T = unknown>(): Promise<{ results: T[] }>
}

interface D1Database {
  prepare(query: string): D1PreparedStatement
}

interface R2ObjectBody {
  body: ReadableStream
  writeHttpMetadata(headers: Headers): void
}

interface R2Bucket {
  put(
    key: string,
    value: ArrayBuffer,
    options?: { httpMetadata?: { contentType?: string } },
  ): Promise<unknown>
  get(key: string): Promise<R2ObjectBody | null>
  delete(key: string): Promise<void>
}
