
import { db } from "@/drizzle/db"
import { clerkClient } from "@clerk/nextjs/server"
import InternalPublicProfileView, { UserData, EventData, PublicProfileViewProps } from "@/components/profile/internal-public-profile-view"

export const revalidate = 0

interface PageProps {
  params: Promise<{
    clerkUserId: string
  }>
}

export default async function BookingPage({ params }: PageProps) {
  const { clerkUserId } = await params

  const eventsRaw = await db.query.EventTable.findMany({
    where: ({ clerkUserId: userIdCol, isActive }, { eq, and }) =>
      and(eq(userIdCol, clerkUserId), eq(isActive, true)),
    orderBy: ({ name }, { asc, sql }) => asc(sql`lower(${name})`),
  })

  const userRaw = await (await clerkClient()).users.getUser(clerkUserId)
  const { fullName, primaryEmailAddress, primaryPhoneNumber, imageUrl } = userRaw
  const publicMetadata = (userRaw.publicMetadata as {
    location?: string;
    facebookUrl?: string;
    instagramUrl?: string;
    whatsappNumber?: string;
  }) || {}

  const userForView: UserData = {
    fullName,
    primaryEmailAddress: primaryEmailAddress ? { emailAddress: primaryEmailAddress.emailAddress } : null,
    primaryPhoneNumber: primaryPhoneNumber ? { phoneNumber: primaryPhoneNumber.phoneNumber } : null,
    imageUrl,
    publicMetadata,
  }

  const eventsForView: EventData[] = eventsRaw.map(event => ({
    id: event.id,
    name: event.name,
    price: event.price,
    clerkUserId: event.clerkUserId,
    description: event.description,
    durationInMinutes: event.durationInMinutes,
  }))

  const viewData: PublicProfileViewProps = {
    user: userForView,
    events: eventsForView,
    clerkUserId: clerkUserId,
  }

  return <InternalPublicProfileView {...viewData} />
}
