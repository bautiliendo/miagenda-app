import InternalPublicProfileView from "@/components/profile/internal-public-profile-view";
import { db } from "@/drizzle/db";
import { clerkClient, auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { CopyProfileButton } from "@/components/CopyEventButton";
import { AlertTriangle } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { getOAuthClient } from "@/server/actions/googleCalendar";

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

  const client = await getOAuthClient(userId)


  if (!client) {
    return (
      <div className="p-6 max-w-2xl mx-auto text-center">
        <div className="bg-orange-50 border border-orange-200 p-6 rounded-lg shadow-md">
          <AlertTriangle className="mx-auto h-12 w-12 text-orange-400 mb-4" />
          <h2 className="text-2xl font-semibold text-orange-700 mb-3">
            Conexión con Google Calendar Requerida
          </h2>
          <p className="text-orange-600 mb-6">
            Para acceder a tu página de negocio y compartirla con tus clientes, es necesario que conectes tu cuenta de Google.
          </p>
          <UserButton showName={true} />
          <p className="text-sm text-gray-500 mt-4">
            Haz click en el botón de tu cuenta, presiona &quot;Manage account&quot; y conecta tu cuenta de Google Calendar en &quot;Connected accounts&quot;.
          </p>
        </div>
      </div>
    )
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
