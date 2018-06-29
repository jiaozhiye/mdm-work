import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const RoleKey  = 'Admin-Role'

export const getToken = () => Cookies.get(TokenKey)

export const setToken = token => Cookies.set(TokenKey, token)

export const removeToken = () => Cookies.remove(TokenKey)

export const getRoles = () => Cookies.get(RoleKey)

export const setRoles = roles => Cookies.set(RoleKey, roles)

export const removeRoles = () => Cookies.remove(RoleKey)
