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

import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";

import Canvas from "../../components/Canvas";
import ImageInferenceDisplay from "../../components/ImageInferenceDisplay";

import { useScreenContext } from "../../../../stores/ScreenContext";
import { VisualizeData } from "../../../../utils/ImagesAndInferencesFromConsole";
import { DataType } from "../../../../types/types";

export interface ImageGridProps {
  visualizeData: VisualizeData[];
  dataType: string;
}

export function ImageGrid({ visualizeData, dataType }: ImageGridProps) {
  const { canvasWidth, canvasHeight } = useScreenContext();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [currentData, setCurrentData] = useState<VisualizeData | null>(null);
  const handleListItemClick = (index: number, data: VisualizeData) => {
    setSelectedIndex(index);
    setCurrentData(data);
    if (!open) handleOpen();
  };

  useEffect(() => {
    setSelectedIndex(null);
  }, [visualizeData]);

  return (
    <>
      <ImageList
        sx={{
          justifyContent: "center",
          gridTemplateColumns:
            "repeat(auto-fill, minmax(150px, 1fr))!important",
          padding: 1,
        }}
      >
        {visualizeData
          ? visualizeData.map((data, index) => (
              <ImageListItem
                key={index}
                style={
                  selectedIndex === index ? { outline: "3px solid red" } : {}
                }
                onClick={() => handleListItemClick(index, data)}
              >
                <Canvas
                  width={canvasWidth}
                  height={canvasHeight}
                  imageSrc={`data:image/jpeg;base64,${data.image}`}
                  inferenceData={data.inference}
                  dataType={dataType as DataType}
                />
              </ImageListItem>
            ))
          : []}
      </ImageList>
      {currentData ? (
        <Modal open={open} onClose={handleClose}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              borderRadius: 1,
              p: 3,
              width: "50vw",
              minWidth: "600px",
            }}
          >
            <ImageInferenceDisplay
              imageSrc={`data:image/jpeg;base64,${currentData.image}`}
              inferenceData={currentData.inference}
              inferenceTS={currentData.timestamp}
              modelId={currentData.model_id}
              dataType={dataType as DataType}
            />
          </Box>
        </Modal>
      ) : (
        <></>
      )}
    </>
  );
}
