import useLibrarians from "@/hooks/librarians/useLibrarians.ts";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {getLibrarianPermissionLabel} from "@/clients/librarians/models/LibrarianPermissions";
import AppSpinner from "@/components/AppSpinner.tsx";
import {UpdateLibrarianDialog} from "@/components/librarians/UpdateLibrarianDialog.tsx";
import {CreateLibrarianDialog} from "@/components/librarians/CreateLibrarianDialog.tsx";
import {ResetLibrarianPasswordDialog} from "@/components/librarians/ResetLibrarianPasswordDialog.tsx";
import {DeleteLibrarianDialog} from "@/components/librarians/DeleteLibrarianDialog.tsx";
import useApp, {selectors} from "@/hooks/useApp.ts";

export default function LibrariansPage() {
    const currentLoggedInLibrarian = useApp(selectors.librarians.current);
    const {data, isPending} = useLibrarians();

    const librarians = data?.data || [];

    if (isPending) {
        return <AppSpinner/>
    }

    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>First Name</TableHead>
                        <TableHead>Last Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Permissions</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {librarians.map((librarian) => (
                        <TableRow key={librarian.id}>
                            <TableCell>{librarian.firstName}</TableCell>
                            <TableCell>{librarian.lastName}</TableCell>
                            <TableCell>{librarian.email}</TableCell>
                            <TableCell>
                                <div className="flex flex-wrap gap-1">
                                    {librarian.permissions.map((p) => (
                                        <span
                                            key={p}
                                            className="rounded-md bg-muted px-2 py-0.5 text-xs"
                                        >{getLibrarianPermissionLabel(p)}</span>
                                    ))}
                                </div>
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex gap-1 justify-end">
                                    {librarian.id === currentLoggedInLibrarian?.id ? null : (
                                        <>
                                            <DeleteLibrarianDialog librarian={librarian}/>
                                            <ResetLibrarianPasswordDialog librarian={librarian}/>
                                        </>
                                    )}
                                    <UpdateLibrarianDialog librarian={librarian}/>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                    <TableRow>
                        <TableCell colSpan={5} className="text-center">
                            <CreateLibrarianDialog/>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    );
}