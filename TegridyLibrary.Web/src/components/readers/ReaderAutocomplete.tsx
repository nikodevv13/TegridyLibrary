import useReaders from "@/hooks/readers/useReaders.ts";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Check, ChevronsUpDown} from "lucide-react";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command.tsx";
import {useState} from "react";
import {cn} from "@/components/ui/lib/utils.ts";

export interface ReaderAutocompleteProps {
    id: string;
    name: string;
    defaultValue?: string;
    disabled?: boolean;
}

export default function ReaderAutocomplete({id, name, defaultValue, disabled}: ReaderAutocompleteProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [value, setValue] = useState(defaultValue || '');
    const {data} = useReaders();

    const readers = data || [];

    const currentReader = readers.find(x => x.id === value) || null;

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
                        {currentReader ? `${currentReader.firstName} ${currentReader.lastName} [${currentReader.email}]` : "Select reader..."}
                        <ChevronsUpDown className="opacity-50"/>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                    <Command>
                        <CommandInput placeholder="Search reader..." className="h-9"/>
                        <CommandList>
                            <CommandEmpty>No reader found.</CommandEmpty>
                            <CommandGroup>
                                {readers.map((reader) => (
                                    <CommandItem
                                        key={reader.id}
                                        value={reader.id}
                                        onSelect={(currentValue) => {
                                            setValue(currentValue === reader.id ? "" : reader.id)
                                            setIsOpen(false)
                                        }}
                                    >
                                        {reader.firstName} {reader.lastName} [{reader.email}]
                                        <Check
                                            className={cn(
                                                "ml-auto",
                                                value === reader.id ? "opacity-100" : "opacity-0"
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