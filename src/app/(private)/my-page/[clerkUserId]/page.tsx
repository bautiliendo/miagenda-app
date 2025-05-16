import InternalPublicProfileView from "@/components/profile/internal-public-profile-view";
import { db } from "@/drizzle/db";
import { clerkClient, auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { CopyProfileButton } from "@/components/CopyEventButton";

export const revalidate = 0;
interface PageProps {
  params: Promise<{
    clerkUserId: string;
  }>;
}

export default async function MyPagePreview({ params }: PageProps) {
  const { clerkUserId } = await params;
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

    if (userId !== clerkUserId) {
    console.warn(`Advertencia: Usuario ${userId} viendo preview de ${clerkUserId}.`);
  }

  const events = await db.query.EventTable.findMany({
    where: ({ clerkUserId: userIdCol, isActive }, { eq, and }) =>
      and(eq(userIdCol, clerkUserId), eq(isActive, true)),
    orderBy: ({ name }, { asc, sql }) => asc(sql`lower(${name})`),
  });


  let userToShow;
  try {
    userToShow = await (await clerkClient()).users.getUser(clerkUserId);
  } catch (error) {
    console.error("Error fetching user for preview:", error);
    return notFound();
  }

  const { fullName, primaryEmailAddress, primaryPhoneNumber, imageUrl } = userToShow;
  const publicMetadata = userToShow.publicMetadata as {
    location?: string;
    facebookUrl?: string;
    instagramUrl?: string;
    whatsappNumber?: string;
  } || {};

  const viewData = {
    user: {
      fullName,
      primaryEmailAddress: primaryEmailAddress ? { emailAddress: primaryEmailAddress.emailAddress } : null,
      primaryPhoneNumber: primaryPhoneNumber ? { phoneNumber: primaryPhoneNumber.phoneNumber } : null,
      imageUrl,
      publicMetadata,
    },
    events,
    clerkUserId,
    isOwner: userId === clerkUserId,
    copyButton: <CopyProfileButton clerkUserId={clerkUserId} />,
  };

  return <InternalPublicProfileView {...viewData} />;
}
