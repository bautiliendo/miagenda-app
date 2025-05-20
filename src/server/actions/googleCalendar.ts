"use server";

import "server-only";

import { clerkClient, auth } from "@clerk/nextjs/server";
import { google } from "googleapis";
import { addMinutes } from "date-fns";
import { revalidatePath } from "next/cache";

export async function getCalendarEventTimes(
  clerkUserId: string,
  { start, end }: { start: Date; end: Date }
) {
  const oAuthClient = await getOAuthClient(clerkUserId);
  if (oAuthClient == null) {
    console.error(
      "Failed to get OAuth client in getCalendarEventTimes for user:",
      clerkUserId
    );
    return [];
  }

  try {
    const events = await google.calendar("v3").events.list({
      calendarId: "primary",
      eventTypes: ["default"],
      singleEvents: true,
      timeMin: start.toISOString(),
      timeMax: end.toISOString(),
      maxResults: 2500,
      auth: oAuthClient,
    });

    return (
      events.data.items
        ?.map((event) => {
          if (
            event.start?.dateTime == null ||
            event.end?.dateTime == null ||
            event.id == null
          )
            return null;

          return {
            id: event.id,
            start: new Date(event.start.dateTime),
            end: new Date(event.end.dateTime),
            summary: event.summary,
            description: event.description,
            attendees: event.attendees,
            extendedProperties: event.extendedProperties,
          };
        })
        .filter((event): event is NonNullable<typeof event> => event != null) ||
      []
    );
  } catch (error) {
    console.error("Error fetching calendar events:", error);
    return [];
  }
}

export async function createCalendarEvent({
  clerkUserId,
  guestName,
  guestEmail,
  guestPhone,
  startTime,
  guestNotes,
  durationInMinutes,
  eventName,
}: {
  clerkUserId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  startTime: Date;
  guestNotes?: string | null;
  durationInMinutes: number;
  eventName: string;
}) {
  const oAuthClient = await getOAuthClient(clerkUserId);
  if (oAuthClient == null) {
    throw new Error("Failed to get OAuth client for creating event");
  }
  const { primaryEmailAddress, fullName } = await (
    await clerkClient()
  ).users.getUser(clerkUserId);
  if (primaryEmailAddress == null) {
    throw new Error("Clerk user has no primary email");
  }

  try {
    const calendarEvent = await google.calendar("v3").events.insert({
      calendarId: "primary",
      auth: oAuthClient,
      sendUpdates: "all",
      requestBody: {
        attendees: [
          { email: guestEmail, displayName: guestName },
          {
            email: primaryEmailAddress.emailAddress,
            displayName: fullName,
            responseStatus: "needsAction",
          },
        ],
        description: guestNotes
          ? `Detalles adicionales: ${guestNotes}`
          : undefined,
        start: {
          dateTime: startTime.toISOString(),
        },
        end: {
          dateTime: addMinutes(startTime, durationInMinutes).toISOString(),
        },
        summary: `${guestName} + ${fullName}: ${eventName}`,
        extendedProperties: {
          private: {
            guestPhone: guestPhone,
          },
        },
      },
    });
    return calendarEvent.data;
  } catch (error) {
    console.error("Error creating calendar event:", error);
    throw new Error("Failed to create Google Calendar event.");
  }
}

export async function getOAuthClient(clerkUserId: string) {
  try {
    const response = await (
      await clerkClient()
    ).users.getUserOauthAccessToken(clerkUserId, "google");

    if (response.data.length === 0 || response.data[0].token == null) {
      console.error("No Google OAuth token found for user:", clerkUserId);
      return null;
    }

    const client = new google.auth.OAuth2(
      process.env.GOOGLE_OAUTH_CLIENT_ID,
      process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      process.env.GOOGLE_OAUTH_REDIRECT_URI
    );

    client.setCredentials({ access_token: response.data[0].token });
    return client;
  } catch (error) {
    console.error("Error fetching OAuth token:", error);
    return null;
  }
}

export async function deleteCalendarEvent(eventId: string) {
  const { userId } = await auth();

  if (!userId) {
    console.error("User not authenticated for delete operation.");
    return { success: false, error: "Authentication required." };
  }

  if (!eventId) {
    console.error("Event ID is required for deletion.");
    return { success: false, error: "Event ID missing." };
  }

  const oAuthClient = await getOAuthClient(userId);
  if (!oAuthClient) {
    console.error("Failed to get OAuth client for user:", userId);
    return {
      success: false,
      error: "Failed to authenticate with Google Calendar.",
    };
  }

  try {
    await google.calendar("v3").events.delete({
      calendarId: "primary",
      eventId: eventId,
      auth: oAuthClient,
      sendUpdates: "all",
    });

    console.log(`Event ${eventId} deleted successfully for user ${userId}.`);
    revalidatePath("/agenda");
    return { success: true };
  } catch (error: unknown) {
    console.error(`Error deleting event ${eventId} for user ${userId}:`, error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to delete event from Google Calendar.";
    return { success: false, error: errorMessage };
  }
}