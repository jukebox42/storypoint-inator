"use client"
import { IconButton, InputAdornment, TextField } from "@mui/material";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

type Props = {
  sessionId: string;
}

export const JoinLink = ({ sessionId }: Props) => {
  const joinUrl = `https://storypoint-inator.vercel.app/session/${sessionId}`;

  const handleCopy = () => navigator.clipboard.writeText(joinUrl);

  return (
    <TextField
      fullWidth
      aria-label="Join url"
      InputProps={{
        endAdornment: (
        <InputAdornment position="end">
          <IconButton onClick={handleCopy}><ContentCopyIcon /></IconButton>
        </InputAdornment>
        ),
      }}
      disabled
      value={joinUrl}
      onChange={() => joinUrl}
    />
  );
}