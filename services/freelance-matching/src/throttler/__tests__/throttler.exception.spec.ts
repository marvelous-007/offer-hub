import { HttpStatus } from '@nestjs/common';
import { ThrottlerException } from '../throttler.exception';

describe('ThrottlerException', () => {
  it('should create an exception with the correct status code', () => {
    const ttl = 60000;
    const limit = 100;
    const exception = new ThrottlerException(ttl, limit);

    expect(exception.getStatus()).toBe(HttpStatus.TOO_MANY_REQUESTS);
  });

  it('should include ttl and limit in the response', () => {
    const ttl = 60000;
    const limit = 100;
    const exception = new ThrottlerException(ttl, limit);
    const response = exception.getResponse() as any;

    expect(response.ttl).toBe(ttl);
    expect(response.limit).toBe(limit);
  });

  it('should format the wait time in seconds', () => {
    const ttl = 60000; // 60 seconds
    const limit = 100;
    const exception = new ThrottlerException(ttl, limit);
    const response = exception.getResponse() as any;

    expect(response.message).toContain('60 seconds');
  });

  it('should round up the wait time to the nearest second', () => {
    const ttl = 60500; // 60.5 seconds
    const limit = 100;
    const exception = new ThrottlerException(ttl, limit);
    const response = exception.getResponse() as any;

    expect(response.message).toContain('61 seconds');
  });

  it('should include the limit in the message', () => {
    const ttl = 60000;
    const limit = 100;
    const exception = new ThrottlerException(ttl, limit);
    const response = exception.getResponse() as any;

    expect(response.message).toContain('100 requests');
  });
});
