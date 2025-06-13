# Copyright 2025 Sony Semiconductor Solutions Corp.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
# SPDX-License-Identifier: Apache-2.0
import logging
from datetime import datetime
from threading import Event
from threading import Thread
from typing import Optional

from app.client.client_factory import get_api_client
from app.data_management.classification.inference_deserialization import (
    deserialize as cl_deserialize,
)
from app.data_management.classification.inference_deserialization import (
    detection_data_to_json as cl_detection_data_to_json,
)
from app.data_management.object_detection.inference_deserialization import (
    deserialize as od_deserialize,
)
from app.data_management.object_detection.inference_deserialization import (
    detection_data_to_json as od_detection_data_to_json,
)
from app.schemas.common import DataType

logger = logging.getLogger(__name__)


def _process_timestamp(timestamp: str) -> str:
    try:
        return datetime.fromisoformat(timestamp).strftime("%Y%m%d%H%M%S%f")[:-3]
    except ValueError:
        return timestamp


class DevicePipeline:
    """DevicePipeline manages a thread that collects data from the device identified by device_id."""

    def __init__(self, device_id: str, api_client, data_queue):
        self.device_id: str = device_id
        self.data_thread = None
        self.active_pipeline: Event = Event()
        self.last_seen = None
        self.api_client = api_client
        self.data_queue = data_queue
        logger.debug(f"DevicePipeline initialized for device_id: {device_id}")

    def get_client(self):
        """Lazy initialization of the console client."""
        if not self.api_client:
            try:
                logger.debug("Initializing API client")
                self.api_client = get_api_client()
            except Exception as e:
                logger.error(f"Failed to initialize API client: {e}", exc_info=True)
                raise
        return self.api_client

    def stop_data_collection(self):
        logger.info(f"Stopping data collection for device_id: {self.device_id}")
        self.active_pipeline.clear()
        if self.data_thread is not None:
            self.data_thread.join()
            self.data_queue.clear()

    def is_active(self):
        return self.active_pipeline.is_set()

    def start_data_collection(
        self, get_image: bool = True, data_type: Optional[DataType] = None
    ):
        if not self.active_pipeline.is_set():
            logger.info(f"Starting data collection for device_id: {self.device_id}")
            self.active_pipeline.set()
            self.data_thread = Thread(
                target=self.collect_data, args=(get_image, data_type)
            )
            self.data_thread.start()

    def collect_data(
        self, get_image: bool = True, data_type: Optional[DataType] = None
    ):
        while self.active_pipeline.is_set():
            try:
                api_client = self.get_client()
                b64_image, raw_inference = api_client.get_latest_data(
                    device_id=self.device_id,
                    get_image=get_image,
                )

                if (
                    raw_inference["timestamp"]
                    and raw_inference["timestamp"] != self.last_seen
                ):
                    # Process datetime for better handling
                    processed_timestamp = _process_timestamp(raw_inference["timestamp"])

                    logger.debug(f"New data received for device_id: {self.device_id}")
                    if data_type == DataType.classification:
                        deserialize_inference = cl_deserialize(raw_inference["content"])
                        parsed_inference = cl_detection_data_to_json(
                            deserialize_inference
                        )
                    elif data_type == DataType.object_detection:
                        deserialize_inference = od_deserialize(raw_inference["content"])
                        parsed_inference = od_detection_data_to_json(
                            deserialize_inference
                        )
                    else:
                        parsed_inference = {}
                    self.data_queue.append(
                        (
                            b64_image,
                            parsed_inference,
                            processed_timestamp,
                            self.device_id,
                            raw_inference["model_id"],
                        )
                    )

                    self.last_seen = raw_inference["timestamp"]
            except Exception as e:
                logger.error(f"Data pipeline error in collect_data: {e}", exc_info=True)
                raise


class DataPipeline:
    """DataPipeline is in charge of centralizing the access to data from all devices."""

    def __init__(self):
        self.data_queue = []
        self.device_pipelines: dict[str, DevicePipeline] = {}
        self.api_client = None
        logger.debug("DataPipeline initialized")

    def get_client(self):
        """Lazy initialization of the console client."""
        if not self.api_client:
            try:
                logger.debug("Initializing API client")
                self.api_client = get_api_client()
            except Exception as e:
                logger.error(f"Failed to initialize API client: {e}", exc_info=True)
                raise
        return self.api_client

    def is_active(self, device_id=None):
        if device_id:
            if device_id in self.device_pipelines:
                return self.device_pipelines[device_id].is_active()
            else:
                return False
        else:
            for device_pipeline in self.device_pipelines:
                if self.device_pipelines[device_pipeline].is_active():
                    return True
            return False

    def get_device_pipeline(self, device_id: str):
        device_pipeline = self.device_pipelines.get(device_id, None)
        if not device_pipeline:
            logger.debug(f"Creating new DevicePipeline for device_id: {device_id}")
            device_pipeline = DevicePipeline(
                device_id, self.get_client(), self.data_queue
            )
            self.device_pipelines[device_id] = device_pipeline
        return device_pipeline

    def start_data_collection(
        self,
        device_id: str,
        get_image: bool = True,
        data_type: Optional[DataType] = None,
    ):
        logger.info(f"Starting data collection for device_id: {device_id}")
        device_pipeline = self.get_device_pipeline(device_id)
        device_pipeline.start_data_collection(get_image, data_type)

    def stop_data_collection(self, device_id: str):
        logger.info(f"Stopping data collection for device_id: {device_id}")
        device_pipeline = self.get_device_pipeline(device_id)
        device_pipeline.stop_data_collection()

    def reset_client(self) -> None:
        logger.info("Resetting the API client")

        logger.info(
            "Resetting device pipelines: "
            + str([elem.api_client for elem in self.device_pipelines.values()])
        )
        for device_pipeline in self.device_pipelines.values():
            device_pipeline.stop_data_collection()
        self.device_pipelines.clear()

        self.api_client = None

    def get_data(self):
        if self.data_queue:
            logger.debug("Retrieving data from data queue")
            return self.data_queue.pop(0)
        return None
