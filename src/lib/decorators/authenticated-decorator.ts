import type { Request, Response } from 'express';

export default function authenticated(): MethodDecorator {
  return (target: Object, propertyKey: string | Symbol, descriptor: PropertyDescriptor) => {
    const { value: original } = descriptor;

    descriptor.value = function (...args: any) {
      const [request, response]: [Request, Response] = args;
      const { headers } = request;

      // TODO check if authorization token is valid
      if (headers.authorization) {
        return original.apply(this, args);
      }

      response.status(403).json({ error: 'Not Authorized' });
    };
  };
}
