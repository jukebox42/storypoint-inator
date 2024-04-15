import type { Metadata } from "next";
import "./globals.css";
import { Box, Container, CssBaseline, ThemeProvider } from "@mui/material";
import { theme } from "#/theme";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

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