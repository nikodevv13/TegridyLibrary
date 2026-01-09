import {Button} from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {useMutation} from "@tanstack/react-query";
import {type FormEvent, useState} from "react";
import librariansClient from "@/clients/librarians/librariansClient.ts";
import {isAxiosError} from "axios";

export interface ChangePasswordDialogProps {
    isOpen: boolean;
    setIsOpen: (x: boolean) => void;
}

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/

function validateNewPasswords(currentPassword: string, newPassword1: string, newPassword2: string) {

    if (currentPassword === newPassword1) {
        return "New password must be different from the current password";
    }

    if (!passwordRegex.test(newPassword1)) {
        return "Password must contain at least: 8 characters, 1 lowercase letter, 1 uppercase letter, 1 number and 1 special character";
    }

    if (newPassword1 !== newPassword2) {
        return "Repatead password is not equal to the new password";
    }

    return null;
}

export function ChangePasswordDialog({isOpen, setIsOpen}: ChangePasswordDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <ChangePasswordDialogContent />
            </DialogContent>
        </Dialog>
    )
}

function ChangePasswordDialogContent() {
    const [validationMessage, setValidationMessage] = useState<string | null>();

    const {isSuccess, mutateAsync, isPending, isError, error} = useMutation({
        mutationFn: librariansClient.changePassword,

    });

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const currentPassword = (formData.get('currentPassword') as string)?.trim();
        const newPassword = formData.get('newPassword') as string;
        const newPassword2 = formData.get('newPassword2') as string;

        const validationMessage = validateNewPasswords(currentPassword, newPassword, newPassword2);
        if (validationMessage) {
            setValidationMessage(validationMessage);
            return;
        }

        try {
            await mutateAsync({currentPassword, newPassword});
        } catch {
            setValidationMessage("")
        }
    }

    const errorMessage = isError && isAxiosError(error) ? error.response!.data.message : validationMessage;

    return (
        <form onSubmit={handleSubmit} className="contents">
            <fieldset disabled={isPending} className="contents">
                <DialogHeader>
                    <DialogTitle>Change password</DialogTitle>
                    <DialogDescription className="text-justify">
                        Change password to your profile here.
                        <br/>
                        Click `Change&nbsp;password` when you&apos;re
                        done.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                    <div className="grid gap-3">
                        <Label htmlFor="currentPassword">Current password</Label>
                        <Input type="password" id="currentPassword" name="currentPassword"
                               placeholder="********"/>
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="newPassword">New password</Label>
                        <Input type="password" id="newPassword" name="newPassword" placeholder="********"/>
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="newPassword2">Repeat new password</Label>
                        <Input type="password" id="newPassword2" name="newPassword2" placeholder="********"/>
                    </div>
                </div>

                {!isSuccess && errorMessage ? (
                    <p className="text-destructive text-justify text-xs">
                        {errorMessage}
                    </p>
                ) : null}

                {isSuccess ? (
                    <p className="text-destructive text-justify text-xs">
                        Password changed successfully
                    </p>
                ) : null}

            </fieldset>

            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={isPending}>Change password</Button>
            </DialogFooter>
        </form>
    )
}