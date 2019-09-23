import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  FileUploadModel,
  FileUploadStatus
} from '@real-world-app/shared-models';
import {
  featureAdapter,
  fileUploadFeatureKey,
  FileUploadState
} from './file-upload.reducer';

export const selectFileUploadState = createFeatureSelector<FileUploadState>(
  fileUploadFeatureKey
);

const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
} = featureAdapter.getSelectors();

export const selectAllFileUploads: (
  state: object
) => FileUploadModel[] = featureAdapter.getSelectors(selectFileUploadState)
  .selectAll;

export const selectAllIds = selectIds;
export const selectUploadEntities = selectEntities;
export const selectAllUploads = selectAll;
export const selectUploadTotal = selectTotal;

export const selectFileUploadById = (id: number) =>
  createSelector(
    selectAllFileUploads,
    (allUploads: FileUploadModel[]) => {
      if (allUploads) {
        return allUploads.find(p => p.id === id);
      } else {
        return null;
      }
    }
  );

export const selectFilesInQueue = createSelector(
  selectAllFileUploads,
  (allUploads: FileUploadModel[]) => {
    if (allUploads) {
      return allUploads.filter(f => f.status === FileUploadStatus.Ready);
    } else {
      return null;
    }
  }
);

export const selectFileUploadStatus = (id: number) =>
  createSelector(
    selectAllFileUploads,
    (allUploads: FileUploadModel[]) => {
      if (allUploads) {
        const upload = allUploads.find(p => p.id === id);
        return upload.status;
      } else {
        return null;
      }
    }
  );

export const selectTotalFilesInQueue = createSelector(
  selectFileUploadState,
  selectUploadTotal
);
