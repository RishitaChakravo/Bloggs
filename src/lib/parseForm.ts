import { IncomingForm } from "formidable";
import { NextRequest } from "next/server";
import { Readable } from "stream";

export async function parseForm(request: NextRequest): Promise<{
  fields: Record<string, string>,
  files: Record<string, any>
}> {
  const form = new IncomingForm({ keepExtensions: true, multiples: true });

  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];

    const readable = new Readable({
      read() {}
    });

    request.body?.getReader().read().then(function process({ done, value }): any {
      if (done) {
        readable.push(null);
        return;
      }
      chunks.push(Buffer.from(value));
      readable.push(value);
      return request.body!.getReader().read().then(process);
    });

    form.parse(readable as any, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields: fields as any, files: files as any });
    });
  });
}

