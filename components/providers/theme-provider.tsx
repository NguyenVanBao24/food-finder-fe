'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

/**
 * Senior Tip: Utilizing next-themes for robust theme management.
 * This provider handles the theme state and provides the necessary context
 * to the rest of the application. Using 'class' attribute allows us to
 * leverage Tailwind's dark mode utility.
 */
export function ThemeProvider({
    children,
    ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
    return (
        <NextThemesProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            {...props}
        >
            {children}
        </NextThemesProvider>
    );
}
