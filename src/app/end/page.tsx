"use client"
import { Button, Paper, Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return (
    <Paper sx={{ width: 600, p: 3, mt: 3, mr: "auto", ml: "auto" }}>
      <Stack spacing={3} direction="row" justifyContent="center" alignItems="center">
        <Typography>Thank you for playing. You can close this page.</Typography>
        <Button onClick={() => router.push("/")}>Start New Session</Button>
      </Stack>
    </Paper>
  );
}
