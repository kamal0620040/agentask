"use client";

import { useEffect } from "react";
import { ThemeProvider as NextThemesProvider, ThemeProviderProps, useTheme } from "next-themes"
import { useAppSelector } from "@/store/hooks"

function ThemeSync() {
    const reduxTheme = useAppSelector((state) => state.theme.mode);
    const { theme, setTheme } = useTheme();

    // sync redux to next-themes
    useEffect(() => {
        if (theme !== reduxTheme) {
            setTheme(reduxTheme);
        }
    }, [reduxTheme, theme, setTheme]);

    return null;
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
    return <NextThemesProvider {...props}>
        <ThemeSync />
        {children}
    </NextThemesProvider>
}