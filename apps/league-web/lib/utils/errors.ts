export class FetchError extends Error {
  constructor(message: string, public status?: number) {
    super(message)
    this.name = 'FetchError'
  }
}

export function handleFetchError(error: unknown): Error {
  if (error instanceof Error) {
    return error
  }
  return new Error('An unexpected error occurred')
}
