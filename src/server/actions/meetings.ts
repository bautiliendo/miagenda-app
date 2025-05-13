"use server";
import { db } from "@/drizzle/db";
import { getValidTimesFromSchedule } from "@/lib/getValidTimesFromSchedule";
import { meetingActionSchema } from "@/schema/meetings";
import "use-server";
import { z } from "zod";
import { createCalendarEvent } from "./googleCalendar";
import { redirect } from "next/navigation";
// import { fromZonedTime } from "date-fns-tz";

export async function createMeeting(
  unsafeData: z.infer<typeof meetingActionSchema>
) {
  const { success, data } = meetingActionSchema.safeParse(unsafeData);

  if (!success) return { error: true };

  const event = await db.query.EventTable.findFirst({
    where: ({ clerkUserId, isActive, id }, { eq, and }) =>
      and(
        eq(isActive, true),
        eq(clerkUserId, data.clerkUserId),
        eq(id, data.eventId)
      ),
  });

  if (event == null) return { error: true };
  // ORIGINAL: const startInTimezone = fromZonedTime(data.startTime, data.timezone);
  // CORRECTED: data.startTime is already the correct UTC Date object from the form.
  const correctStartTime = data.startTime;

  // Pass correctStartTime to getValidTimesFromSchedule
  const validTimes = await getValidTimesFromSchedule([correctStartTime], event);
  if (validTimes.length === 0) return { error: true };

  await createCalendarEvent({
    ...data,
    // startTime: startInTimezone, // ORIGINAL
    startTime: correctStartTime, // CORRECTED
    durationInMinutes: event.durationInMinutes,
    eventName: event.name,
  });

  redirect(
    `/book/${data.clerkUserId}/${
      data.eventId
    }/success?startTime=${correctStartTime.toISOString()}`
  );
}
