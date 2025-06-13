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

import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";

import DeviceDirectorySelectionPanel from "./components/DeviceDirectorySelectionPanel";
import CheckDataPanel from "./components/CheckDataPanel";
import DataTypeSelector from "./components/DataTypeSelector";

function HistoryScreen() {
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
              <DeviceDirectorySelectionPanel />
            </Grid>
          </Grid>

          <Grid
            container
            rowSpacing={1.5}
            direction={"column"}
            size={{ xs: 12, lg: 7 }}
          >
            <Grid size={12}>
              <DataTypeSelector />
            </Grid>
            <Grid size={12}>
              <CheckDataPanel />
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default HistoryScreen;
