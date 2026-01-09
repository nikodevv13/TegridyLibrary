import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";

export interface LanguageSelectProps {
    id: string;
    name: string
    defaultValue?: string
    required?: boolean
}

const languages = [
    { value: "PL", name: "Polish" },
    { value: "EN", name: "English" },
]

const selectItems = languages
    .map(x => (<SelectItem key={x.value} value={x.value}>{x.name}</SelectItem>));

export default function LanguageSelect({ id, name, defaultValue, required }: LanguageSelectProps){
    return (
        <Select name={name} defaultValue={defaultValue?.toUpperCase() || languages[0].value} required={required}>
            <SelectTrigger className="w-full">
                <SelectValue id={id} placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
                {selectItems}
            </SelectContent>
        </Select>
    )
}