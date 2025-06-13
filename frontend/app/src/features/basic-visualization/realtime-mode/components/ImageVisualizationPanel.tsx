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

import Card from "@mui/material/Card";

import ImageInferenceDisplay from "../../components/ImageInferenceDisplay";
import { useImageInferenceContext } from "../../../../stores/ImageInferenceContext";
import { useDeviceModelIdContext } from "../../../../stores/DeviceModelIdContext";
import { DataType } from "../../../../types/types";

export default function ImageVisualizationPanel() {
  const { dataType } = useDeviceModelIdContext();
  const { inferenceTS, imageSrc, inferenceData, modelId } =
    useImageInferenceContext();

  return (
    <Card variant="outlined" sx={{ p: 2 }}>
      <ImageInferenceDisplay
        imageSrc={imageSrc}
        inferenceData={inferenceData}
        inferenceTS={inferenceTS}
        modelId={modelId}
        dataType={dataType as DataType}
      />
    </Card>
  );
}
