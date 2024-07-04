import { Organization } from '@/types/org.interface'
import { Staff } from '@/types/staff.interface'
import { createSlice } from '@reduxjs/toolkit'

interface IUserData {
  organization: Organization | null
  staff: Staff | null
}

const initialState:IUserData = {
  organization: null,
  staff: null,
}

export const User = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      state.organization = action.payload.organization
      state.staff = action.payload.staff
    },
    logout: (state) => {
      state.organization = null
      state.staff = null
    },
    updateOrg : (state, action) => {
      state.organization = action.payload
    },
    updateStaff : (state, action) => {
      state.staff = action.payload
    }

  },
})

// Action creators are generated for each case reducer function
export const { login, logout, updateOrg, updateStaff } = User.actions

export default User.reducer