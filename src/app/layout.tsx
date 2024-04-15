"use client"
import "./globals.css";
import { Container, CssBaseline, ThemeProvider } from "@mui/material";
import { theme } from "#/theme";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <CssBaseline />
        <ThemeProvider theme={theme}>
          <Container maxWidth="md">
            {children}
          </Container>
        </ThemeProvider>
      </body>
    </html>
  );
}
