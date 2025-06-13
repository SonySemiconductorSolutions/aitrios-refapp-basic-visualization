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

export type StatusResponse = {
  status: string;
};

export type BoundingBox = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};
export type GeneralObject = {
  class_id: number;
  bounding_box: BoundingBox;
  score: number;
};
export type ObjectDetectionData = {
  object_detection_list: GeneralObject[];
};
export type ObjectDetectionTop = {
  perception: ObjectDetectionData;
};

export type GeneralClassification = {
  class_id: number;
  score: number;
};

export type ClassificationData = {
  classification_list: GeneralClassification[];
};

export type ClassificationTop = {
  perception: ClassificationData;
};

export const dataTypes = ["ObjectDetection", "Classification"] as const;
export type DataType = (typeof dataTypes)[number];
