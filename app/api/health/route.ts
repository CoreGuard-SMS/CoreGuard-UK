import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Basic health check
    const health: any = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'CoreGuard SMS',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
    };

    // Check database connection (optional)
    try {
      // Simple database health check would go here
      // For now, just check if environment variables are set
      const dbCheck = {
        supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        supabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        supabaseServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      };

      health['database'] = dbCheck;
    } catch (dbError) {
      health['database'] = { status: 'error', error: dbError instanceof Error ? dbError.message : 'Unknown error' };
    }

    return NextResponse.json(health);
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        service: 'CoreGuard SMS',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
