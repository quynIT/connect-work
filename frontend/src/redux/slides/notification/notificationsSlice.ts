import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import {
  Notification,
  NotificationsState,
  NotificationStatus,
  NotificationDetail,
  LoadingStatus,
} from "../notification/notification.types";

import { RootState } from "../../store";

const BASE_URL = "http://localhost:3000";
export const deleteNotification = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  "notifications/deleteNotification",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      await axios.delete(`${BASE_URL}/notifications/${id}`);
      await dispatch(fetchNotifications());
      return id;
    } catch (err) {
      const error = err as AxiosError;
      return rejectWithValue(error.message || "Failed to delete notification");
    }
  }
);

export const updateNotification = createAsyncThunk<
  Notification,
  { id: string; formData: FormData },
  { rejectValue: string }
>(
  "notifications/updateNotification",
  async ({ id, formData }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.put<Notification>(
        `${BASE_URL}/notifications/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      await dispatch(fetchNotifications());
      return response.data;
    } catch (err) {
      const error = err as AxiosError;
      return rejectWithValue(error.message || "Failed to update notification");
    }
  }
);

export const toggleNotificationStatus = createAsyncThunk<
  Notification,
  { id: string; currentStatus: "open" | "closed" },
  { rejectValue: string }
>(
  "notifications/toggleStatus",
  async ({ id, currentStatus }, { rejectWithValue, dispatch }) => {
    try {
      const newStatus = currentStatus === "open" ? "closed" : "open";
      const response = await axios.put<Notification>(
        `${BASE_URL}/notifications/${id}`,
        { status: newStatus }
      );
      await dispatch(fetchNotifications());
      return response.data;
    } catch (err) {
      const error = err as AxiosError;
      return rejectWithValue(error.message || "Failed to toggle status");
    }
  }
);
export const fetchNotifications = createAsyncThunk<
  Notification[],
  void,
  { rejectValue: string }
>("notifications/fetchNotifications", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get<Notification[]>(
      `${BASE_URL}/notifications`
    );
    return response.data;
  } catch (err) {
    const error = err as AxiosError;
    return rejectWithValue(error.message);
  }
});
export const fetchNotificationDetail = createAsyncThunk<
  NotificationDetail,
  string,
  { rejectValue: string }
>(
  "notificationDetail/fetchNotificationDetail",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get<NotificationDetail>(
        `${BASE_URL}/notifications/${id}`
      );
      return response.data;
    } catch (err) {
      const error = err as Error;
      return rejectWithValue(error.message);
    }
  }
);
export const createNotification = createAsyncThunk<
  Notification,
  FormData,
  { rejectValue: string }
>(
  "notifications/createNotification",
  async (formData, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.post<Notification>(
        `${BASE_URL}/notifications`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // Fetch fresh data after creation
      await dispatch(fetchNotifications());
      return response.data;
    } catch (err) {
      const error = err as AxiosError;
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to create notification"
      );
    }
  }
);
interface NotificationsState {
  items: Notification[];
  status: LoadingStatus;
  error: string | null;
  searchTerm: string;
  statusFilter: NotificationStatus | "all";
  currentNotification: NotificationDetail | null;
  detailStatus: LoadingStatus;
  detailError: string | null;
}

const initialState: NotificationsState = {
  items: [],
  status: "idle",
  error: null,
  searchTerm: "",
  statusFilter: "all",
  currentNotification: null,
  detailStatus: "idle",
  detailError: null,
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setStatusFilter: (
      state,
      action: PayloadAction<NotificationStatus | "all">
    ) => {
      state.statusFilter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Failed to fetch notifications";
      })
      .addCase(fetchNotificationDetail.pending, (state) => {
        state.detailStatus = "loading";
        state.detailError = null;
      })
      .addCase(fetchNotificationDetail.fulfilled, (state, action) => {
        state.detailStatus = "succeeded";
        state.currentNotification = action.payload;
      })
      .addCase(fetchNotificationDetail.rejected, (state, action) => {
        state.detailStatus = "failed";
        state.detailError =
          action.payload ?? "Failed to fetch notification detail";
      })
      .addCase(createNotification.fulfilled, (state, action) => {
        // Remove this since we're now fetching fresh data
        // state.items.push(action.payload);
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        // Handled by fetchNotifications
      })
      .addCase(updateNotification.fulfilled, (state, action) => {
        // Handled by fetchNotifications
      })
      .addCase(toggleNotificationStatus.fulfilled, (state, action) => {
        // Handled by fetchNotifications
      });
  },
});

export const { setSearchTerm, setStatusFilter } = notificationsSlice.actions;

// Selectors
export const selectAllNotifications = (state: RootState): Notification[] =>
  state.notifications.items;
export const selectNotificationStatus = (state: RootState): LoadingStatus =>
  state.notifications.status;
export const selectNotificationError = (state: RootState): string | null =>
  state.notifications.error;
export const selectSearchTerm = (state: RootState): string =>
  state.notifications.searchTerm;
export const selectCurrentNotification = (
  state: RootState
): NotificationDetail | null => state.notifications.currentNotification;

export const selectNotificationDetailStatus = (
  state: RootState
): LoadingStatus => state.notifications.detailStatus;

export const selectNotificationDetailError = (
  state: RootState
): string | null => state.notifications.detailError;
export const selectStatusFilter = (
  state: RootState
): NotificationStatus | "all" => state.notifications.statusFilter;

export const selectFilteredNotifications = (
  state: RootState
): Notification[] => {
  const notifications = selectAllNotifications(state);
  const searchTerm = selectSearchTerm(state);
  const statusFilter = selectStatusFilter(state);

  return notifications.filter((notification) => {
    // Add null checks
    const matchesSearch =
      notification?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification?.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false;
    const matchesStatus =
      statusFilter === "all" || notification?.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
};

export default notificationsSlice.reducer;
