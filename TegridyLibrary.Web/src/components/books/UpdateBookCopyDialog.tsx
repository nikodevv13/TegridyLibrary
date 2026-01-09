import {Button} from "@/components/ui/button"
import {
    Dialog,
    DialogClose, DialogContent,
    DialogFooter, DialogHeader, DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {Pencil} from "lucide-react";
import {useState} from "react";
import type {BookCopyFormData} from "@/components/books/BookForm.tsx";
import BookCopyForm from "@/components/books/BookCopyForm.tsx";
import {Tooltip} from "@radix-ui/react-tooltip";
import {TooltipContent, TooltipTrigger} from "@/components/ui/tooltip.tsx";

export default interface UpdateBookCopyDialogProps {
    bookCopy: BookCopyFormData & { key: string };
    onUpdate: (key: string, formData: BookCopyFormData) => Promise<string | null>;
}

export function UpdateBookCopyDialog({bookCopy, onUpdate}: UpdateBookCopyDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    
    async function handleSubmit(formData: BookCopyFormData) {
        const message = await onUpdate(bookCopy.key, formData)
        if (message) {
            setMessage(message);
            return
        }
        setIsOpen(false);
    }

    function handleOpenChange(isOpen: boolean) {
        setIsOpen(isOpen);
        if (!isOpen) {
            setMessage("");
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <DialogTrigger asChild>
                            <Button variant="outline" color="primary" size="sm">
                                <Pencil/>
                            </Button>
                        </DialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                        Update Book Copy
                    </TooltipContent>
                </Tooltip>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <div className="contents">
                    <DialogHeader>
                        <DialogTitle>Update Book Copy</DialogTitle>
                    </DialogHeader>

                    <BookCopyForm defaultValues={bookCopy} message={message} formId={"book-copy-form-update"} onSubmit={handleSubmit} />

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button form={"book-copy-form-update"} type="submit">Update Book Copy</Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    )
}