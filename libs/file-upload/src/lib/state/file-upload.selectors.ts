import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  UploadFileInputModel,
  UploadStatus
} from '@real-world-app/api-interfaces';
import { featureAdapter, FileUploadState } from './file-upload.reducer';

export const selectFileUploadState = createFeatureSelector<FileUploadState>(
  'fileUpload'
);

const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
} = featureAdapter.getSelectors();

export const selectAllFileUploads: (
  state: object
) => UploadFileInputModel[] = featureAdapter.getSelectors(selectFileUploadState)
  .selectAll;

export const selectAllIds = selectIds;
export const selectUploadEntities = selectEntities;
export const selectAllUploads = selectAll;
export const selectUploadTotal = selectTotal;

export const selectFileUploadById = (id: number) =>
  createSelector(
    selectAllFileUploads,
    (allUploads: UploadFileInputModel[]) => {
      if (allUploads) {
        return allUploads.find(p => p.id === id);
      } else {
        return null;
      }
    }
  );

export const selectFilesInQueue = createSelector(
  selectAllFileUploads,
  (allUploads: UploadFileInputModel[]) => {
    if (allUploads) {
      return allUploads.filter(f => f.status === UploadStatus.Ready);
    } else {
      return null;
    }
  }
);

export const selectFileUploadStatus = (id: number) =>
  createSelector(
    selectAllFileUploads,
    (allUploads: UploadFileInputModel[]) => {
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
