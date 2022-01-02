export const ErrorType = {
  INVALID_ARGUMENT: 'Invalid argument provided',
  MISSING_ARGUMENT: 'Missing a required argument',
  INVALID_QUEUE_STRUCT: 'Invalid queue structure',
  DUPLICATE_EXTRACTOR: 'Extractor with the same ID already exist',
  DUPLICATE_QUEUE: 'Queue with the same ID already exist',
} as const;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class MusiccaError<T = any> extends Error {
  public readonly instance: T;

  constructor(name: keyof typeof ErrorType, instance: T) {
    super(ErrorType[name]);

    this.name = name;
    this.instance = instance;
  }

  static get types() {
    return ErrorType;
  }
}