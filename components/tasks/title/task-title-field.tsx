import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";

export type TaskTitleFieldProps = {
    value: string;
    onChange: (value: string) => void;
    onBlur?: () => void;
    placeholder?: string;
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>;

export function TaskTitleField({
    value,
    onChange,
    onBlur,
    placeholder,
    ...props
}: TaskTitleFieldProps) {
    const titleRef = useRef<HTMLInputElement | null>(null);
    const [buffer, setBuffer] = useState(value);
    const [prevValue, setPrevValue] = useState(value);

    // Sync buffer with prop value if it changes from outside
    if (value !== prevValue) {
        setPrevValue(value);
        setBuffer(value);
    }

    // Keep DOM in sync with buffer
    useEffect(() => {
        if (titleRef.current && titleRef.current.value !== buffer) {
            titleRef.current.value = buffer;
        }
    }, [buffer]);


    return (
        <Input role="textbox" ref={titleRef} contentEditable placeholder={placeholder} onInput={(e) => setBuffer(e.currentTarget.value || '')} onBlur={() => {
            if(buffer !== value && buffer !== '') {
                onChange(buffer);
            }
            
            onBlur?.();
        }} {...props} />
    );
}