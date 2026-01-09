import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Field, FieldDescription, FieldGroup, FieldLabel} from "@/components/ui/field.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {ThemeModeToggle} from "@/components/ThemeModeToggle.tsx";
import type {FormEvent} from "react";
import useApp, {selectors} from "@/hooks/useApp.ts";
import {useMutation} from "@tanstack/react-query";
import {isAxiosError} from "axios";
import {Spinner} from "@/components/ui/spinner.tsx";

export default function LoginPage() {

    const {mutateAsync, isPending, isError, error} = useMutation({
        mutationFn: useApp(selectors.librarians.login)
    });

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const email = (formData.get('email') as string)?.trim();
        const password = formData.get('password') as string;

        await mutateAsync({ email, password });
    }

    return (
        <div className="grid w-screen h-screen justify-center items-center">
            <div className={"w-100 flex flex-col gap-6"}>
                <Card>
                    <CardHeader>
                        <CardTitle className={"flex justify-between items-center"}>
                            <span>
                                Login to your librarian account
                            </span>
                            <ThemeModeToggle/>
                        </CardTitle>
                        <CardDescription>
                            Enter your email below to login to your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor="email">Email</FieldLabel>
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        placeholder="email@example.com"
                                        required
                                        disabled={isPending}
                                    />
                                </Field>
                                <Field>
                                    <div className="flex items-center">
                                        <FieldLabel htmlFor="password">Password</FieldLabel>
                                    </div>
                                    <Input name="password" id="password" type="password" placeholder="********" required
                                           disabled={isPending}/>
                                </Field>
                                <Field>
                                    <Button type="submit" disabled={isPending}>{isPending ? <Spinner /> : 'Login'}</Button>
                                    <FieldDescription className="text-center text-destructive">
                                        {isError ? (isAxiosError(error) ? error.response!.data.message : '' ) || 'Unkown error ocurred' : ''}
                                    </FieldDescription>
                                </Field>
                            </FieldGroup>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}