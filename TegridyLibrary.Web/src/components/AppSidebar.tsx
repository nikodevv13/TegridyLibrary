import {
    Sidebar as Sidebar,
    SidebarContent, SidebarFooter,
    SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
} from "@/components/ui/sidebar.tsx"
import {
    Book, BookUser,
    Command, Landmark, ListTree, Map, UserCog, UserPen,
} from "lucide-react";
import {LayoutNav} from "@/components/LayoutNav.tsx";
import {LayoutNavUser} from "@/components/LayoutNavUser.tsx";
import {type ComponentProps, useMemo} from "react";
import useApp from "@/hooks/useApp.ts";

export default function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
    const { permissionsCache, librarian } = useApp();

    const data = useMemo(() => {
        const data = {
            user: {
                name: `${librarian!.firstName} ${librarian!.lastName}`,
                email: librarian!.email,
            },
            mainNav: [],
            managementNav: [],
        }

        if (permissionsCache.canManageBooks) {
            data.mainNav.push({
                name: "Books",
                url: "/library/books",
                icon: Book,
            } as never)

            data.mainNav.push({
                name: "Genres",
                url: "/library/genres",
                icon: ListTree,
            } as never)

            data.mainNav.push({
                name: "Authors",
                url: "/library/authors",
                icon: UserPen,
            } as never)

            data.mainNav.push({
                name: "Publishers",
                url: "/library/publishers",
                icon: Landmark,
            } as never)
        }

        if (permissionsCache.canManageBookLoans) {
            data.managementNav.push({
                name: "Book Loans",
                url: "/management/book-loans",
                icon: Map,
            } as never)
        }

        if (permissionsCache.canManageReaders) {
            data.managementNav.push({
                name: "Readers",
                url: "/management/readers",
                icon: BookUser,
            } as never)
        }

        if (permissionsCache.canManageLibrarians) {
            data.managementNav.push({
                name: "Librarians",
                url: "/management/librarians",
                icon: UserCog,
            } as never)
        }

        return data;
    }, [librarian, permissionsCache])

    return (
        <Sidebar variant="inset" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <div>
                                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                                    <Command className="size-4" />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">TegridyLibrary</span>
                                </div>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <LayoutNav libraryNav={data.mainNav} managementNav={data.managementNav} />
            </SidebarContent>
            <SidebarFooter>

                <LayoutNavUser user={data.user} />
            </SidebarFooter>
        </Sidebar>
    )
}