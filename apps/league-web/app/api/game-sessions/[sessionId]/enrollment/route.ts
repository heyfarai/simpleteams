import { NextRequest, NextResponse } from 'next/server';
import { sessionEnrollmentService } from '@simpleteams/services'; // was: @simpleteams/services/session-enrollment-service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    const { searchParams } = new URL(request.url);
    const rosterId = searchParams.get('rosterId');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    let enrollments;

    if (rosterId) {
      // Get specific roster's enrollment in this session
      const enrollment = await sessionEnrollmentService.getTeamSessionEnrollment(rosterId, sessionId);
      enrollments = enrollment ? [enrollment] : [];
    } else {
      // Get all enrollments for this session
      enrollments = await sessionEnrollmentService.getSessionEnrollments(sessionId);
    }

    return NextResponse.json({
      enrollments,
      count: enrollments.length
    });

  } catch (error) {
    console.error('[API] Error fetching session enrollments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch session enrollments' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    const body = await request.json();
    const { rosterId } = body;

    if (!sessionId || !rosterId) {
      return NextResponse.json(
        { error: 'Session ID and Roster ID are required' },
        { status: 400 }
      );
    }

    const enrollment = await sessionEnrollmentService.enrollTeamInSession(rosterId, sessionId);

    return NextResponse.json({ enrollment }, { status: 201 });

  } catch (error) {
    console.error('[API] Error creating session enrollment:', error);

    if (error.message.includes('already enrolled')) {
      return NextResponse.json(
        { error: 'Roster is already enrolled in this session' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to enroll in session' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    const { searchParams } = new URL(request.url);
    const rosterId = searchParams.get('rosterId');

    if (!sessionId || !rosterId) {
      return NextResponse.json(
        { error: 'Session ID and Roster ID are required' },
        { status: 400 }
      );
    }

    await sessionEnrollmentService.withdrawTeamFromSession(rosterId, sessionId);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('[API] Error withdrawing from session:', error);
    return NextResponse.json(
      { error: 'Failed to withdraw from session' },
      { status: 500 }
    );
  }
}