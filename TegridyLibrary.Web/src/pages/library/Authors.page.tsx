import AppSpinner from "@/components/AppSpinner.tsx";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {CreateAuthorDialog} from "@/components/authors/CreateAuthorDialog.tsx";
import {UpdateAuthorDialog} from "@/components/authors/UpdateAuthorDialog.tsx";
import useAuthors from "@/hooks/authors/useAuthors.ts";
import {DeleteAuthorDialog} from "@/components/authors/DeleteGenreDialog.tsx";
import SearchBar from "@/components/SearchBar.tsx";
import {useMemo, useState} from "react";

export default function AuthorsPage() {
    const {data, isPending} = useAuthors();
    const [searchPhrase, setSearchPhrase] = useState("");

    const authors = useMemo(() => {
        const loweredCaseSearchPhrase = searchPhrase.toLowerCase();
        return (data || []).filter(x => x.firstName.toLowerCase().includes(loweredCaseSearchPhrase) || x.lastName.toLowerCase().includes(loweredCaseSearchPhrase));
    }, [searchPhrase, data]);

    if (isPending) {
        return <AppSpinner/>
    }

    return (
        <div className="flex flex-col gap-3">
            <div className="grid grid-cols-[1fr_auto] gap-3">
                <SearchBar onChange={setSearchPhrase} />
                <CreateAuthorDialog />
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Id</TableHead>
                        <TableHead>First name</TableHead>
                        <TableHead>Last name</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {authors.map((author) => (
                        <TableRow key={author.id}>
                            <TableCell>{author.id}</TableCell>
                            <TableCell>{author.firstName}</TableCell>
                            <TableCell>{author.lastName}</TableCell>
                            <TableCell className="text-right">
                                <div className="flex gap-1 justify-end">
                                    <DeleteAuthorDialog author={author}/>
                                    <UpdateAuthorDialog author={author}/>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}