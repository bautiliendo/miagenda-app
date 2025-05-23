import { UserButton, useUser } from "@clerk/nextjs";

export function AccountButton() {
    const { user } = useUser();
    return (
        <div className="w-full flex items-center gap-x-2 text-gray-600 text-sm font-[500] pl-6 py-4 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all">
            <div className="h-5 w-5 -ml- mb-1">
                <UserButton
                    appearance={{
                        elements: {
                            userButtonAvatarBox: "size-5",
                            userButtonTrigger: "p-0 hover:bg-transparent",
                            userButtonPopoverCard: { pointerEvents: "initial" }
                        }

                    }}
                />
            </div>
            <span className="pl-2 pt-1">{
                user?.fullName?.length && user?.fullName?.length > 20 ? user?.fullName?.slice(0, 20) + "..." : user?.fullName
            }</span>
        </div>
    )
}