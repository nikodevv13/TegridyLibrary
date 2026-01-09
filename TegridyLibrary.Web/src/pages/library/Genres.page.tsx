import AppSpinner from "@/components/AppSpinner.tsx";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {CreateGenreDialog} from "@/components/genres/CreateGenreDialog.tsx";
import {UpdateGenreDialog} from "@/components/genres/UpdateGenreDialog.tsx";
import {DeleteGenreDialog} from "@/components/genres/DeleteGenreDialog.tsx";
import useGenres from "@/hooks/genres/useGenres.ts";
import {useMemo, useState} from "react";
import SearchBar from "@/components/SearchBar.tsx";

export default function GenresPage() {
    const {data, isPending} = useGenres();
    const [searchPhrase, setSearchPhrase] = useState("");

    const genres = useMemo(() => {
        const loweredCaseSearchPhrase = searchPhrase.toLowerCase();
        return (data || []).filter(x => x.name.toLowerCase().includes(loweredCaseSearchPhrase));
    }, [searchPhrase, data]);


    if (isPending) {
        return <AppSpinner/>
    }

    return (
        <div className="flex flex-col gap-3">
            <div className="grid grid-cols-[1fr_auto] gap-3">
                <SearchBar onChange={setSearchPhrase} />
                <CreateGenreDialog />
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Id</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {genres.map((genre) => (
                        <TableRow key={genre.id}>
                            <TableCell>{genre.id}</TableCell>
                            <TableCell>{genre.name}</TableCell>
                            <TableCell className="text-right">
                                <div className="flex gap-1 justify-end">
                                    <DeleteGenreDialog genre={genre}/>
                                    <UpdateGenreDialog genre={genre}/>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}