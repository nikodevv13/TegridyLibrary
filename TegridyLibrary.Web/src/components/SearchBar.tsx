import {InputGroup, InputGroupAddon, InputGroupInput} from "@/components/ui/input-group.tsx";
import {Search} from "lucide-react";

export interface SearchBarProps {
    value?: string;
    isLoading?: boolean;
    onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
    return (
        <div className="flex w-full items-center gap-3">
            <InputGroup>
                <InputGroupInput value={value} onChange={x => onChange(x.currentTarget.value)}   />
                <InputGroupAddon>
                    <Search /> Search
                </InputGroupAddon>
            </InputGroup>
        </div>
    )
}

