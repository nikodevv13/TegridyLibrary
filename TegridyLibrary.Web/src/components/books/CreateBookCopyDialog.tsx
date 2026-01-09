import {Button} from "@/components/ui/button"
import {
    Dialog,
    DialogClose, DialogContent,
    DialogFooter, DialogHeader, DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {Plus} from "lucide-react";
import {useState} from "react";
import type {BookCopyFormData} from "@/components/books/BookForm.tsx";
import BookCopyForm from "@/components/books/BookCopyForm.tsx";

export default interface CreateBookCopyDialogProps {
    onCreate: (formData: BookCopyFormData) => Promise<string | null>;
}

export function CreateBookCopyDialog({onCreate}: CreateBookCopyDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    
    async function handleSubmit(formData: BookCopyFormData) {
        const message = await onCreate(formData)
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
                <Button variant="outline">
                    <Plus/> Add a book copy
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <div className="contents">
                    <DialogHeader>
                        <DialogTitle>Create Book Copy</DialogTitle>
                    </DialogHeader>

                    <BookCopyForm message={message} formId={"book-copy-form-create"} onSubmit={handleSubmit} />

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button form={"book-copy-form-create"} type="submit">Create Book Copy</Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    )
}