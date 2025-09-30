import type { Application, RequestHandler } from 'express';
import type { Container } from 'inversify';
import {
  controller as inversifyController,
  httpGet as inversifyHttpGet,
  httpPost as inversifyHttpPost,
  httpPut as inversifyHttpPut,
  httpPatch as inversifyHttpPatch,
  httpDelete as inversifyHttpDelete,
  httpHead as inversifyHttpHead,
  httpOptions as inversifyHttpOptions,
  httpMethod as inversifyHttpMethod,
  BaseHttpController as InversifyBaseHttpController,
  InversifyExpressServer,
} from 'inversify-express-utils';

export const Controller = inversifyController;

export const Get = (path?: string | RegExp, ...mw: RequestHandler[]) =>
  inversifyHttpGet(path as any, ...(mw as any));

export const Post = (path?: string | RegExp, ...mw: RequestHandler[]) =>
  inversifyHttpPost(path as any, ...(mw as any));

export const Put = (path?: string | RegExp, ...mw: RequestHandler[]) =>
  inversifyHttpPut(path as any, ...(mw as any));

export const Patch = (path?: string | RegExp, ...mw: RequestHandler[]) =>
  inversifyHttpPatch(path as any, ...(mw as any));

export const Delete = (path?: string | RegExp, ...mw: RequestHandler[]) =>
  inversifyHttpDelete(path as any, ...(mw as any));

export const Head = (path?: string | RegExp, ...mw: RequestHandler[]) =>
  inversifyHttpHead(path as any, ...(mw as any));

export const Options = (path?: string | RegExp, ...mw: RequestHandler[]) =>
  inversifyHttpOptions(path as any, ...(mw as any));

export const Method = (method: string, path?: string | RegExp, ...mw: RequestHandler[]) =>
  inversifyHttpMethod(method as any, path as any, ...(mw as any));

export abstract class BaseController extends InversifyBaseHttpController {}

export type CreateHttpServerOptions = {
  rootPath?: string;
  configure?: (app: Application) => void;
  configureError?: (app: Application) => void;
};

export function createHttpServer(
  container: Container,
  { rootPath = '/api', configure, configureError }: CreateHttpServerOptions = {},
) {
  const server = new InversifyExpressServer(container, null, { rootPath });

  if (configure) server.setConfig(configure);
  if (configureError) server.setErrorConfig(configureError);

  return server.build();
}
