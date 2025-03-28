
import { User } from '@/types/user';
import { z } from 'zod';

export interface UserManagementState {
  users: User[];
  isLoading: boolean;
}

export interface ActivityTimerState {
  activityTimerRef: React.MutableRefObject<number | null>;
  inactivityTimeoutMs: number;
}

export interface FetchUsersState {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  isLoading: boolean;
  fetchUsers: () => Promise<void>;
}

export interface IDVerificationState {
  frontImagePreview: string | null;
  backImagePreview: string | null;
  frontImageFile: File | null;
  backImageFile: File | null;
  isUploading: boolean;
}

export interface CameraCaptureState {
  isCameraActive: boolean;
  activeCamera: 'front' | 'back';
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}
