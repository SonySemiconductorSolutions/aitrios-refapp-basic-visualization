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

import { useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import FolderIcon from "@mui/icons-material/Folder";

import { useDeviceDirectoryContext } from "../../../../stores/DeviceDirectoryContext";

export interface DirectorySelectorProps {
  directories: string[];
}

export function DirectorySelector({ directories }: DirectorySelectorProps) {
  const { imageDirectory, setImageDirectory } = useDeviceDirectoryContext();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleListItemClick = (directory: string, index: number) => {
    setSelectedIndex(index);
    const lastImageDirecrory = imageDirectory;
    if (directory != lastImageDirecrory) {
      setImageDirectory(directory);
    }
  };

  return (
    <>
      <List disablePadding>
        {directories
          ? directories.map((directory, index) => (
              <ListItem key={directory} sx={{ paddingY: "2px" }}>
                <ListItemButton
                  selected={selectedIndex === index}
                  onClick={() => handleListItemClick(directory, index)}
                >
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                  <ListItemText primary={directory} />
                </ListItemButton>
              </ListItem>
            ))
          : []}
      </List>
    </>
  );
}
