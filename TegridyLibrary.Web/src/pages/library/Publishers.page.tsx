import AppSpinner from "@/components/AppSpinner.tsx";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import usePublishers from "@/hooks/publishers/usePublishers.ts";
import {CreatePublisherDialog} from "@/components/publishers/CreatePublisherDialog.tsx";
import {UpdatePublisherDialog} from "@/components/publishers/UpdatePublisherDialog.tsx";
import {DeletePublisherDialog} from "@/components/publishers/DeletePublisherDialog.tsx";
import {useMemo, useState} from "react";
import SearchBar from "@/components/SearchBar.tsx";

export default function PublishersPage() {
    const {data, isPending} = usePublishers();
    const [searchPhrase, setSearchPhrase] = useState("");

    const publishers = useMemo(() => {
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
                <CreatePublisherDialog/>
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
                    {publishers.map((publisher) => (
                        <TableRow key={publisher.id}>
                            <TableCell>{publisher.id}</TableCell>
                            <TableCell>{publisher.name}</TableCell>
                            <TableCell className="text-right">
                                <div className="flex gap-1 justify-end">
                                    <DeletePublisherDialog publisher={publisher}/>
                                    <UpdatePublisherDialog publisher={publisher}/>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}