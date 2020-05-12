const fs = require("fs");

const {
  pascalCase
} = require("pascal-case");
const prettier = require("prettier");
const TypeWriter = require("@gimenete/type-writer");
const webhooks = require("@octokit/webhooks-definitions");

const signatures = [];
const tw = new TypeWriter();

webhooks.forEach(({
  name,
  actions,
  examples
}) => {
  if (!examples) {
    return;
  }

  const typeName = `WebhookPayload${pascalCase(name)}`;
  tw.add(examples, {
    rootTypeName: typeName,
    namedKeyPaths: {
      [`${typeName}.repository`]: "PayloadRepository",
      // This prevents a naming colision between the payload of a `installation_repositories` event
      // and the `repositories` attribute of a `installation` event
      "WebhookPayloadInstallation.repositories": "WebhookPayloadInstallation_Repositories",
    },
  });

  const events = [
    `'${name}'`,
    ...actions.map((action) => `'${name}.${action}'`),
  ].join(" | ");
  signatures.push(`
    public on (event: ${events}, callback: (event: Webhooks.WebhookEvent<Webhooks.${typeName}>) => (Promise<void> | void)): void
  `);
});

const definition = `
// DO NOT EDIT THIS FILE DIRECTLY
// make edits in scripts/generate-types.js

import http = require('http')

type Options = {
  secret: string
  path?: string
  transform?: (event: Webhooks.WebhookEvent<any>) => Webhooks.WebhookEvent<any> & { [key: string]: any }
}

declare namespace Webhooks {
  ${tw.generate("typescript", { inlined: false })}

  interface WebhookEvent<T> {
    id: string
    name: string
    payload: T
    protocol?: 'http' | 'https'
    host?: string
    url?: string
  }
}

declare class Webhooks {
  constructor (options?: Options)

  public on (event: 'error', callback: (event: Error) => void): void
  public on (event: '*' | string[], callback: (event: Webhooks.WebhookEvent<any>) => Promise<void> | void): void
  ${signatures.join("\n")}

  public sign (data: any): string
  public verify (eventPayload: any, signature: string): boolean
  public verifyAndReceive (options: { id: string, name: string, payload: any, signature: string }): Promise<void>
  public receive (options: { id: string, name: string, payload: any }): Promise<void>
  public removeListener (event: string | string[], callback: (event: Webhooks.WebhookEvent<any>) => void): void
  public removeListener (event: string | string[], callback: (event: Webhooks.WebhookEvent<any>) => Promise<void>): void
  public middleware (request: http.IncomingMessage, response: http.ServerResponse, next?: (err?: any) => void): void | Promise<void>
}

export default Webhooks
export { Webhooks }
`;

const filepath = "index.d.ts";
const output = prettier.format(definition, {
  filepath
});
fs.writeFileSync(filepath, output);