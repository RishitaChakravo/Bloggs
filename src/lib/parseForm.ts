
import { IncomingForm, Fields, Files } from "formidable";
import { NextRequest } from "next/server";
import { Readable } from "stream";

export async function parseForm(request: NextRequest): Promise<{
  fields: Record<string, string>;
  files: Files;
}> {
  const form = new IncomingForm({ keepExtensions: true, multiples: true });

  return new Promise((resolve, reject) => {
    const reader = request.body?.getReader();
    const stream = new Readable({ read() {} });

    async function pump() {
      try {
        while (true) {
          const { done, value } = await reader!.read();

          if (done) {
            stream.push(null);
            break;
          }

          stream.push(Buffer.from(value));
        }
      } catch (error) {
        reject(error);
      }
    }

    pump();

    Object.assign(stream, {
      headers: Object.fromEntries(request.headers.entries()),
      method: request.method,
      url: request.url,
    });

    form.parse(stream as Readable & {
      headers: Record<string, string>;
      method: string;
      url: string;
    }, (err, fields: Fields, files: Files) => {
      if (err) return reject(err);

      const normalizedFields: Record<string, string> = {};

      Object.entries(fields).forEach(([key, value]) => {
        if (typeof value === "string") {
          normalizedFields[key] = value;
        } else if (Array.isArray(value)) {
          normalizedFields[key] = value[0] ?? "";
        } else {
          normalizedFields[key] = "";
        }
      });

      resolve({
        fields: normalizedFields,
        files,
      });
    });
  });
}
