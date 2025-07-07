import { IncomingForm } from "formidable";
import { NextRequest } from "next/server";
import { Readable } from "stream";

export async function parseForm(request: NextRequest): Promise<{
  fields: Record<string, string>,
  files: Record<string, any>
}> {
  const form = new IncomingForm({ keepExtensions: true, multiples: true });

  return new Promise((resolve, reject) => {
    const reader = request.body?.getReader();
    const stream = new Readable({ read() {} });

    async function pump() {
      while (true) {
        const { done, value } = await reader!.read();
        if (done) {
          stream.push(null);
          break;
        }
        stream.push(Buffer.from(value));
      }
    }

    pump();

    (stream as any).headers = Object.fromEntries(request.headers.entries());

    form.parse(stream as any, (err, fields, files) => {
      if (err) return reject(err);

      const normalizedFields: Record<string, string> = {};

      Object.entries(fields).forEach(([key, value]) => {
        if (typeof value === "string") {
          normalizedFields[key] = value;
        } else if (Array.isArray(value)) {
          normalizedFields[key] = value[0] ?? ""; // fallback
        } else {
          normalizedFields[key] = "";
        }
      });

      resolve({
        fields: normalizedFields,
        files: files as Record<string, any>,
      });
    });
  });
}




