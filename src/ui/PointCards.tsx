"use client"
import Grid from "@mui/material/Unstable_Grid2/Grid2";

import { PointCard } from "./PointCard";
import { Alert, Divider, Typography } from "@mui/material";

type Props = {
  options: string[];
  onClick: (value: string) => void;
  activeOption?: string;
  isDisabled?: boolean;
}

export const PointCards = ({ options, onClick, activeOption, isDisabled }: Props) => (
  <>
    <Typography variant="h3">Storypoints</Typography>
    <Divider />
    <Grid container spacing={3} sx={{ mt: 2 }}>
      {options.map(o => (
        <Grid xs={12} sm={6} md={4} key={o}>
          <PointCard
            value={o}
            onClick={onClick}
            isDisabled={isDisabled}
            isActive={activeOption === o}
          />
        </Grid>
      ))}
    </Grid>
    {isDisabled && <Alert color="info" sx={{ mt: 2 }}>Voting locked, storypoints are in review.</Alert>}
  </>
);