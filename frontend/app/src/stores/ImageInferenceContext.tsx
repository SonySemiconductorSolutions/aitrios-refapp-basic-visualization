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

import {
  createContext,
  useState,
  type ReactNode,
  useContext,
  useEffect,
} from "react";
import { timeParse } from "d3-time-format";
import { defaultImageSrc } from "./constants";
import { ObjectDetectionTop, ClassificationTop } from "../types/types";
import { useDeviceModelIdContext } from "./DeviceModelIdContext";
import { useDataStreamActiveContext } from "./DataStreamActiveContext";

export const averagingRange: number = 10 * 1000; // 10 seconds in milliseconds
export const dateParser = timeParse("%Y%m%d%H%M%S%L");

interface Props {
  children: ReactNode;
}

interface ImageInferenceContextType {
  imageSrc: string;
  setImageSrc: (value: string) => void;
  inferenceTS: string;
  inferenceData: ObjectDetectionTop | ClassificationTop | null;
  modelId: string;
  setInferenceData: (value: ObjectDetectionTop | ClassificationTop) => void;
  handleReceiveDataPoint: (data: {
    inference: ObjectDetectionTop;
    timestamp: string;
    image: string;
    deviceId: string;
    modelId: string;
  }) => void;
}

const ImageInferenceContext = createContext<ImageInferenceContextType>(
  {} as ImageInferenceContextType,
);

export function ImageInferenceContextProvider({ children }: Props) {
  const [imageSrc, setImageSrc] = useState<string>(defaultImageSrc);
  const [inferenceTS, setInferenceTS] = useState<string>("");
  const [inferenceData, setInferenceData] = useState<
    ObjectDetectionTop | ClassificationTop | null
  >(null);
  const [modelId, setModelId] = useState<string>("");
  const { deviceId } = useDeviceModelIdContext();
  const { dataStreamActive } = useDataStreamActiveContext();

  const handleReceiveDataPoint = (data: {
    inference: ObjectDetectionTop | ClassificationTop;
    timestamp: string;
    image: string;
    deviceId: string;
    modelId: string;
  }) => {
    if (data.deviceId != deviceId) return; // this data is from another device, do nothing
    if (!dataStreamActive) return;
    if (data.image) {
      const base64Image = data.image;
      const imageSrc = `data:image/jpeg;base64,${base64Image}`;
      setImageSrc(imageSrc);
    } else {
      setImageSrc("");
    }
    setInferenceData(data.inference);
    setInferenceTS(data.timestamp);
    setModelId(data.modelId);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {}, averagingRange);
    return () => clearTimeout(timeout);
  }, [averagingRange, dataStreamActive]);

  return (
    <ImageInferenceContext.Provider
      value={{
        imageSrc,
        setImageSrc,
        inferenceTS,
        inferenceData,
        modelId,
        setInferenceData,
        handleReceiveDataPoint,
      }}
    >
      {children}
    </ImageInferenceContext.Provider>
  );
}

export function useImageInferenceContext(): ImageInferenceContextType {
  return useContext(ImageInferenceContext);
}
