
import { IncomingForm, Fields, Files } from "formidable";
import { NextRequest } from "next/server";
import { Readable } from "stream";
import type { IncomingMessage } from "http";

export async function parseForm(request: NextRequest): Promise<{
    fields: Record<string, string>;
    files: Files;
}> {
    const reader = request.body?.getReader();

    if (!reader) {import { IncomingForm, Fields, Files } from "formidable";
import { NextRequest } from "next/server";
import { Readable } from "stream";
import type { IncomingMessage } from "http";

export async function parseForm(request: NextRequest): Promise<{
    fields: Record<string, string>;
    files: Files;
}> {
    if (!request.body) {
        throw new Error("Request body is empty");
    }

    // Narrowed, non-undefined reader (const, so narrowing persists in closures)
    const reader: ReadableStreamDefaultReader<Uint8Array> =
        request.body.getReader();

    const form = new IncomingForm({
        keepExtensions: true,
        multiples: true,
    });

    return new Promise((resolve, reject) => {
        const stream = new Readable({
            read() {},
        });

        async function pump() {
            try {
                while (true) {
                    const { done, value } = await reader.read();

                    if (done) {
                        stream.push(null);
                        break;
                    }

                    stream.push(Buffer.from(value));
                }
            } catch (error) {
                stream.destroy(
                    error instanceof Error ? error : new Error("Stream error")
                );
            }
        }

        Object.assign(stream, {
            headers: Object.fromEntries(request.headers.entries()),
            method: request.method,
            url: request.url,
        });

        form.parse(
            stream as unknown as IncomingMessage,
            (err, fields: Fields, files: Files) => {
                if (err) {
                    reject(err);
                    return;
                }

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
            }
        );

        pump();
    });
}
        throw new Error("Request body is empty");
    }

    const form = new IncomingForm({
        keepExtensions: true,
        multiples: true
    });

    return new Promise((resolve, reject) => {
        const stream = new Readable({
            read() {}
        });

        async function pump() {
            try {
                while (true) {
                    const { done, value } = await reader.read();

                    if (done) {
                        stream.push(null);
                        break;
                    }

                    stream.push(Buffer.from(value));
                }
            } catch (error) {
                stream.destroy(
                    error instanceof Error ? error : new Error("Stream error")
                );
            }
        }

        Object.assign(stream, {
            headers: Object.fromEntries(request.headers.entries()),
            method: request.method,
            url: request.url,
        });

        form.parse(
            stream as unknown as IncomingMessage,
            (err, fields: Fields, files: Files) => {
                if (err) {
                    reject(err);
                    return;
                }

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
            }
        );

        pump();
    });
}
