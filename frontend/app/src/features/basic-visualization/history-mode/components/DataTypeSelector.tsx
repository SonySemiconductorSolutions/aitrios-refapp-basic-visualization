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
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import { type SelectChangeEvent } from "@mui/material/Select";

import {
  CustomSelector,
  CustomSelectorItem,
} from "../../../../components/CustomSelector";

import { dataTypes } from "../../../../types/types";
import { useDeviceDirectoryContext } from "../../../../stores/DeviceDirectoryContext";

export default function DataTypeSelector() {
  const { dataType, setDataType } = useDeviceDirectoryContext();
  const handleDataTypeSelection = (event: SelectChangeEvent) => {
    setDataType(event.target.value);
  };

  return (
    <Card variant="outlined" sx={{ p: 2 }}>
      <Grid container columns={12} sx={{ alignItems: "center" }}>
        <Grid size={2}>
          <Typography variant="body1" fontWeight="bold">
            DataType:
          </Typography>
        </Grid>
        <Grid size={10}>
          <CustomSelector
            label="Select Data Type"
            items={dataTypes.map((dataType) => {
              return {
                value: dataType,
                name: dataType,
              } as CustomSelectorItem;
            })}
            value={dataType}
            onSelect={handleDataTypeSelection}
          />
        </Grid>
      </Grid>
    </Card>
  );
}
