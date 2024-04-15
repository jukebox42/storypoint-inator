"use client"
import { theme } from "#/theme";
import { Card, CardActionArea, Typography } from "@mui/material";

type Props = {
  value: string;
  onClick: (value: string) => void;
  isActive?: boolean;
  isDisabled?: boolean;
}

const setBgColor = (isActive: boolean, isDisabled: boolean) => {
  if (isActive && isDisabled) {
    return theme.palette.primary.main;
  }

  if (isDisabled) {
    return theme.palette.divider;
  }

  if (isActive) {
    return theme.palette.primary.light;
  }

  return undefined;
}

export const PointCard = ({ value, onClick, isActive, isDisabled }: Props) => {
  const handleClick = (value: string) => {
    if (isDisabled) {
      return;
    }
    onClick(value);
  }
  return (
    <Card sx={{ bgcolor: setBgColor(!!isActive, !!isDisabled) }}>
      <CardActionArea
        disabled={isDisabled}
        sx={{ p: 3, textAlign: "center" }}
        onClick={() => handleClick(value)}
      >
        <Typography variant="h2" color={isDisabled ? "disabled" : undefined}>
          {value}
        </Typography>
      </CardActionArea>
    </Card>
  );
};