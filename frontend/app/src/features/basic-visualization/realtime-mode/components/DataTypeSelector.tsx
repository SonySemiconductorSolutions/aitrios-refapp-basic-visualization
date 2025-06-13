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

import { type SelectChangeEvent } from "@mui/material/Select";
import {
  isInitialStages,
  useScreenContext,
} from "../../../..//stores/ScreenContext";
import {
  CustomSelector,
  CustomSelectorItem,
} from "../../../../components/CustomSelector";
import { dataTypes } from "../../../../types/types";
import { useDeviceModelIdContext } from "../../../../stores/DeviceModelIdContext";

export default function DataTypeSelector() {
  const { screenStage } = useScreenContext();
  const { deviceId, dataType, setDataType } = useDeviceModelIdContext();

  const handleDataTypeSelection = (event: SelectChangeEvent) => {
    setDataType(event.target.value);
  };

  return (
    <CustomSelector
      label="Select DataType"
      disabled={deviceId === "" || !isInitialStages(screenStage)}
      items={dataTypes.map((dataType) => {
        return {
          value: dataType,
          name: dataType,
        } as CustomSelectorItem;
      })}
      value={dataType}
      onSelect={handleDataTypeSelection}
    />
  );
}
