import AppSpinner from "@/components/AppSpinner.tsx";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {CreateReaderDialog} from "@/components/readers/CreateReaderDialog.tsx";
import {UpdateReaderDialog} from "@/components/readers/UpdateReaderDialog.tsx";
import useReaders from "@/hooks/readers/useReaders.ts";
import {DeleteReaderDialog} from "@/components/readers/DeleteReaderDialog.tsx";
import SearchBar from "@/components/SearchBar.tsx";
import {useMemo, useState} from "react";

export default function ReadersPage() {
    const {data, isPending} = useReaders();
    const [searchPhrase, setSearchPhrase] = useState("");

    const readers = useMemo(() => {
        const loweredCaseSearchPhrase = searchPhrase.toLowerCase();
        return (data || []).filter(x => x.firstName.toLowerCase().includes(loweredCaseSearchPhrase) || x.lastName.toLowerCase().includes(loweredCaseSearchPhrase) || x.email.toLowerCase().includes(loweredCaseSearchPhrase));
    }, [searchPhrase, data]);

    if (isPending) {
        return <AppSpinner/>
    }

    return (
        <div className="flex flex-col gap-3">
            <div className="grid grid-cols-[1fr_auto] gap-3">
                <SearchBar onChange={setSearchPhrase} />
                <CreateReaderDialog />
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Id</TableHead>
                        <TableHead>First name</TableHead>
                        <TableHead>Last name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {readers.map((reader) => (
                        <TableRow key={reader.id}>
                            <TableCell>{reader.id}</TableCell>
                            <TableCell>{reader.firstName}</TableCell>
                            <TableCell>{reader.lastName}</TableCell>
                            <TableCell>{reader.email}</TableCell>
                            <TableCell className="text-right">
                                <div className="flex gap-1 justify-end">
                                    <DeleteReaderDialog reader={reader}/>
                                    <UpdateReaderDialog reader={reader}/>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}