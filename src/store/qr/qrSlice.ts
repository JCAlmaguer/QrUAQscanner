import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface QrState {
  online: boolean | null;
  unsentPayload: boolean;
  expedientesPormandar: Array<string>;
  temporalStundetIds: Array<string>;
  currentSpreadsheetPage: string;
  spreadsheetPages: Array<string>;
  loading: boolean;
  sheetsId: string;
}

const initialState: QrState = {
  sheetsId: '',
  online: null,
  unsentPayload: false,
  expedientesPormandar: [],
  currentSpreadsheetPage: '',
  temporalStundetIds: [],
  spreadsheetPages: [],
  loading: false,
};

export const qrSlice = createSlice({
  name: 'qr',
  initialState,
  reducers: {
    setSheetsId: (state, action) => {
      state.sheetsId = action.payload; // Añade este reductor para manejar la actualización del ID de la hoja de cálculo
    },
    switchOnline: (state: QrState, action: PayloadAction<boolean>) => {
      return {
        ...state,
        online: action.payload,
      };
    },
    addpendingExpediente: (state: QrState, action: PayloadAction<string>) => {
      return {
        ...state,
        expedientesPormandar: [...state.expedientesPormandar, action.payload],
        unsentPayload: true,
      };
    },
    removependingExpediente: (
      state: QrState,
      action: PayloadAction<string>
    ) => {
      return {
        ...state,
        expedientesPormandar: state.expedientesPormandar.filter(
          (expediente) => expediente !== action.payload
        ),
        unsentPayload: state.expedientesPormandar.length > 0,
      };
    },
    selectSpreadsheetPage: (state: QrState, action: PayloadAction<string>) => {
      return {
        ...state,
        currentSpreadsheetPage: action.payload,
      };
    },
    addTemporalStudentId: (state: QrState, action: PayloadAction<string>) => {
      return {
        ...state,
        temporalStundetIds: [...state.temporalStundetIds, action.payload],
      };
    },
    clearTemporalStudentIds: (state: QrState) => {
      return {
        ...state,
        temporalStundetIds: [],
      };
    },
    setSpreadsheetPages: (state: QrState, action: PayloadAction<Array<string>>) => {
      return {
        ...state,
        spreadsheetPages: action.payload,
      };
    },
    setLoading: (state: QrState, action: PayloadAction<boolean>) => {
      return {
        ...state,
        loading: action.payload,
      };
    },
  },

});

export const {
  setSheetsId,
  switchOnline,
  addpendingExpediente,
  removependingExpediente,
  selectSpreadsheetPage,
  addTemporalStudentId,
  clearTemporalStudentIds,
  setSpreadsheetPages,
  setLoading
} = qrSlice.actions;
export default qrSlice.reducer;
