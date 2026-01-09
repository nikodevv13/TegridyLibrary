import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger
} from "@/components/ui/sidebar.tsx"
import {
    Breadcrumb,
    BreadcrumbPage,
    BreadcrumbList,
    BreadcrumbItem
} from "./ui/breadcrumb.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import AppSidebar from "@/components/AppSidebar.tsx";
import {Outlet} from "react-router";
import {useLocation} from "react-router-dom";
import {useMemo} from "react";

function getPageTitle(pathName: string) {
    const loweredCasePathName = pathName.toLowerCase();

    if (loweredCasePathName.includes("librarians")) {
        return "Librarians";
    } else if (loweredCasePathName.includes("readers")) {
        return "Readers";
    } else if (loweredCasePathName.includes("book-loans")) {
        return "Book Loans";
    } else if (loweredCasePathName.includes("books")) {
        return "Books";
    } else if (loweredCasePathName.includes("genres")) {
        return "Genres";
    } else if (loweredCasePathName.includes("authors")) {
        return "Authors";
    } else if (loweredCasePathName.includes("publishers")) {
        return "Publishers";
    }
}

export default function Layout() {
    const location = useLocation();
    const pageTitle = useMemo(() =>  getPageTitle(location.pathname), [location.pathname]);

    return (
        <SidebarProvider>
            <title>{pageTitle}</title>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                            orientation="vertical"
                            className="mr-2 data-[orientation=vertical]:h-4"
                        />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <Outlet />
             </div>
            </SidebarInset>
        </SidebarProvider>
    )
}