declare module 'uuid'{
    export function v4(): string;
    export function v5(name: string, namespace: string): string;
    export function validate(uuid: string): boolean;
    export function parse(uuid: string): number[];
    export function stringify(arr: number[]): string;
}
declare module 'multer' {
  import { RequestHandler } from 'express';

  export function diskStorage(options: {
    destination: (req: any, file: any, cb: (error: Error | null, destination: string) => void) => void;
    filename: (req: any, file: any, cb: (error: Error | null, filename: string) => void) => void;
  }): {
    _handleFile(req: any, file: any, cb: (error?: Error | null, info?: any) => void): void;
    _removeFile(req: any, file: any, cb: (error?: Error | null) => void): void;
  };

  export function single(fieldName: string): RequestHandler;
}