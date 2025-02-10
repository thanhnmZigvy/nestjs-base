import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import { getCurrentUser } from '@/utils/request-context';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  // Console color codes
  private colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    gray: '\x1b[90m',
    white: '\x1b[37m',
  };

  private colorize(color: string, text: string | number): string {
    return `${color}${text}${this.colors.reset}`;
  }

  private statusColor(status: number): string {
    if (status >= 500) {
      return this.colorize(this.colors.red, status);
    }
    if (status >= 400) {
      return this.colorize(this.colors.yellow, status);
    }
    if (status >= 300) {
      return this.colorize(this.colors.cyan, status);
    }
    if (status >= 200) {
      return this.colorize(this.colors.green, status);
    }
    return this.colorize(this.colors.gray, status);
  }

  private methodColor(method: string): string {
    switch (method.toUpperCase()) {
      case 'GET':
        return this.colorize(this.colors.green, method);
      case 'POST':
        return this.colorize(this.colors.yellow, method);
      case 'PUT':
        return this.colorize(this.colors.blue, method);
      case 'DELETE':
        return this.colorize(this.colors.red, method);
      case 'PATCH':
        return this.colorize(this.colors.magenta, method);
      default:
        return this.colorize(this.colors.gray, method);
    }
  }

  private responseTimeColor(time: number): string {
    if (time >= 1000) {
      return this.colorize(this.colors.red, `${time.toFixed(3)}ms`);
    }
    if (time >= 100) {
      return this.colorize(this.colors.yellow, `${time.toFixed(3)}ms`);
    }
    return this.colorize(this.colors.green, `${time.toFixed(3)}ms`);
  }

  private formatDate(date: Date) {
    const options = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
    };

    // Format the date using toLocaleString
    const formattedDate = date.toLocaleString('en-US', options as any);

    // Replace the comma with a space to match the desired format
    return formattedDate.replace(',', '');
  }

  private tokens = {
    method: (req: Request) => this.methodColor(req.method),
    url: (req: Request) =>
      this.colorize(this.colors.white, req.originalUrl || req.url),
    status: (_: Request, res: Response) => this.statusColor(res.statusCode),
    contentLength: (_: Request, res: Response) => {
      const len = res.get('content-length');
      return this.colorize(this.colors.gray, len || '-');
    },
    responseTime: (_: Request, __: Response, startAt: [number, number]) => {
      const diff = process.hrtime(startAt);
      const time = diff[0] * 1e3 + diff[1] * 1e-6;
      return this.responseTimeColor(time);
    },
    date: () =>
      this.colorize(this.colors.gray, `[${this.formatDate(new Date())}]`),

    remoteUser: (_: Request) =>
      this.colorize(
        this.colors.gray,
        getCurrentUser() ? `id : ${getCurrentUser().id}` : '-',
      ),
    httpVersion: (req: Request) =>
      this.colorize(this.colors.gray, `HTTP/${req.httpVersion}`),
    referrer: (req: Request) => {
      const ref = req.get('referer') || req.get('referrer') || '-';
      return this.colorize(this.colors.gray, `"${ref}"`);
    },
    userAgent: (req: Request) => {
      const agent = req.get('user-agent') || '-';
      return this.colorize(this.colors.gray, `"${agent}"`);
    },
  };

  // private format(
  //   req: Request,
  //   res: Response,
  //   startAt: [number, number],
  // ): string {
  //   return [
  //     [
  //       this.tokens.method(req),
  //       this.tokens.url(req),
  //       this.tokens.httpVersion(req),
  //     ].join(' '),
  //     this.tokens.status(req, res),
  //     this.tokens.contentLength(req, res),
  //     this.tokens.responseTime(req, res, startAt),
  //     this.tokens.referrer(req),
  //     this.tokens.userAgent(req),
  //     this.tokens.remoteUser(req),
  //     this.tokens.date(),
  //   ].join(' ');
  // }
  private format(
    req: Request,
    res: Response,
    startAt: [number, number],
  ): string {
    return [
      `${this.colors.magenta}------------------------------- Request Log -------------------------------${this.colors.reset}`,
      `${this.colors.cyan}Request:${this.colors.reset}`,
      `  ${this.tokens.method(req)} ${this.tokens.url(req)} ${this.tokens.httpVersion(req)}`,
      `${this.colors.cyan}Response:${this.colors.reset}`,
      `  Status: ${this.tokens.status(req, res)}`,
      `  Content-Length: ${this.tokens.contentLength(req, res)}`,
      `  Response Time: ${this.tokens.responseTime(req, res, startAt)}`,
      `${this.colors.cyan}Metadata:${this.colors.reset}`,
      `  Referrer: ${this.tokens.referrer(req)}`,
      `  User-Agent: ${this.tokens.userAgent(req)}`,
      `  Remote User: ${this.tokens.remoteUser(req)}`,
      `  Date: ${this.tokens.date()}`,
      `${this.colors.magenta}------------------------------------------------------------------------${this.colors.reset}`,
    ].join('\n');
  }

  use(request: Request, response: Response, next: NextFunction): void {
    const startAt = process.hrtime();

    response.on('finish', () => {
      const logMessage = this.format(request, response, startAt);
      console.log(logMessage);
    });

    next();
  }
}
