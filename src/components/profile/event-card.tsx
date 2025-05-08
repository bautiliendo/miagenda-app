import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { CalendarPlus, Clock, DollarSign } from "lucide-react";
import Link from "next/link";
import { formatEventDescription } from "@/lib/formatters";

export type EventCardProps = {
    id: string;
    price: number;
    name: string;
    clerkUserId: string;
    description: string | null;
    durationInMinutes: number;
  };
  
  export function EventCard({
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