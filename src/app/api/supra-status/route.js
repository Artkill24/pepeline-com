export const dynamic = 'force-dynamic';
export async function GET() {
    return Response.json({ status: 'unavailable', message: 'Using Alchemy now.', timestamp: new Date().toISOString() });
}
