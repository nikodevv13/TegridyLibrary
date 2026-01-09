import {
    ChevronsUpDown,
    CreditCard,
    LogOut, Moon, Sun, User,
} from "lucide-react"

import {
    Avatar,
    AvatarFallback,
} from "@/components/ui/avatar.tsx"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar.tsx"
import useApp, {selectors} from "@/hooks/useApp.ts";
import {ChangePasswordDialog} from "@/components/librarians/ChangePasswordDialog.tsx";
import {useState} from "react";

export interface LayoutNavUserProps {
    user: {
        name: string
        email: string
    }
}

export function LayoutNavUser({ user }: LayoutNavUserProps) {
    const {isMobile} = useSidebar()
    const themeMode = useApp(selectors.theme.mode);
    const setDarkMode = useApp(selectors.theme.setDarkMode);
    const setLightMode = useApp(selectors.theme.setLightMode);
    const logout = useApp(selectors.librarians.logout);

    const [isOpenChangePasswordDialog, setIsOpenChangePasswordDialog] = useState(false);

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarFallback className="rounded-lg">
                                    <User/>
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">{user.name}</span>
                                <span className="truncate text-xs">{user.email}</span>
                            </div>
                            <ChevronsUpDown className="ml-auto size-4"/>
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarFallback className="rounded-lg">
                                        <User/>
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">{user.name}</span>
                                    <span className="truncate text-xs">{user.email}</span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator/>
                        <DropdownMenuGroup>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <DropdownMenuItem>
                                        {themeMode === 'dark' ? <Moon/> : <Sun/>}
                                        Change Theme
                                    </DropdownMenuItem>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={setLightMode}>
                                        Light
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={setDarkMode}>
                                        Dark
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <DropdownMenuItem onClick={() => setIsOpenChangePasswordDialog(true)}>
                                <CreditCard/>
                                Change password
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem onClick={logout}>
                            <LogOut/>
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <ChangePasswordDialog isOpen={isOpenChangePasswordDialog} setIsOpen={setIsOpenChangePasswordDialog} />
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
