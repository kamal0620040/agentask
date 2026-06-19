import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";

export type TaskTitleFieldProps = {
    value: string;
    onChange: (value: string) => void;
    onBlur?: () => void;
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>;

export function TaskTitleField({
    value,
    onChange,
    onBlur,
    ...props
}: TaskTitleFieldProps) {
    const titleRef = useRef<HTMLInputElement | null>(null);
    const [buffer, setBuffer] = useState(value);
    const lastPropValueRef = useRef(value);

    // Sync buffer with prop value when it changes
    useEffect(() => {
        if (lastPropValueRef.current !== value) {
            setBuffer(value);
            if(titleRef.current && titleRef.current.value !== value) {
                titleRef.current.value = value;
            }
            lastPropValueRef.current = value;
        }
    }, [value]);

    // Keep DOM in sync with buffer
    useEffect(() => {
        if (titleRef.current && titleRef.current.value !== buffer) {
            titleRef.current.value = buffer;
        }
    }, [buffer]);


    return (
        <Input role="textbox" ref={titleRef} contentEditable onInput={(e) => setBuffer(e.currentTarget.value || '')} onBlur={() => {
            if(buffer !== value && buffer !== '') {
                onChange(buffer);
            }
            
            onBlur?.();
        }} {...props} />
    );
}