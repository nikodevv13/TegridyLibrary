import useGenres from "@/hooks/genres/useGenres.ts";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Check, ChevronsUpDown} from "lucide-react";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command.tsx";
import {useState} from "react";
import {cn} from "@/components/ui/lib/utils.ts";

export interface GenreAutocompleteProps {
    id: string;
    name: string;
    defaultValue?: string;
    disabled?: boolean;
}

export default function GenreAutocomplete({id, name, defaultValue, disabled}: GenreAutocompleteProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [value, setValue] = useState(defaultValue || '');
    const {data} = useGenres();

    const genres = data || [];

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
                        {value ? genres.find(x => x.id === value)?.name : "Select genre..."}
                        <ChevronsUpDown className="opacity-50"/>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                    <Command>
                        <CommandInput placeholder="Search genre..." className="h-9"/>
                        <CommandList>
                            <CommandEmpty>No genre found.</CommandEmpty>
                            <CommandGroup>
                                {genres.map((genre) => (
                                    <CommandItem
                                        key={genre.id}
                                        value={genre.id}
                                        onSelect={(currentValue) => {
                                            setValue(currentValue === genre.id ? "" : genre.id)
                                            setIsOpen(false)
                                        }}
                                    >
                                        {genre.name}
                                        <Check
                                            className={cn(
                                                "ml-auto",
                                                value === genre.id ? "opacity-100" : "opacity-0"
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