/**
 * Copyright 2025 Sony Semiconductor Solutions Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import DeviceModelSelectionPanel from "./components/DeviceModelSelectionPanel";
import ConfigurationParameterPanel from "./components/ConfigurationParameterPanel";
import { ButtonPanel } from "./components/ButtonPanel";
import ImageVisualizationPanel from "./components/ImageVisualizationPanel";

import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import { useAppContext } from "../../../stores/AppContext";

function RealtimeScreen() {
  const { setSocketActive } = useAppContext();

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100%",
        }}
      >
        <Grid
          container
          spacing={2}
          justifyContent="center"
          sx={{ width: "75vw" }}
        >
          <Grid
            container
            rowSpacing={1.5}
            direction={"column"}
            size={{ xs: 12, lg: 5 }}
          >
            <Grid size={12}>
              <DeviceModelSelectionPanel />
            </Grid>
            <Grid size={12}>
              <ConfigurationParameterPanel />
            </Grid>
            <Grid size={12}>
              <ButtonPanel setSocketActive={setSocketActive} />
            </Grid>
          </Grid>

          <Grid
            container
            rowSpacing={1.5}
            direction={"column"}
            size={{ xs: 12, lg: 7 }}
          >
            <Grid size={12}>
              <ImageVisualizationPanel />
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default RealtimeScreen;
