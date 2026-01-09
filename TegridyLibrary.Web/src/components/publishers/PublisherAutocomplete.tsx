import usePublishers from "@/hooks/publishers/usePublishers.ts";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Check, ChevronsUpDown} from "lucide-react";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command.tsx";
import {useState} from "react";
import {cn} from "@/components/ui/lib/utils.ts";

export interface PublisherPublisherAutocompleteProps {
    id: string;
    name: string;
    defaultValue?: string;
    disabled?: boolean;
}

export default function PublisherAutocomplete({id, name, defaultValue, disabled}: PublisherPublisherAutocompleteProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [value, setValue] = useState(defaultValue || '');
    const {data} = usePublishers();

    const publishers = data || [];

    const selectedPublisher = publishers.find(x => x.id === value);

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
                        {selectedPublisher ? selectedPublisher.name : "Select publisher..."}
                        <ChevronsUpDown className="opacity-50"/>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                    <Command>
                        <CommandInput placeholder="Search publisher..." className="h-9"/>
                        <CommandList>
                            <CommandEmpty>No publisher found.</CommandEmpty>
                            <CommandGroup>
                                {publishers.map((publisher) => (
                                    <CommandItem
                                        key={publisher.id}
                                        value={publisher.id}
                                        onSelect={(currentValue) => {
                                            setValue(currentValue === publisher.id ? "" : publisher.id)
                                            setIsOpen(false)
                                        }}
                                    >
                                        {publisher.name}
                                        <Check
                                            className={cn(
                                                "ml-auto",
                                                value === publisher.id ? "opacity-100" : "opacity-0"
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