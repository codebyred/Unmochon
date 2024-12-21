'use client';

import {
    MultiImageDropzone,
    type FileState,
} from '@/components/MultiImageDropzone';
import { useEdgeStore } from '@/lib/edgestore';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MagicBackButton } from '@/components/button/MagicBackButton';

export default function Fileupload() {
    const [fileStates, setFileStates] = useState<FileState[]>([]);
    const { edgestore } = useEdgeStore();

    function updateFileProgress(key: string, progress: FileState['progress']) {
        setFileStates((fileStates) => {
            const newFileStates = structuredClone(fileStates);
            const fileState = newFileStates.find(
                (fileState) => fileState.key === key,
            );
            if (fileState) {
                fileState.progress = progress;
            }
            return newFileStates;
        });
    }

    return (
        <div className=''>   
            <div className='flex justify-between mb-4'>
                <MagicBackButton/>
                <Button onClick={async () => {
                    await Promise.all(
                        fileStates.map(async (fileState) => {
                            try {
                                const res = await edgestore.publicFiles.upload({
                                    file: typeof fileState.file === 'string' ? new File([], fileState.file) : fileState.file,
                                    onProgressChange: async (progress) => {
                                        updateFileProgress(fileState.key, progress);
                                        if (progress === 100) {
                                            // wait 1 second to set it to complete
                                            // so that the user can see the progress bar at 100%
                                            await new Promise((resolve) => setTimeout(resolve, 1000));
                                            updateFileProgress(fileState.key, 'COMPLETE');
                                        }
                                    },
                                });
                            } catch (err) {
                                updateFileProgress(fileState.key, 'ERROR');
                            }
                        }),
                    );
                }}>
                    Upload
                </Button>
            </div> 
            <MultiImageDropzone
                value={fileStates}
                dropzoneOptions={{
                    maxFiles: 6,
                }}
                onChange={(files) => {
                    setFileStates(files);
                }}
                onFilesAdded={async (addedFiles) => {
                    setFileStates([...fileStates, ...addedFiles]);
                }}
            />   
        </div>
    );
}