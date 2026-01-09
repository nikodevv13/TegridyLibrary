import useAuthors from "@/hooks/authors/useAuthors.ts";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Check, ChevronsUpDown} from "lucide-react";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command.tsx";
import {useState} from "react";
import {cn} from "@/components/ui/lib/utils.ts";

export interface AuthorAutocompleteProps {
    id: string;
    name: string;
    defaultValue?: string;
    disabled?: boolean;
}

export default function AuthorAutocomplete({id, name, defaultValue, disabled}: AuthorAutocompleteProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [value, setValue] = useState(defaultValue || '');
    const {data} = useAuthors();

    const authors = data || [];

    const selectedAuthor = authors.find(x => x.id === value);

    return (<>
            <input type="hidden" value={value} name={name}/>
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button
                        id={id}
                        disabled={disabled}
                        variant="outline"
                        role="combobox"
                        className="justify-between"
                    >
                        {selectedAuthor ? `${selectedAuthor.firstName} ${selectedAuthor.lastName}` : "Select author..."}
                        <ChevronsUpDown className="opacity-50"/>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                    <Command>
                        <CommandInput placeholder="Search author..." className="h-9"/>
                        <CommandList>
                            <CommandEmpty>No author found.</CommandEmpty>
                            <CommandGroup>
                                {authors.map((author) => (
                                    <CommandItem
                                        key={author.id}
                                        value={author.id}
                                        onSelect={(currentValue) => {
                                            setValue(currentValue === author.id ? "" : author.id)
                                            setIsOpen(false)
                                        }}
                                    >
                                        {author.firstName} {author.lastName}
                                        <Check
                                            className={cn(
                                                "ml-auto",
                                                value === author.id ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </>

    )
}