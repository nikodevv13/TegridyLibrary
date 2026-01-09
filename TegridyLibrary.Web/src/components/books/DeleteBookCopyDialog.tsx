import {Button} from "@/components/ui/button"
import {
    Dialog,
    DialogClose, DialogContent, DialogDescription,
    DialogFooter, DialogHeader, DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {Trash2} from "lucide-react";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import {useState} from "react";
import type {BookCopyFormData} from "@/components/books/BookForm.tsx";

export interface DeleteBookCopyDialogProps {
    bookCopy: BookCopyFormData & { key: string}
    onDelete: (key: string) => void;
}

export function DeleteBookCopyDialog({bookCopy, onDelete}: DeleteBookCopyDialogProps) {
    const [isOpen, setIsOpen] = useState(false);

    async function handleClick() {
        onDelete(bookCopy.key)
        setIsOpen(false);
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <DialogTrigger asChild>
                        <Button variant="outline" color="primary" size="sm">
                            <Trash2/>
                        </Button>
                    </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent>
                    Delete Book Copy
                </TooltipContent>
            </Tooltip>
            <DialogContent className="sm:max-w-[425px]">
                <div className="contents">
                    <DialogHeader>
                        <DialogTitle>Delete book copy</DialogTitle>
                    </DialogHeader>

                    <DialogDescription className="text-justify">
                        Are you sure you want to delete `{bookCopy.inventoryNumber}` book copy?
                    </DialogDescription>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button onClick={handleClick}>Delete Book Copy</Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    )
}
