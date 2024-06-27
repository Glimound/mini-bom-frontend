export const getJwtToken = () => {
    return localStorage.getItem('jwtToken')
}

export const saveJwtToken = (jwtToken) => {
    localStorage.setItem('jwtToken', jwtToken)
}

export const deleteJwtToken = () => {
    localStorage.removeItem('jwtToken')
}

export const getUsername = () => {
    return localStorage.getItem('username')
}

export const saveUsername = (username) => {
    localStorage.setItem('username', username)
}

export const deleteUsername = () => {
    localStorage.removeItem('username')
}