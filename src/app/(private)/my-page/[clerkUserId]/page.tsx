import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/drizzle/db";
import { formatEventDescription } from "@/lib/formatters";
import { clerkClient, auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Clock, CalendarPlus, CalendarCheck, Star, MapPin, Phone, Mail, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

type EventData = {
  id: string;
  price: number;
  name:string;
  clerkUserId: string;
  description: string | null;
  durationInMinutes: number;
};

type UserData = {
  fullName: string | null;
  primaryEmailAddress: { emailAddress: string } | null;
  primaryPhoneNumber: { phoneNumber: string } | null;
  imageUrl: string;
  publicMetadata: {
    location?: string;
    facebookUrl?: string;
    instagramUrl?: string;
    whatsappNumber?: string;
  }
};

interface PublicProfileViewProps {
  user: UserData;
  events: EventData[];
  clerkUserId: string;
}

function InternalPublicProfileView({ user, events }: PublicProfileViewProps) {
  const { fullName, primaryEmailAddress, primaryPhoneNumber, imageUrl, publicMetadata } = user;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Star className="size-5 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-medium text-gray-600">Profesional Verificado</span>
          </div>
          <div className="flex flex-col items-center gap-4 mb-4">
            <div className="flex items-center justify-center gap-4">
              <div className="relative size-16 md:size-20 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-gray-200">
                {imageUrl ? (
                  <Image src={imageUrl} alt={fullName ?? 'Perfil'} layout="fill" className="object-cover" />
                ) : (
                  <svg className="size-10 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                  </svg>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                {fullName}
              </h1>
            </div>
          </div>
          <div className="max-w-2xl mx-auto">
            <p className="text-lg text-gray-600 mb-4">
              Selecciona el servicio que deseas reservar y encontremos el mejor horario para tu cita.
            </p>
            <div className="flex items-center justify-center gap-4 text-gray-500">
              <div className="flex items-center gap-2">
                <CalendarCheck className="size-5" />
                <span className="text-sm">Reserva online 24/7</span>
              </div>
              {publicMetadata?.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="size-5" />
                  <span className="text-sm">{publicMetadata.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-8 border border-gray-200">
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="flex flex-col items-center space-y-4">
              {primaryPhoneNumber?.phoneNumber && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="size-5" />
                  <span>{primaryPhoneNumber.phoneNumber}</span>
                </div>
              )}
              {primaryEmailAddress?.emailAddress && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="size-5" />
                  <span>{primaryEmailAddress.emailAddress}</span>
                </div>
              )}
              {publicMetadata?.whatsappNumber && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="size-5" />
                  <Link href={`https://wa.me/${publicMetadata.whatsappNumber.replace(/\D/g, '')}`} target="_blank" className="hover:text-green-600 transition-colors">
                    {publicMetadata.whatsappNumber}
                  </Link>
                </div>
              )}
            </div>
            <div className="flex items-center justify-center gap-6">
              {publicMetadata?.facebookUrl && (
                <Link href={publicMetadata.facebookUrl} target="_blank" className="text-gray-600 hover:text-blue-600 transition-colors">
                  <svg className="size-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
                </Link>
              )}
              {publicMetadata?.instagramUrl && (
                <Link href={publicMetadata.instagramUrl} target="_blank" className="text-gray-600 hover:text-pink-600 transition-colors">
                  <svg className="size-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>
                </Link>
              )}
              <Link href={publicMetadata?.whatsappNumber ? `https://wa.me/${publicMetadata.whatsappNumber.replace(/\D/g, '')}` : "#"} target="_blank" className="text-gray-600 hover:text-green-600 transition-colors">
                 <svg className="size-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" clipRule="evenodd" /></svg>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {events.map(event => (
            <EventCard key={event.id} {...event} />
          ))}
        </div>
      </div>
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-blue-600">AgendIA</span>
              <span className="text-sm text-gray-500">© 2024</span>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-6 text-sm">
              <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
                Descubre AgendIA
              </Link>
              <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
                Términos y Condiciones
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

type EventCardProps = {
  id: string;
  price: number;
  name: string;
  clerkUserId: string;
  description: string | null;
  durationInMinutes: number;
};

function EventCard({
  id,
  name,
  price,
  description,
  clerkUserId,
  durationInMinutes,
}: EventCardProps) {
  return (
    <Card className="flex flex-col h-full transition-all duration-200 hover:shadow-lg hover:border-blue-200 border-gray-200">
      <CardHeader className="border-b bg-gray-50/50">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-semibold text-gray-900">{name}</CardTitle>
          <Badge variant="secondary" className="bg-blue-50 text-blue-600">
            {formatEventDescription(durationInMinutes)}
          </Badge>
        </div>
        <CardDescription className="flex items-center gap-2 mt-2 font-bold text-black">
          <DollarSign className="size-4" />
          <span>{price > 0 ? `${price.toLocaleString('es-ES')}` : ''}</span>
        </CardDescription>
        <CardDescription className="flex items-center gap-2 text-gray-600 mt-2">
          <Clock className="size-4" />
          <span>Reserva instantánea</span>
        </CardDescription>
      </CardHeader>
      {description != null && (
        <CardContent className="py-4 flex-grow">
          <p className="text-gray-700">{description}</p>
        </CardContent>
      )}
      <CardFooter className="pt-4 border-t bg-gray-50/50">
        <Button
          asChild
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg transition-all"
        >
          <Link href={`/book/${clerkUserId}/${id}`}>
            <CalendarPlus className="size-4 mr-2" />
            Reservar Ahora
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export const revalidate = 0;

interface PageProps {
  params: {
    clerkUserId: string;
  };
}

export default async function MyPagePreview({ params }: PageProps) {
  const { clerkUserId: pageClerkUserId } = await params;
  const { userId: loggedInUserId } = await auth();

  if (!loggedInUserId) {
    return redirect("/");
  }

  if (loggedInUserId !== pageClerkUserId) {
    console.warn(`Advertencia: Usuario ${loggedInUserId} viendo preview de ${pageClerkUserId}.`);
  }

  const events = await db.query.EventTable.findMany({
    where: ({ clerkUserId: userIdCol, isActive }, { eq, and }) =>
      and(eq(userIdCol, pageClerkUserId), eq(isActive, true)),
    orderBy: ({ name }, { asc, sql }) => asc(sql`lower(${name})`),
  });

  if (events.length === 0 && process.env.NODE_ENV === 'production') {
    return notFound();
  }

  let userToShow;
  try {
    userToShow = await (await clerkClient()).users.getUser(pageClerkUserId);
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
    clerkUserId: pageClerkUserId,
  };

  return <InternalPublicProfileView {...viewData} />;
}
