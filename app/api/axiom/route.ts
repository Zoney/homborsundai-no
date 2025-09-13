import { logger } from "@/lib/axiom/server";

const getEnvironment = (): "localhost" | "preview" | "production" => {
  const vercel = process.env.VERCEL;
  const vercelEnv = process.env.VERCEL_ENV;
  if (vercel) {
    if (vercelEnv === "production") return "production";
    if (vercelEnv === "preview") return "preview";
    return "localhost"; // vercel dev
  }
  if (process.env.NODE_ENV === "development") return "localhost";
  return "production";
};

export const POST = async (req: Request) => {
  try {
    const events = (await req.json()) as any[];
    const environment = getEnvironment();

    for (const event of events) {
      const augmented = {
        ...event,
        fields: {
          ...(event?.fields ?? {}),
          environment,
          vercel: {
            env: process.env.VERCEL_ENV,
            url: process.env.VERCEL_URL,
            region: process.env.VERCEL_REGION,
          },
        },
      };
      logger.raw(augmented);
    }
    await logger.flush();
    return new Response(JSON.stringify({ status: "ok" }));
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ status: "error" }), { status: 500 });
  }
};
